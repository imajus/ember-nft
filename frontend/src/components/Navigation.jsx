import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isConnected, address, isLoading, connect, disconnect, error } =
    useWeb3();
  const location = useLocation();

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Create', path: '/create' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-600 border-b border-gray-300 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center hover:opacity-80 transition-opacity space-x-2"
            >
              <img
                src="/logo.png"
                alt="EmberNFT Logo"
                className="h-8 w-8 object-contain bg-white rounded-full p-1"
                onError={(e) => {
                  // Fallback to emoji if logo doesn't load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline-block';
                }}
              />
              <span
                className="text-2xl font-bold text-gray-900 hidden"
                style={{ display: 'none' }}
              >
                🔥
              </span>
              <span className="text-xl font-bold text-white">EmberNFT</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActiveRoute(item.path)
                      ? 'text-white border-b-2 border-white pb-1'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Wallet Connection */}
            <div className="flex items-center">
              {isLoading ? (
                <div className="flex items-center space-x-2 text-white/80">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span className="text-sm">Connecting...</span>
                </div>
              ) : isConnected ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-white/20 px-3 py-1 rounded-lg">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium text-white">
                      {formatAddress(address)}
                    </span>
                  </div>
                  <button
                    onClick={disconnect}
                    className="text-sm text-white/80 hover:text-red-300 transition-colors duration-200"
                    title="Disconnect Wallet"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-end">
                  <button
                    onClick={connect}
                    disabled={isLoading}
                    className="bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Connect Wallet
                  </button>
                  {error && (
                    <p className="text-red-200 text-xs mt-1 max-w-32 text-right">
                      {error}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white/80 hover:text-white transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-base font-medium transition-colors duration-200 ${
                    isActiveRoute(item.path)
                      ? 'text-white'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Wallet Connection */}
              <div className="pt-4 border-t border-white/20">
                {isLoading ? (
                  <div className="flex items-center space-x-2 text-white/80">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="text-sm">Connecting...</span>
                  </div>
                ) : isConnected ? (
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-lg">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm font-medium text-white">
                        {formatAddress(address)}
                      </span>
                    </div>
                    <button
                      onClick={disconnect}
                      className="text-left text-sm text-red-200 hover:text-red-100 transition-colors duration-200"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      onClick={connect}
                      disabled={isLoading}
                      className="w-full bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Connect Wallet
                    </button>
                    {error && (
                      <p className="text-red-200 text-xs mt-2">{error}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
