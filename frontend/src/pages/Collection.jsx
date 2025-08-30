import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { getNFTCollection } from '../lib/contracts';
import { useProvider } from '../hooks/useProvider';
import {
  fetchTokenMetadata,
  getImageFromMetadata,
  convertIpfsToHttp,
} from '../lib/ipfs';

export default function Collection() {
  const { contractAddress } = useParams();
  const [collection, setCollection] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const { getProvider, getSigner, isAvailable } = useProvider();

  useEffect(() => {
    if (contractAddress && isAvailable) {
      loadCollectionData();
    }
  }, [contractAddress, isAvailable]);

  async function loadCollectionData() {
    try {
      const provider = getProvider();
      const collectionContract = await getNFTCollection(
        contractAddress,
        provider
      );

      const [
        name,
        symbol,
        maxSupply,
        currentSupply,
        mintPrice,
        creator,
        prompt,
      ] = await Promise.all([
        collectionContract.name(),
        collectionContract.symbol(),
        collectionContract.maxSupply(),
        collectionContract.getCurrentSupply(),
        collectionContract.mintPrice(),
        collectionContract.creator(),
        collectionContract.getPrompt(),
      ]);

      const collectionData = {
        contractAddress,
        name,
        symbol,
        maxSupply: maxSupply.toString(),
        currentSupply: currentSupply.toString(),
        mintPrice: ethers.formatEther(mintPrice),
        creator,
        prompt,
        image: 'https://placehold.co/400x400?text=' + encodeURIComponent(name),
      };

      const tokenList = [];
      for (let i = 1; i <= parseInt(currentSupply.toString()); i++) {
        try {
          const owner = await collectionContract.ownerOf(i);
          const tokenURI = await collectionContract.tokenURI(i);
          const isGenerated = await collectionContract.isTokenGenerated(i);

          let imageUrl = 'https://placehold.co/300x300?text=Crafting';
          let tokenName = `Token #${i}`;

          if (isGenerated && tokenURI) {
            try {
              const metadata = await fetchTokenMetadata(tokenURI);
              if (metadata) {
                imageUrl = getImageFromMetadata(metadata);
                tokenName = metadata.name;
              }
            } catch (metadataError) {
              console.error(
                `Error fetching metadata for token ${i}:`,
                metadataError
              );
              imageUrl = convertIpfsToHttp(tokenURI);
            }
          }

          tokenList.push({
            tokenId: i,
            owner,
            tokenURI,
            isGenerated,
            image: imageUrl,
            name: tokenName,
          });
        } catch (error) {
          console.error(`Error loading token ${i}:`, error);
        }
      }

      setCollection(collectionData);
      setTokens(tokenList);
      setLoadingState('loaded');
    } catch (error) {
      console.error('Error loading collection data:', error);
      setLoadingState('error');
    }
  }

  async function mintNft() {
    if (!isConnected) {
      open();
      return;
    }
    if (!collection) return;

    try {
      const signer = await getSigner();
      const collectionContract = await getNFTCollection(
        collection.contractAddress,
        signer
      );
      const mintPrice = ethers.parseEther(collection.mintPrice);
      const transaction = await collectionContract.mint({
        value: mintPrice,
      });
      await transaction.wait();
      // Reload collection data to update supply and show new token
      loadCollectionData();
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Error minting NFT: ' + (error.reason || error.message));
    }
  }

  if (loadingState === 'error') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Error Loading Collection
        </h1>
        <p className="text-gray-600 mb-8">
          Collection not found or failed to load.
        </p>
        <Link
          to="/explore"
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-200"
        >
          Back to Explore
        </Link>
      </div>
    );
  }

  if (loadingState === 'not-loaded' || !isAvailable) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">
          {!isAvailable
            ? 'Initializing Web3 provider...'
            : 'Loading collection...'}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="mb-4">
          <Link
            to="/explore"
            className="text-purple-600 hover:text-purple-800 inline-flex items-center"
          >
            ← Back to Explore
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 inline-block">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-100 aspect-square overflow-hidden rounded-lg flex-shrink-0">
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-80">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {collection.name}
              </h1>
              <p className="text-gray-600 text-lg mb-6">{collection.prompt}</p>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Symbol:</span>
                  <span className="font-medium">{collection.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Creator:</span>
                  <span className="font-medium">
                    {collection.creator.slice(0, 6)}...
                    {collection.creator.slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Supply:</span>
                  <span className="font-medium">
                    {collection.currentSupply} / {collection.maxSupply}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mint Price:</span>
                  <span className="font-bold text-purple-600">
                    {collection.mintPrice} ETH
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Contract:</span>
                  <span className="font-mono text-sm">
                    {collection.contractAddress.slice(0, 10)}...
                    {collection.contractAddress.slice(-8)}
                  </span>
                </div>
                <div className="mt-6 pt-4">
                  <button
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    onClick={mintNft}
                  >
                    Mint NFT ({collection.mintPrice} ETH)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Minted Tokens ({tokens.length})
        </h2>

        {tokens.length === 0 ? (
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
            {tokens.map((token) => (
              <div
                key={token.tokenId}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={token.image}
                    alt={`Token ${token.tokenId}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {token.name}
                  </h3>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p>
                      Owner: {token.owner.slice(0, 6)}...{token.owner.slice(-4)}
                    </p>
                    <p>
                      Status:
                      <span
                        className={`ml-1 px-2 py-1 rounded text-xs ${
                          token.isGenerated
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {token.isGenerated ? 'Generated' : 'Pending'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
