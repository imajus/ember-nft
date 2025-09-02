import { useAppKitAccount, useAppKitProvider } from '@reown/appkit/react';
import { ethers } from 'ethers';

/**
 * Lightweight wrapper around Reown's useAppKitProvider
 * Returns ethers provider and signer for Web3 interactions
 */
export function useProvider() {
  const { address, isConnected } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider('eip155');

  const getProvider = () => {
    return new ethers.WebSocketProvider('wss://dream-rpc.somnia.network/ws');
  };

  const getSigner = async () => {
    if (!walletProvider) {
      throw new Error('Wallet not connected');
    }
    const provider = new ethers.BrowserProvider(walletProvider);
    return await provider.getSigner();
  };

  return {
    address,
    isConnected,
    // walletProvider,
    getProvider,
    getSigner,
  };
}
