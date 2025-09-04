import { Link } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { useProvider } from '../hooks/useProvider';

export default function Navigation() {
  const { login, logout, ready } = usePrivy();
  const { address, isConnected } = useProvider();

  const handleAuth = () => {
    if (isConnected) {
      logout();
    } else {
      login();
    }
  };

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
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
          {isConnected && (
            <span className="mr-4 text-white text-sm">
              {formatAddress(address)}
            </span>
          )}
          <button
            onClick={handleAuth}
            disabled={!ready}
            className="bg-white text-purple-600 font-medium px-4 py-2 rounded-md hover:bg-purple-100 transition disabled:opacity-50"
          >
            {isConnected ? 'Logout' : 'Login'}
          </button>
        </div>
      </div>
    </nav>
  );
}
