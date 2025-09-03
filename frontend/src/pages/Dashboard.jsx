import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppKit } from '@reown/appkit/react';
import { ethers } from 'ethers';
import { getNFTCollectionFactory, getNFTCollection } from '../lib/contracts';
import { useProvider } from '../hooks/useProvider';
import CollectionCover from '../components/CollectionCover';

export default function Dashboard() {
  const [collections, setCollections] = useState([]);
  const [loadingState, setLoadingState] = useState('not-loaded');
  const [stats, setStats] = useState({
    totalCollections: 0,
    totalRevenue: 0,
    totalMinted: 0,
    totalSupply: 0,
  });

  const { open } = useAppKit();
  const { isConnected, address, getProvider } = useProvider();

  useEffect(() => {
    if (isConnected && address) {
      loadDashboardData();
    }
  }, [isConnected, address]);

  async function loadDashboardData() {
    try {
      setLoadingState('loading');
      const provider = getProvider();
      const factory = await getNFTCollectionFactory(provider);
      // Get collections created by this user
      const userCollections = await factory.getCollectionsByCreator(address);
      const collectionPromises = userCollections.map(async (collectionId) => {
        try {
          const result = await factory.collectionInfo(collectionId);
          const [
            ,
            contractAddress,
            ,
            name,
            symbol,
            prompt,
            maxSupply,
            mintPrice,
          ] = result;
          const collection = await getNFTCollection(contractAddress, provider);
          const minted = await collection.getCurrentSupply();
          const revenue = minted * mintPrice;
          return {
            id: collectionId.toString(),
            name,
            symbol,
            description: prompt,
            contractAddress,
            maxSupply,
            minted,
            price: mintPrice,
            revenue,
            status: minted === maxSupply ? 'sold-out' : 'active',
            image:
              'https://placehold.co/400x400?text=' + encodeURIComponent(name),
          };
        } catch (error) {
          console.error('Error loading collection:', error);
          return null;
        }
      });
      const userCollectionData = (await Promise.all(collectionPromises)).filter(
        (c) => c !== null
      );
      setCollections(userCollectionData);
      setStats({
        totalCollections: userCollectionData.length,
        totalRevenue: userCollectionData.reduce(
          (sum, col) => sum + col.revenue,
          0n
        ),
        totalMinted: userCollectionData.reduce(
          (sum, col) => sum + col.minted,
          0n
        ),
        totalSupply: userCollectionData.reduce(
          (sum, col) => sum + col.maxSupply,
          0n
        ),
      });
      setLoadingState('loaded');
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoadingState('error');
    }
  }

  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Creator Dashboard
        </h1>
        <p className="text-gray-600 mb-8">
          Connect your wallet to view your collections
        </p>
        <button
          onClick={() => open()}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-200"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  if (loadingState === 'loading') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Creator Dashboard</h1>
        <Link
          to="/create"
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:shadow-lg transition-all duration-200"
        >
          + New Collection
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Total Collections
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {stats.totalCollections}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Total Revenue
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {ethers.formatEther(stats.totalRevenue)} ETH
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Total Minted
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats.totalMinted.toString()}/{stats.totalSupply.toString()}
          </p>
        </div>
      </div>

      {/* Collections List */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          My Collections
        </h2>

        {collections.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Collections Yet
            </h3>
            <p className="text-gray-500 mb-6">
              Create your first AI-generated NFT collection
            </p>
            <Link
              to="/create"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transition-all duration-200"
            >
              Create First Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {collections.map((collection) => (
              <div
                key={collection.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <CollectionCover
                      contractAddress={collection.contractAddress}
                      alt={collection.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {collection.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {collection.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>
                          {collection.minted.toString()}/
                          {collection.maxSupply.toString()} minted
                        </span>
                        <span>•</span>
                        <span>{collection.price} ETH each</span>
                        <span>•</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            collection.status === 'active'
                              ? 'bg-green-100 text-green-600'
                              : collection.status === 'generating'
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {collection.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={`/collection/${collection.id}`}
                      className="px-4 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors"
                    >
                      View
                    </a>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Minting Progress</span>
                    <span>
                      {Math.round(
                        Number(collection.minted / collection.maxSupply) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-200"
                      style={{
                        width: `${
                          Number(collection.minted / collection.maxSupply) * 100
                        }%`,
                      }}
                    ></div>
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
