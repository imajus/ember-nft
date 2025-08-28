## Overview

This is an Ethereum scaffold built with Solidity, IPFS, & Next.js with modern tooling including Hardhat v2 & Rocketh deployment system.

## Running this project

### Gitpod

To deploy this project to Gitpod, follow these steps:

1. Click this link to deploy

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#github.com/dabit3/polygon-ethereum-nextjs-marketplace)

2. Import the RPC address given to you by GitPod into your MetaMask wallet

This endpoint will look something like this:

```
https://8545-copper-swordtail-j1mvhxv3.ws-eu18.gitpod.io/
```

The chain ID should be 1337. If you have a localhost rpc set up, you may need to overwrite it.

![MetaMask RPC Import](wallet.png)

#### Local setup

To run this project locally, follow these steps:

1. Clone the project locally, change into the directory, and install the dependencies:

```sh
git clone <repository-url>
cd ethereum-scaffold
npm install
```

2. Start the local Hardhat node:

```sh
npm run chain
```

3. Deploy contracts and export artifacts (in a separate terminal):

```sh
npm run deploy
npm run export
```

4. Start the Next.js development server:

```sh
npm run dev
```

## Development Workflow

When working with smart contracts, follow this development flow:

1. **Create/update smart contract** in the `/contracts` folder
2. **(Optional) Create deployment script** in the `/deploy` folder using the Rocketh deployment system
3. **Deploy contracts**: `npm run deploy`
4. **Export artifacts**: `npm run export`

After running these commands, the contract artifacts will be updated in `/contracts/artifacts.json` and available for use in the frontend.

### Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run chain` - Start local Hardhat node
- `npm run compile` - Compile smart contracts
- `npm run deploy` - Deploy contracts using Rocketh to localhost
- `npm run export` - Export contract artifacts to `/contracts/artifacts.json`
- `npm run build` - Build Next.js application for production
- `npm run start` - Start Next.js production server
- `npm run lint` - Run ESLint

### Project Structure

```
contracts/          # Smart contracts and artifacts
├── NFTMarketplace.sol
└── artifacts.json   # Exported contract artifacts

deploy/              # Rocketh deployment scripts
└── 01_deploy_nft_marketplace.js

pages/               # Next.js pages
├── index.js         # Home page
├── create-nft.js    # NFT creation
├── dashboard.js     # Creator dashboard
├── my-nfts.js       # User's NFTs
└── resell-nft.js    # Resell NFTs

rocketh.js           # Rocketh configuration
hardhat.config.js    # Hardhat configuration
```

### Configuration

To deploy to other networks, update the network configurations in `hardhat.config.js` and `rocketh.js`. For testnets or mainnet, you'll need to:

1. Add network configuration to both config files
2. Set up private keys securely
3. Configure RPC endpoints (e.g., Infura, Alchemy)
4. Update the deploy script target network
