import { useConnectWallet, usePrivy, useWallets } from '@privy-io/react-auth';
import { ethers } from 'ethers';

function getProvider() {
  return new ethers.WebSocketProvider('wss://dream-rpc.somnia.network/ws');
  // return new ethers.JsonRpcProvider('https://dream-rpc.somnia.network');
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
    const provider = await connectedWallet.getEthereumProvider();
    const ethersProvider = new ethers.BrowserProvider(provider);
    return ethersProvider.getSigner();
  };

  return {
    address,
    isConnected: !!connectedWallet,
    connect: connectWallet,
    getProvider,
    getSigner,
  };
}
