import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';

/**
 * Lightweight wrapper around Privy's authentication and wallet hooks
 * Returns ethers provider and signer for Web3 interactions
 */
export function useProvider() {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();
  
  const embeddedWallet = wallets.find(wallet => wallet.walletClientType === 'privy');
  const address = embeddedWallet?.address;
  const isConnected = authenticated && !!address;

  const getProvider = () => {
    return new ethers.WebSocketProvider('wss://dream-rpc.somnia.network/ws');
  };

  const getSigner = async () => {
    if (!embeddedWallet) {
      throw new Error('Wallet not connected');
    }
    
    const provider = await embeddedWallet.getEthereumProvider();
    const ethersProvider = new ethers.BrowserProvider(provider);
    return await ethersProvider.getSigner();
  };

  return {
    address,
    isConnected,
    wallet: embeddedWallet,
    getProvider,
    getSigner,
  };
}
