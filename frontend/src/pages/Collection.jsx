import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getNFTCollection, getNFTCollectionFactory } from '../lib/contracts';
import { useProvider } from '../hooks/useProvider';
import CollectionCover from '../components/CollectionCover';
import TokensList from '../components/TokensList';
import AddressDisplay from '../components/AddressDisplay';
import Web3Button from '../components/Web3Button';

export default function Collection() {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState(null);
  const [parentCollection, setParentCollection] = useState(null);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const [collectionContract, setCollectionContract] = useState(null);
  const { getProvider, getSigner } = useProvider();

  useEffect(() => {
    if (collectionId) {
      loadCollectionData();
    }
  }, [collectionId]);

  // Setup contract
  useEffect(() => {
    if (collection) {
      initializeContract();
    }
  }, [collection]);

  // Setup event listeners after collection data is loaded
  useEffect(() => {
    if (collectionContract) {
      setupEventListeners();
      return () => {
        cleanupEventListeners();
      };
    }
  }, [collectionContract]);

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
      const dynamicPrice = await collectionContract.getTokenPrice();
      const collectionData = {
        id: collectionId,
        contractAddress: collectionInfo.contractAddress,
        name: collectionInfo.name,
        symbol: collectionInfo.symbol,
        maxSupply: collectionInfo.maxSupply.toString(),
        currentSupply: currentSupply.toString(),
        mintPrice: ethers.formatEther(dynamicPrice),
        creator: collectionInfo.creator,
        prompt: collectionInfo.prompt,
        parentId: collectionInfo.parentId.toString(),
      };
      setCollection(collectionData);
      
      // Load parent collection info if this is a fork
      if (collectionInfo.parentId && parseInt(collectionInfo.parentId.toString()) > 0) {
        loadParentCollection(collectionInfo.parentId.toString(), factoryContract);
      }
      
      setLoadingState('loaded');
    } catch (error) {
      console.error('Error loading collection data:', error);
      setLoadingState('error');
    }
  }

  const loadParentCollection = async (parentId, factoryContract) => {
    try {
      const parentInfo = await factoryContract.collectionInfo(parentId);
      setParentCollection({
        id: parentId,
        name: parentInfo.name,
        contractAddress: parentInfo.contractAddress,
      });
    } catch (error) {
      console.error('Error loading parent collection:', error);
    }
  };

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
    if (!collection) return;
    try {
      const signer = await getSigner();
      const collectionContract = await getNFTCollection(
        collection.contractAddress,
        signer
      );
      const dynamicPrice = await collectionContract.getTokenPrice();
      const transaction = await collectionContract.mint({
        value: dynamicPrice,
      });
      await transaction.wait();
      // Don't update supply count here - let the TokenMinted event handle it
    } catch (error) {
      console.error('Error minting NFT:', error);
      alert('Error minting NFT: ' + (error.reason || error.message));
    }
  }

  const handleForkClick = () => {
    window.location.href = `/create?forkFrom=${collection.id}`;
  };

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

  if (loadingState === 'not-loaded') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading collection..</p>
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

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 overflow-hidden rounded-lg flex-shrink-0">
              <CollectionCover
                contractAddress={collection.contractAddress}
                alt={collection.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-800">
                  {collection.name}
                </h1>
                {collection.parentId && parseInt(collection.parentId) > 0 && (
                  <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full">
                    Fork
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {collection.prompt}
              </p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Symbol:</span>
                  <span className="font-medium">{collection.symbol}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Creator:</span>
                  <AddressDisplay address={collection.creator} copyable />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Supply:</span>
                  <span className="font-medium">
                    {collection.currentSupply} / {collection.maxSupply}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Price:</span>
                  <span className="font-bold text-purple-600">
                    {collection.mintPrice} ETH
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Contract:</span>
                  <AddressDisplay
                    address={collection.contractAddress}
                    copyable
                  />
                </div>
                {collection.parentId && parseInt(collection.parentId) > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Forked from:</span>
                    <a
                      href={`/collection/${collection.parentId}`}
                      className="font-medium text-purple-600 hover:text-purple-800 transition-colors"
                    >
                      {parentCollection ? parentCollection.name : `Collection #${collection.parentId}`}
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 flex gap-3">
              <Web3Button
                onClick={handleForkClick}
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer"
              >
                Fork
              </Web3Button>
              <Web3Button
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer"
                onClick={mintNft}
              >
                Mint ({collection.mintPrice} ETH)
              </Web3Button>
            </div>
          </div>
        </div>
      </div>

      <TokensList collection={collection} />
    </div>
  );
}
