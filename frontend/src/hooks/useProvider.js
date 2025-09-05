import { useConnectWallet, usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';

function getProvider() {
  return new ethers.WebSocketProvider('wss://dream-rpc.somnia.network/ws');
}

/**
 * Lightweight wrapper around Privy's wallet hooks
 * Returns ethers provider and signer for Web3 interactions
 */
export function useProvider() {
  // const { ready, user } = usePrivy();
  const { wallets } = useWallets();
  const { connectWallet } = useConnectWallet();

  // Get the first connected wallet (embedded or external)
  const connectedWallet = wallets.find(
    (wallet) => wallet.walletClientType === 'privy' || wallet.connectorType
  );
  const address = connectedWallet?.address;

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
    isConnected: !!connectedWallet,
    connect: connectWallet,
    getProvider,
    getSigner,
  };
}
