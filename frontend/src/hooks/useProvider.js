import { useAppKitProvider } from '@reown/appkit/react';
import { ethers } from 'ethers';

/**
 * Lightweight wrapper around Reown's useAppKitProvider
 * Returns ethers provider and signer for Web3 interactions
 */
export function useProvider() {
  const { walletProvider } = useAppKitProvider('eip155');

  const getProvider = () => {
    if (!walletProvider) {
      throw new Error('Wallet not connected');
    }
    return new ethers.BrowserProvider(walletProvider);
  };

  const getSigner = async () => {
    const provider = getProvider();
    return await provider.getSigner();
  };

  return {
    walletProvider,
    getProvider,
    getSigner,
    isAvailable: !!walletProvider,
  };
}
