import { usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';

/**
 * Lightweight wrapper around Privy's wallet hooks
 * Returns ethers provider and signer for Web3 interactions
 */
export function useProvider() {
  const { authenticated } = usePrivy();
  const { wallets } = useWallets();

  // Get the first connected wallet (embedded or external)
  const connectedWallet = wallets.find(wallet => wallet.walletClientType === 'privy' || wallet.connectorType);
  const address = connectedWallet?.address;
  const isConnected = authenticated && !!connectedWallet;

  const getProvider = () => {
    return new ethers.WebSocketProvider('wss://dream-rpc.somnia.network/ws');
  };

  const getSigner = async () => {
    if (!connectedWallet) {
      throw new Error('Wallet not connected');
    }

    // For embedded wallets
    if (connectedWallet.walletClientType === 'privy') {
      const provider = await connectedWallet.getEthereumProvider();
      const ethersProvider = new ethers.BrowserProvider(provider);
      return await ethersProvider.getSigner();
    }

    // For external wallets
    if (connectedWallet.connectorType) {
      const provider = await connectedWallet.getEthereumProvider();
      const ethersProvider = new ethers.BrowserProvider(provider);
      return await ethersProvider.getSigner();
    }

    throw new Error('Unable to get signer from wallet');
  };

  return {
    address,
    isConnected,
    getProvider,
    getSigner,
  };
}
