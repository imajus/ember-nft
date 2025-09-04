import { Link } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';

export default function Navigation() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getUserDisplayName = () => {
    if (user?.email?.address) {
      return user.email.address;
    }
    if (user?.phone?.number) {
      return user.phone.number;
    }
    if (user?.wallet?.address) {
      return formatAddress(user.wallet.address);
    }
    return 'User';
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
          {!ready ? (
            <div className="text-white">Loading...</div>
          ) : authenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">
                Welcome, {getUserDisplayName()}
              </span>
              <button
                onClick={logout}
                className="bg-white text-purple-600 px-4 py-2 rounded-md font-medium hover:bg-purple-50 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="bg-white text-purple-600 px-4 py-2 rounded-md font-medium hover:bg-purple-50 transition-colors"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
