import { Link } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';

export default function Navigation() {
  const { isConnected, address, isLoading, connect, disconnect, error } = useWeb3();

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <nav className="border-b p-6 bg-gradient-to-r from-purple-600 to-blue-600">
      <p className="text-4xl font-bold text-white">Ember NFT Launchpad</p>
      <div className="flex mt-4 justify-between items-center">
        <div className="flex">
          <Link
            to="/"
            className="mr-6 text-white hover:text-purple-200 font-medium"
          >
            Home
          </Link>
          <Link
            to="/explore"
            className="mr-6 text-white hover:text-purple-200 font-medium"
          >
            Explore
          </Link>
          <Link
            to="/create"
            className="mr-6 text-white hover:text-purple-200 font-medium"
          >
            Create Collection
          </Link>
          <Link
            to="/dashboard"
            className="mr-6 text-white hover:text-purple-200 font-medium"
          >
            Dashboard
          </Link>
        </div>
        <div className="flex items-center">
          {isLoading ? (
            <div className="text-white">Connecting...</div>
          ) : isConnected ? (
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">
                {formatAddress(address)}
              </span>
              <button
                onClick={disconnect}
                className="bg-white text-purple-600 px-4 py-2 rounded-md font-medium hover:bg-purple-50 transition-colors"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-end">
              <button
                onClick={connect}
                disabled={isLoading}
                className="bg-white text-purple-600 px-4 py-2 rounded-md font-medium hover:bg-purple-50 transition-colors disabled:opacity-50"
              >
                Connect Wallet
              </button>
              {error && (
                <p className="text-red-200 text-xs mt-1">{error}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
