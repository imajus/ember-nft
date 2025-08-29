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

  // // For read-only operations, we still need a connected wallet to get the network info
  // const getReadOnlyProvider = () => {
  //   if (!walletProvider) {
  //     // Fallback to default RPC for read operations when wallet isn't connected
  //     return new ethers.JsonRpcProvider('https://dream-rpc.somnia.network/');
  //   }
  //   return new ethers.BrowserProvider(walletProvider);
  // };

  return {
    walletProvider,
    getProvider,
    getSigner,
    // getReadOnlyProvider,
    isAvailable: !!walletProvider,
  };
}
