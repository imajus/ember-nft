# Hardhat Smart Contract Project

## Overview

This is the smart contract backend for the AI-powered NFT Launchpad, built with Solidity and Hardhat. It provides the blockchain infrastructure for NFT collection creation, AI-prompted minting, and payment distribution functionality.

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
npm run chain
```

This will start a local Ethereum node on `http://localhost:8545` with test accounts funded with ETH.

2. In a new terminal, deploy the contracts:

```sh
npx hardhat ignition deploy ignition/modules/NFTCollectionFactory.js --network localhost
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
- `npx hardhat ignition deploy ignition/modules/NFTCollectionFactory.js --network localhost` - Deploy using Ignition
- `npx hardhat console` - Interactive Hardhat console
- `npx hardhat clean` - Clear cache and artifacts

### Project Structure

```
hardhat/
├── contracts/                    # Solidity smart contracts
│   ├── NFTCollectionFactory.sol  # Factory for creating collections
│   ├── NFTCollection.sol         # Individual NFT collection contract
│   ├── SimplePaymentSplitter.sol # Payment distribution utility
│   └── NFTMarketplace.sol        # Legacy marketplace contract
├── ignition/                     # Hardhat Ignition deployment
│   ├── modules/                  # Deployment modules
│   └── deployments/             # Deployment artifacts
├── abi/                         # Generated contract ABIs (symlinked to frontend)
├── test/                        # Contract test files
├── scripts/                     # Utility scripts
└── hardhat.config.js            # Hardhat configuration
```

## Smart Contract Features

### NFTCollectionFactory.sol

- **Collection Deployment**: Factory contract for creating new NFT collections
- **Payment Splitting**: Automatic distribution of mint proceeds to creators and platform
- **Access Control**: Creator verification and collection management
- **Collection Registry**: Track all deployed collections and their metadata
- **Events**: Emit events for backend integration and tracking

### NFTCollection.sol

- **AI-Prompted Minting**: Mint NFTs with text prompts for AI generation
- **Deferred Metadata**: Support for post-mint URI updates after AI generation
- **Payment Distribution**: Multi-party payment splitting on each mint
- **Minting Controls**: Enable/disable minting, set time windows
- **Generation Tracking**: Track which tokens have completed AI generation
- **Events**: Comprehensive event emission for backend processing

### SimplePaymentSplitter.sol

- **Revenue Sharing**: Distribute payments among multiple recipients
- **Proportional Splits**: Share distribution based on configured percentages
- **Release Management**: Allow recipients to claim their share of payments
- **Gas Efficient**: Optimized for minimal gas usage during distributions

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
- Via IR: Enabled (for complex contracts)

## AI Integration Workflow

1. **Collection Creation**: Creator deploys collection via factory with AI prompt template
2. **Minting**: Users mint NFTs by providing specific prompts
3. **Generation Request**: Contract emits `GenerationRequested` event with prompt
4. **Backend Processing**: Event listener picks up requests and queues AI generation
5. **Metadata Update**: Generated image is uploaded to IPFS, metadata updated via `updateTokenURI`
6. **Completion**: Token marked as generated, ready for display and trading

## Event Monitoring

Key events to monitor for backend integration:

- `CollectionCreated`: New collection deployed
- `TokenMinted`: New NFT minted with prompt
- `GenerationRequested`: AI generation needed for token
- `TokenURIUpdated`: Metadata updated after generation
- `PaymentReceived`: Funds received for payment splitting
