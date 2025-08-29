import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppKit, useAppKitProvider, useAppKitAccount } from '@reown/appkit/react';
import { getNFTMarketplace } from '../lib/contracts';

export default function Explore() {
  const [collections, setCollections] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const { open } = useAppKit();
  const { walletProvider } = useAppKitProvider('eip155');
  const { isConnected } = useAppKitAccount();

  useEffect(() => {
    loadCollections();
  }, []);

  async function loadCollections() {
    try {
      const provider = new ethers.JsonRpcProvider();
      const contract = await getNFTMarketplace(provider);
      const data = await contract.fetchMarketItems();

      const items = await Promise.all(
        data.map(async (i) => {
          try {
            const tokenUri = await contract.tokenURI(i.tokenId);
            const meta = await axios.get(tokenUri);
            let price = ethers.formatUnits(i.price.toString(), 'ether');
            let item = {
              price,
              tokenId: i.tokenId.toString(),
              seller: i.seller,
              owner: i.owner,
              image: meta.data.image,
              name: meta.data.name,
              description: meta.data.description,
            };
            return item;
          } catch (error) {
            console.error('Error loading NFT:', error);
            return null;
          }
        })
      );
      setCollections(items.filter(item => item !== null));
      setLoadingState('loaded');
    } catch (error) {
      console.error('Error loading collections:', error);
      setLoadingState('error');
    }
  }

  async function mintNft(nft) {
    if (!isConnected || !walletProvider) {
      open();
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const contract = await getNFTMarketplace(signer);

      const price = ethers.parseUnits(nft.price.toString(), 'ether');
      const transaction = await contract.createMarketSale(nft.tokenId, {
        value: price,
      });
      await transaction.wait();
      loadCollections();
    } catch (error) {
      console.error('Error minting NFT:', error);
    }
  }

  if (loadingState === 'error') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Error Loading Collections</h1>
        <p className="text-gray-600">Please try again later.</p>
      </div>
    );
  }

  if (loadingState === 'loaded' && !collections.length) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">No Collections Available</h1>
        <p className="text-gray-600 mb-8">Be the first to create an AI-generated NFT collection!</p>
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
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Explore AI Collections</h1>
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
          {collections.map((nft, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={nft.image} 
                  alt={nft.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">
                  {nft.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {nft.description}
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-2xl font-bold text-purple-600">{nft.price} ETH</p>
                  </div>
                  <button
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    onClick={() => mintNft(nft)}
                  >
                    Mint
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