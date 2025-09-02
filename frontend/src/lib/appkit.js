import { createAppKit } from '@reown/appkit/react';
import { EthersAdapter } from '@reown/appkit-adapter-ethers';
import { hardhat, somniaTestnet } from '@reown/appkit/networks';
import { defaultsDeep } from 'lodash-es';

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;

const networks = [
  defaultsDeep(somniaTestnet, {
    rpcUrls: {
      default: {
        http: ['https://dream-rpc.somnia.network'],
        webSocket: ['wss://dream-rpc.somnia.network/ws'],
      },
    },
  }),
  // hardhat,
];

const metadata = {
  name: 'NFT Marketplace',
  description: 'Metaverse NFT Marketplace',
  url:
    typeof window !== 'undefined'
      ? window.location.origin
      : 'http://localhost:3000',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const ethersAdapter = new EthersAdapter();

createAppKit({
  adapters: [ethersAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: false, // Optional - defaults to your Cloud configuration
    swaps: false,
    onramp: false,
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-font-family':
      'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  },
  // chainImages: {
  //   1: "https://my.images.com/eth.png",
  // },
  // debug: true,
});
