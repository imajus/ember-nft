import { defineChain } from 'viem';

// Define Somnia Testnet chain configuration
export const somniaTestnet = defineChain({
  id: 50312,
  name: 'Somnia Testnet',
  network: 'somnia-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'STT',
    symbol: 'STT'
  },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network'],
      webSocket: ['wss://dream-rpc.somnia.network/ws']
    }
  },
  blockExplorers: {
    default: { 
      name: 'Somnia Explorer', 
      url: 'https://explorer.somnia.network' 
    }
  },
  testnet: true
});