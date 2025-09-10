import { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

const SOMNIA_TESTNET = {
  chainId: 50312,
  chainName: 'Somnia Testnet',
  nativeCurrency: {
    name: 'STT',
    symbol: 'STT',
    decimals: 18,
  },
  rpcUrls: ['https://dream-rpc.somnia.network'],
  blockExplorerUrls: ['https://somnia-testnet.socialscan.io'],
};

export function Web3Provider({ children }) {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if already connected
    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          'accountsChanged',
          handleAccountsChanged
        );
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (!window.ethereum) return;

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    } catch (err) {
      console.error('Error checking connection:', err);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount(null);
      setIsConnected(false);
    } else {
      setAccount(accounts[0]);
      setIsConnected(true);
    }
    setError(null);
  };

  const handleChainChanged = () => {
    // Reload the page when chain changes
    window.location.reload();
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask or compatible wallet is required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);

        // Switch to Somnia testnet
        await switchToSomniaTestnet();
      }
    } catch (err) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsLoading(false);
    }
  };

  const switchToSomniaTestnet = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SOMNIA_TESTNET.chainId }],
      });
    } catch (switchError) {
      // Chain doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SOMNIA_TESTNET],
          });
        } catch (addError) {
          setError('Failed to add Somnia testnet to wallet');
        }
      } else {
        setError('Failed to switch to Somnia testnet');
      }
    }
  };

  const disconnect = () => {
    setAccount(null);
    setIsConnected(false);
    setError(null);
  };

  const getProvider = () => {
    return new ethers.WebSocketProvider('wss://dream-rpc.somnia.network/ws');
  };

  const getSigner = async () => {
    if (!window.ethereum || !account) {
      throw new Error('Wallet not connected');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    return provider.getSigner();
  };

  const value = {
    account,
    address: account, // alias for compatibility
    isConnected,
    isLoading,
    error,
    connect: connectWallet,
    disconnect,
    getProvider,
    getSigner,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}
