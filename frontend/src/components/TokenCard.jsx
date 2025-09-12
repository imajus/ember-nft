import { useEffect, useState } from 'react';
import { getNFTCollection } from '../lib/contracts';
import { useProvider } from '../hooks/useProvider';
import { fetchTokenMetadata, getImageFromMetadata } from '../lib/ipfs';
import AddressDisplay from './AddressDisplay';

export default function TokenCard({ tokenId, collection }) {
  const [token, setToken] = useState({
    tokenId,
    owner: null,
    tokenURI: null,
    isGenerated: false,
    image: '/loading.gif',
    name: `Token #${tokenId}`,
    isLoading: true,
  });
  const [collectionContract, setCollectionContract] = useState(null);
  const { getProvider } = useProvider();

  useEffect(() => {
    if (collection) {
      initializeContract();
    }
  }, [collection]);

  useEffect(() => {
    if (collectionContract) {
      fetchTokenData();
      setupEventListeners();
      return () => {
        cleanupEventListeners();
      };
    }
  }, [collectionContract]);

  async function initializeContract() {
    try {
      const provider = getProvider();
      const contract = await getNFTCollection(
        collection.contractAddress,
        provider
      );
      setCollectionContract(contract);
    } catch (error) {
      console.error(`Error initializing contract for token ${tokenId}:`, error);
    }
  }

  async function fetchTokenData() {
    try {
      const owner = await collectionContract.ownerOf(tokenId);
      const tokenURI = await collectionContract.tokenURI(tokenId);
      const isGenerated = await collectionContract.isTokenGenerated(tokenId);
      let imageUrl;
      let tokenName = `Token #${tokenId}`;
      if (isGenerated && tokenURI) {
        try {
          const metadata = await fetchTokenMetadata(tokenURI);
          if (metadata) {
            imageUrl = getImageFromMetadata(metadata);
            tokenName = metadata.name || `Token #${tokenId}`;
          }
        } catch (metadataError) {
          console.error(
            `Error fetching metadata for token ${tokenId}:`,
            metadataError
          );
          imageUrl = '/error.gif';
        }
      }
      setToken((prev) => ({
        ...prev,
        tokenId,
        owner,
        tokenURI,
        isGenerated,
        image: imageUrl ?? prev.image,
        name: tokenName,
        isLoading: false,
      }));
    } catch (error) {
      console.error(`Error loading token ${tokenId}:`, error);
      setToken((prev) => ({
        ...prev,
        isLoading: false,
        image: '/error.gif',
      }));
    }
  }

  function updateTokenImage(newTokenURI) {
    if (!newTokenURI) return;
    const updateToken = async () => {
      try {
        let imageUrl;
        let tokenName = null;
        try {
          const metadata = await fetchTokenMetadata(newTokenURI);
          if (metadata) {
            imageUrl = getImageFromMetadata(metadata);
            tokenName = metadata.name;
          }
        } catch (metadataError) {
          console.error(
            `Error fetching metadata for token ${tokenId}:`,
            metadataError
          );
          imageUrl = '/error.gif';
        }
        setToken((prev) => ({
          ...prev,
          tokenURI: newTokenURI,
          isGenerated: true,
          image: imageUrl ?? prev.image,
          ...(tokenName && { name: tokenName }),
        }));
        console.log(`Updated token ${tokenId} image: ${imageUrl}`);
      } catch (error) {
        console.error(`Error updating token ${tokenId} image:`, error);
        setToken((prev) => ({
          ...prev,
          image: '/error.gif',
        }));
      }
    };
    updateToken();
  }

  function setupEventListeners() {
    try {
      // Listen for TokenURIUpdated events for this specific token
      collectionContract.on(
        'TokenURIUpdated',
        (tokenIdFromEvent, newTokenURI) => {
          if (parseInt(tokenIdFromEvent.toString()) === tokenId) {
            console.log(
              `TokenURIUpdated event detected for token ${tokenId}:`,
              {
                tokenId: tokenIdFromEvent.toString(),
                newTokenURI,
              }
            );
            updateTokenImage(`ipfs://${newTokenURI}`);
          }
        }
      );
      console.log(`Event listeners set up for token ${tokenId}`);
    } catch (error) {
      console.error(
        `Error setting up event listeners for token ${tokenId}:`,
        error
      );
    }
  }

  function cleanupEventListeners() {
    try {
      // Remove listeners for this specific token using the same contract instance
      collectionContract.removeAllListeners();
      console.log(`Event listeners cleaned up for token ${tokenId}`);
    } catch (error) {
      console.error(
        `Error cleaning up event listeners for token ${tokenId}:`,
        error
      );
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors duration-200">
      <div className="aspect-square overflow-hidden relative">
        <img
          src={token.image}
          alt={`Token ${token.tokenId}`}
          className="w-full h-full object-cover transition-all duration-200 hover:scale-105"
        />
        {!token.isLoading && !token.isGenerated && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800 border border-yellow-200">
              Pending
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3
          className={`text-lg font-bold text-gray-800 mb-2 ${
            token.isLoading ? 'animate-pulse bg-gray-200 rounded h-6' : ''
          }`}
        >
          {!token.isLoading && token.name}
        </h3>
        <div className="text-sm text-gray-500 space-y-1">
          <p
            className={
              token.isLoading ? 'animate-pulse bg-gray-200 rounded h-4' : ''
            }
          >
            {!token.isLoading && token.owner && (
              <>
                Owner: <AddressDisplay address={token.owner} />
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
