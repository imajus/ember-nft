import CollectionCover from './CollectionCover';
import AddressDisplay from './AddressDisplay';
import Web3Button from './Web3Button';

export default function CollectionCard({ collection }) {
  const isForked = collection.parentId && parseInt(collection.parentId) > 0;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
      <div className="aspect-square overflow-hidden relative">
        <CollectionCover
          contractAddress={collection.contractAddress}
          alt={collection.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
        />
        {isForked && (
          <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
            Fork
          </div>
        )}
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
            By: <AddressDisplay address={collection.creator} />
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
          <div className="flex gap-2">
            <a
              href={`/create?forkFrom=${collection.id}`}
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105 text-sm cursor-pointer"
            >
              Fork
            </a>
            <a
              href={`/collection/${collection.id}`}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105"
            >
              View
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
