import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { getNFTCollectionFactory, getNFTCollection } from '../lib/contracts';
import { useProvider } from '../hooks/useProvider';

export default function Explore() {
  const [collections, setCollections] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const { getProvider, getSigner } = useProvider();

  useEffect(() => {
    loadCollections();
  }, []);

  async function loadCollections() {
    try {
      const provider = getProvider();
      const factory = await getNFTCollectionFactory(provider);
      const collectionsData = await factory.getAllCollections();
      console.log('Total collections:', collectionsData.length);

      const formattedCollections = collectionsData
        .map((collection) => {
          if (
            collection.contractAddress === ethers.ZeroAddress ||
            !collection.isActive
          ) {
            return null;
          }

          return {
            id: collection.id.toString(),
            contractAddress: collection.contractAddress,
            name: collection.name,
            symbol: collection.symbol,
            maxSupply: collection.maxSupply.toString(),
            mintPrice: ethers.formatEther(collection.mintPrice),
            creator: collection.creator,
            prompt: collection.prompt,
            createdAt: collection.createdAt.toString(),
            isActive: collection.isActive,
            image:
              'https://via.placeholder.com/400x400?text=' +
              encodeURIComponent(collection.name),
          };
        })
        .filter((item) => item !== null);

      setCollections(formattedCollections);
      setLoadingState('loaded');
    } catch (error) {
      console.error('Error loading collections:', error);
      setLoadingState('error');
    }
  }

  async function mintNft(collection) {
    if (!isConnected) {
      open();
      return;
    }

    try {
      const signer = await getSigner();
      const collectionContract = await getNFTCollection(
        collection.contractAddress,
        signer
      );

      const mintPrice = ethers.parseEther(collection.mintPrice);

      // Create a unique prompt variation for this mint
      const promptVariation = `${collection.prompt}, unique artwork`;

      console.log('Minting NFT with prompt:', promptVariation);
      console.log('Mint price:', collection.mintPrice, 'ETH');

      const transaction = await collectionContract.mint(promptVariation, {
        value: mintPrice,
      });

      console.log('Transaction submitted:', transaction.hash);
      await transaction.wait();
      console.log('NFT minted successfully!');

      // Reload collections to update supply
      loadCollections();
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Error minting NFT: ' + (error.reason || error.message));
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
            <div
              key={i}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
                  {collection.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {collection.prompt}
                </p>
                <div className="text-sm text-gray-500 mb-4">
                  <p>
                    By: {collection.creator.slice(0, 6)}...
                    {collection.creator.slice(-4)}
                  </p>
                  <p>Supply: {collection.maxSupply}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Mint Price</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {collection.mintPrice} ETH
                    </p>
                  </div>
                  <button
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => mintNft(collection)}
                    disabled={!collection.isActive}
                  >
                    {!collection.isActive ? 'Inactive' : 'Mint'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
