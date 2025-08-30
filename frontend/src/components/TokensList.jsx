import { useEffect, useState } from 'react';
import { getNFTCollection } from '../lib/contracts';
import { useProvider } from '../hooks/useProvider';
import TokenCard from './TokenCard';

export default function TokensList({ collection }) {
  const [tokenIds, setTokenIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [collectionContract, setCollectionContract] = useState(null);
  const { getProvider, isAvailable } = useProvider();

  useEffect(() => {
    if (collection && isAvailable) {
      initializeContract();
    }
    return () => {
      // cleanupEventListeners();
    };
  }, [collection, isAvailable]);

  async function initializeContract() {
    try {
      const provider = getProvider();
      const contract = await getNFTCollection(
        collection.contractAddress,
        provider
      );
      setCollectionContract(contract);
      // Load token IDs and setup listeners with the same contract instance
      loadTokenIds();
      // setupEventListeners(contract);
    } catch (error) {
      console.error('Error initializing contract for token list:', error);
    }
  }

  async function loadTokenIds() {
    if (!collection) return;
    setIsLoading(true);
    try {
      const currentSupply = parseInt(collection.currentSupply);
      const tokenIdList = [];
      for (let i = 1; i <= currentSupply; i++) {
        tokenIdList.push(i);
      }
      setTokenIds(tokenIdList);
    } catch (error) {
      console.error('Error loading token IDs:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function addNewTokenId(tokenId) {
    setTokenIds((prevTokenIds) => [
      ...prevTokenIds,
      parseInt(tokenId.toString()),
    ]);
    console.log(`Added new token ID ${tokenId} to list`);
  }

  // function setupEventListeners(contract) {
  //   if (!collection || !isAvailable || !contract) return;

  //   try {
  //     // Listen for TokenMinted events to add new token IDs
  //     contract.on('TokenMinted', (tokenId, minter, timestamp, event) => {
  //       console.log(`New token minted in TokensList: ${tokenId}`);
  //       addNewTokenId(parseInt(tokenId.toString()));
  //     });

  //     console.log(`Token event listeners set up for collection: ${collection.contractAddress}`);
  //   } catch (error) {
  //     console.error('Error setting up token event listeners:', error);
  //   }
  // }

  // function cleanupEventListeners() {
  //   if (!collectionContract) return;

  //   try {
  //     // Use the same contract instance to remove listeners
  //     collectionContract.removeAllListeners('TokenMinted');
  //     console.log(`Token event listeners cleaned up for collection: ${collection?.contractAddress}`);
  //   } catch (error) {
  //     console.error('Error cleaning up token event listeners:', error);
  //   }
  // }

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Minted Tokens ({tokenIds.length})
      </h2>

      {isLoading ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading tokens...</p>
          <p className="text-gray-500 mt-2">Preparing token list</p>
        </div>
      ) : tokenIds.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-lg">
          <p className="text-gray-600 text-lg">
            No tokens have been minted yet.
          </p>
          <p className="text-gray-500 mt-2">
            Be the first to mint from this collection!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {tokenIds.map((tokenId) => (
            <TokenCard
              key={tokenId}
              tokenId={tokenId}
              collection={collection}
            />
          ))}
        </div>
      )}
    </div>
  );
}
