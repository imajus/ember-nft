/**
 * IPFS utilities for converting IPFS URLs to HTTP gateway URLs
 */

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
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
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
    return 'https://placehold.co/300x300?text=No+Image';
  }

  return convertIpfsToHttp(metadata.image);
}