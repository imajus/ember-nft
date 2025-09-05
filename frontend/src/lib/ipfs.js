/**
 * Convert IPFS URL to Pinata gateway URL
 * @param {string} ipfsUrl - IPFS URL (ipfs://hash or ipfs://hash/path)
 * @returns {string} HTTP gateway URL
 */
export function convertIpfsToHttp(ipfsUrl) {
  if (!ipfsUrl || typeof ipfsUrl !== 'string') {
    return ipfsUrl;
  }

  if (ipfsUrl.startsWith('ipfs://')) {
    const hash = ipfsUrl.replace('ipfs://', '');
    const relayerUrl = import.meta.env.VITE_PINATA_RELAYER_URL;
    return `${relayerUrl}/${hash}`;
  }

  if (ipfsUrl.startsWith('https://') || ipfsUrl.startsWith('http://')) {
    return ipfsUrl;
  }

  return ipfsUrl;
}

/**
 * Extract metadata from token URI (supports both IPFS and HTTP URLs)
 * @param {string} tokenURI - Token URI from contract
 * @returns {Promise<Object|null>} Token metadata object or null if failed
 */
export async function fetchTokenMetadata(tokenURI) {
  if (!tokenURI) return null;

  try {
    const httpUrl = convertIpfsToHttp(tokenURI);
    const response = await fetch(httpUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const metadata = await response.json();
    return metadata;
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return null;
  }
}

/**
 * Get image URL from token metadata, converting IPFS URLs to HTTP
 * @param {Object} metadata - Token metadata object
 * @returns {string} HTTP image URL or placeholder
 */
export function getImageFromMetadata(metadata) {
  if (!metadata || !metadata.image) {
    return 'https://placehold.co/300x300?text=404';
  }

  return convertIpfsToHttp(metadata.image);
}

/**
 * Upload a file to IPFS using the Pinata Relayer
 * @param {File} file - The file to upload
 * @param {Object} options - Upload options
 * @param {string} options.name - Optional name for the file
 * @param {Object} options.keyvalues - Optional metadata key-value pairs
 * @returns {Promise<Object>} Upload response with IPFS hash
 */
export async function uploadFileToIPFS(file, options = {}) {
  if (!file || !(file instanceof File)) {
    throw new Error('Valid file is required');
  }

  const relayerUrl =
    import.meta.env.VITE_PINATA_RELAYER_URL || 'http://localhost:8787';

  try {
    // Step 1: Get presigned upload URL from Pinata Relayer
    const uploadUrlOptions = {
      expires: 1800, // 30 minutes
    };

    // Add optional parameters
    if (options.name) {
      uploadUrlOptions.name = options.name;
    }
    if (options.keyvalues) {
      uploadUrlOptions.keyvalues = options.keyvalues;
    }
    if (file.size > 0) {
      uploadUrlOptions.maxFileSize = Math.max(file.size * 2, 10 * 1024 * 1024); // At least 10MB or 2x file size
    }
    if (file.type) {
      uploadUrlOptions.mimeTypes = [file.type];
    }

    const urlResponse = await fetch(`${relayerUrl}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadUrlOptions),
    });

    if (!urlResponse.ok) {
      const errorData = await urlResponse
        .json()
        .catch(() => ({ error: 'Failed to get upload URL' }));
      throw new Error(
        `Failed to get upload URL: ${
          errorData.message || errorData.error || urlResponse.statusText
        }`
      );
    }

    const { success, uploadUrl } = await urlResponse.json();

    if (!success || !uploadUrl) {
      throw new Error(
        'Invalid response from Pinata Relayer - missing upload URL'
      );
    }

    // Step 2: Upload file using the presigned URL
    const formData = new FormData();
    formData.append('file', file, options.name || file.name);

    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse
        .text()
        .catch(() => 'Unknown error');
      throw new Error(
        `File upload failed: ${uploadResponse.status} ${uploadResponse.statusText} - ${errorText}`
      );
    }

    const uploadResult = await uploadResponse.json();

    // Extract the IPFS hash from the response
    let ipfsHash;
    if (uploadResult.data && uploadResult.data.cid) {
      ipfsHash = uploadResult.data.cid;
    } else if (uploadResult.cid) {
      ipfsHash = uploadResult.cid;
    } else if (uploadResult.IpfsHash) {
      ipfsHash = uploadResult.IpfsHash;
    } else {
      throw new Error('No IPFS hash found in upload response');
    }

    return {
      success: true,
      ipfsHash,
      ipfsUrl: `ipfs://${ipfsHash}`,
      gatewayUrl: convertIpfsToHttp(`ipfs://${ipfsHash}`),
      size: file.size,
      type: file.type,
      name: options.name || file.name,
      uploadResult: uploadResult,
    };
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
}

/**
 * Upload JSON metadata to IPFS
 * @param {Object} metadata - JSON metadata object
 * @param {Object} options - Upload options
 * @param {string} options.name - Optional name for the metadata file
 * @param {Object} options.keyvalues - Optional metadata key-value pairs
 * @returns {Promise<Object>} Upload response with IPFS hash
 */
export async function uploadJSONToIPFS(metadata, options = {}) {
  if (!metadata || typeof metadata !== 'object') {
    throw new Error('Valid metadata object is required');
  }

  try {
    // Convert JSON to a File object
    const jsonString = JSON.stringify(metadata, null, 2);
    const jsonBlob = new Blob([jsonString], { type: 'application/json' });
    const jsonFile = new File([jsonBlob], options.name || 'metadata.json', {
      type: 'application/json',
    });

    // Use the file upload function
    const result = await uploadFileToIPFS(jsonFile, {
      ...options,
      name: options.name || 'metadata.json',
    });

    return {
      ...result,
      metadata: metadata,
    };
  } catch (error) {
    console.error('Error uploading JSON to IPFS:', error);
    throw new Error(`Failed to upload JSON metadata: ${error.message}`);
  }
}
