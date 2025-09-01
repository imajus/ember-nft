import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppKit, useAppKitAccount } from '@reown/appkit/react';
import { getNFTCollection, getNFTCollectionFactory } from '../lib/contracts';
import { useProvider } from '../hooks/useProvider';
import { useCollectionCover } from '../hooks/useCollectionCover';
import TokensList from '../components/TokensList';

export default function Collection() {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState(null);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const [collectionContract, setCollectionContract] = useState(null);
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const { getProvider, getSigner, isAvailable } = useProvider();
  const { coverImage, isLoading: coverLoading } = useCollectionCover(
    collection?.contractAddress
  );

  useEffect(() => {
    if (collectionId && isAvailable) {
      loadCollectionData();
    }
  }, [collectionId, isAvailable]);

  // Setup contract
  useEffect(() => {
    if (collection && isAvailable) {
      initializeContract();
    }
  }, [collection, isAvailable]);

  // Setup event listeners after collection data is loaded
  useEffect(() => {
    if (collection && isAvailable && collectionContract) {
      setupEventListeners();
      return () => {
        cleanupEventListeners();
      };
    }
  }, [collection, isAvailable, collectionContract]);

  async function loadCollectionData() {
    try {
      const provider = getProvider();
      // Get collection info from factory (much more efficient)
      const factoryContract = await getNFTCollectionFactory(provider);
      const collectionInfo = await factoryContract.collectionInfo(collectionId);
      // Get current supply from the collection contract (only call needed)
      const collectionContract = await getNFTCollection(
        collectionInfo.contractAddress,
        provider
      );
      const currentSupply = await collectionContract.getCurrentSupply();
      const collectionData = {
        id: collectionId,
        contractAddress: collectionInfo.contractAddress,
        name: collectionInfo.name,
        symbol: collectionInfo.symbol,
        maxSupply: collectionInfo.maxSupply.toString(),
        currentSupply: currentSupply.toString(),
        mintPrice: ethers.formatEther(collectionInfo.mintPrice),
        creator: collectionInfo.creator,
        prompt: collectionInfo.prompt,
      };
      setCollection(collectionData);
      setLoadingState('loaded');
    } catch (error) {
      console.error('Error loading collection data:', error);
      setLoadingState('error');
    }
  }

  async function initializeContract() {
    try {
      const provider = getProvider();
      const contract = await getNFTCollection(
        collection.contractAddress,
        provider
      );
      setCollectionContract(contract);
    } catch (error) {
      console.error('Error initializing contract for collection:', error);
    }
  }

  function setupEventListeners() {
    try {
      // Listen for TokenMinted events to update supply count
      collectionContract.on(
        'TokenMinted',
        (tokenId, minter, timestamp, event) => {
          console.log(`TokenMinted event detected for collection:`, {
            tokenId: tokenId.toString(),
            minter,
            timestamp: timestamp.toString(),
            blockNumber: event.blockNumber,
            transactionHash: event.transactionHash,
          });
          // Update collection supply count when token is actually minted
          setCollection((prev) => ({
            ...prev,
            currentSupply: (parseInt(prev.currentSupply) + 1).toString(),
          }));
        }
      );
      console.log(
        `Collection event listeners set up for: ${collection.contractAddress}`
      );
    } catch (error) {
      console.error('Error setting up collection event listeners:', error);
    }
  }

  function cleanupEventListeners() {
    try {
      // Use the same contract instance to remove listeners
      collectionContract.removeAllListeners();
      console.log(
        `Collection event listeners cleaned up for: ${collection?.contractAddress}`
      );
    } catch (error) {
      console.error('Error cleaning up collection event listeners:', error);
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
      // Don't update supply count here - let the TokenMinted event handle it
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
                src={coverImage}
                alt={collection.name}
                className={`w-full h-full object-cover ${
                  coverLoading ? 'animate-pulse bg-gray-200' : ''
                }`}
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

      <TokensList collection={collection} />
    </div>
  );
}
