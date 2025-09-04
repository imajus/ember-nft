import { defineChain } from 'viem';

// Define Somnia Testnet chain for Privy
export const somniaTestnet = defineChain({
  id: 50311,
  name: 'Somnia Testnet',
  network: 'somnia-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'STT',
    symbol: 'STT',
  },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network'],
      webSocket: ['wss://dream-rpc.somnia.network/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Somnia Explorer',
      url: 'https://somnia-testnet.socialscan.io',
    },
  },
});

/** @type {import('@privy-io/react-auth').PrivyClientConfig} */
export const privyConfig = {
  appearance: {
    theme: 'light',
    accentColor: '#8B5CF6',
  },
  embeddedWallets: {
    createOnLogin: 'users-without-wallets',
  },
  loginMethods: ['email', 'wallet', 'sms'],
  defaultChain: somniaTestnet,
  supportedChains: [somniaTestnet],
};
