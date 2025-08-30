import { useEffect, useState } from 'react';
import TokenCard from './TokenCard';

export default function TokensList({ collection }) {
  const [tokenIds, setTokenIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (collection) {
      initializeContract();
    }
  }, [collection]);

  async function initializeContract() {
    try {
      // Load token IDs and setup listeners with the same contract instance
      loadTokenIds();
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
