# Hardhat Smart Contract Project

## Overview

This is the smart contract backend for the AI-powered NFT Launchpad, built with Solidity and Hardhat. It provides the blockchain infrastructure for NFT collection creation, minting, and marketplace functionality.

## Prerequisites

- Node.js v18+ and npm
- Git

## Installation

1. Navigate to the hardhat directory and install dependencies:

```sh
cd hardhat
npm install
```

## Running the Local Blockchain

1. Start the local Hardhat node:

```sh
npm run nodechain
```

This will start a local Ethereum node on `http://localhost:8545` with test accounts funded with ETH.

2. In a new terminal, deploy the contracts:

```sh
npm run deploy
```

## Development Workflow

### Smart Contract Development

1. **Create/update smart contracts** in the `contracts/` folder
2. **Compile contracts**: `npm run compile`
3. **Write tests** in the `test/` folder
4. **Run tests**: `npx hardhat test`
5. **Deploy locally**: Use Hardhat Ignition as shown above
6. **Export ABI**: Copy generated ABI files to frontend project

### Available Scripts

- `npm run chain` - Start local Ethereum node
- `npm run compile` - Compile smart contracts
- `npm run deploy` - Deploy using Ignition
- `npx hardhat console` - Interactive Hardhat console
- `npx hardhat clean` - Clear cache and artifacts

### Project Structure

```
hardhat/
├── contracts/              # Solidity smart contracts
│   └── NFTMarketplace.sol  # Main marketplace contract
├── ignition/              # Hardhat Ignition deployment
│   ├── modules/           # Deployment modules
│   └── deployments/       # Deployment artifacts
├── abi/                   # Generated contract ABIs
├── test/                  # Contract test files
├── scripts/               # Utility scripts
└── hardhat.config.js      # Hardhat configuration
```

## Smart Contract Features

### NFTMarketplace.sol

- **Collection Creation**: Deploy NFT collections with AI prompts
- **Minting**: Mint NFTs with deferred image generation
- **Marketplace**: Buy, sell, and trade NFTs
- **Royalties**: Automatic royalty distribution
- **Events**: Comprehensive event emission for frontend tracking

## Network Configuration

### Local Development

Default configuration uses Hardhat's built-in network.

## Testing

Run the test suite:

```sh
npx hardhat test
```

Run with coverage:

```sh
npx hardhat coverage
```

## Gas Optimization

The contracts are compiled with optimization enabled:

- Optimizer: Enabled
- Runs: 200
