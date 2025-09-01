import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { getNFTCollectionFactory, getNFTCollection } from '../lib/contracts';
import { useProvider } from '../hooks/useProvider';
import CollectionCard from '../components/CollectionCard';

export default function Explore() {
  const [collections, setCollections] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const { getProvider, isAvailable } = useProvider();

  useEffect(() => {
    if (isAvailable) {
      loadCollections();
    }
  }, [isAvailable]);

  async function loadCollections() {
    try {
      const provider = getProvider();
      const factory = await getNFTCollectionFactory(provider);
      const collectionsData = await factory.getAllCollections();
      const formattedCollections = await Promise.all(
        collectionsData
          .filter(
            (collection) => collection.contractAddress !== ethers.ZeroAddress
          )
          .map(async (collection) => {
            try {
              const collectionContract = await getNFTCollection(
                collection.contractAddress,
                provider
              );
              const currentSupply = await collectionContract.getCurrentSupply();
              return {
                id: collection.id.toString(),
                contractAddress: collection.contractAddress,
                name: collection.name,
                symbol: collection.symbol,
                maxSupply: collection.maxSupply.toString(),
                currentSupply: currentSupply.toString(),
                mintPrice: ethers.formatEther(collection.mintPrice),
                creator: collection.creator,
                prompt: collection.prompt,
                createdAt: collection.createdAt.toString(),
              };
            } catch (error) {
              console.error(
                `Error loading supply for collection ${collection.contractAddress}:`,
                error
              );
              return {
                id: collection.id.toString(),
                contractAddress: collection.contractAddress,
                name: collection.name,
                symbol: collection.symbol,
                maxSupply: collection.maxSupply.toString(),
                currentSupply: '0',
                mintPrice: ethers.formatEther(collection.mintPrice),
                creator: collection.creator,
                prompt: collection.prompt,
                createdAt: collection.createdAt.toString(),
              };
            }
          })
      );
      setCollections(formattedCollections);
      setLoadingState('loaded');
    } catch (error) {
      console.error('Error loading collections:', error);
      setLoadingState('error');
    }
  }

  if (loadingState === 'error') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Error Loading Collections
        </h1>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    );
  }

  if (loadingState === 'loaded' && !collections.length) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          No Collections Available
        </h1>
        <p className="text-gray-600 mb-8">
          Be the first to create an AI-generated NFT collection!
        </p>
        <a
          href="/create"
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-200"
        >
          Create First Collection
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Explore AI Collections
        </h1>
        <p className="text-gray-600">
          Discover unique AI-generated NFT collections from talented creators
        </p>
      </div>

      {loadingState === 'not-loaded' ? (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading collections...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {collections.map((collection, i) => (
            <CollectionCard key={collection.id || i} collection={collection} />
          ))}
        </div>
      )}
    </div>
  );
}
