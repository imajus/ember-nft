# AI-Powered NFT Launchpad

## Overview

An innovative decentralized platform that democratizes NFT creation through AI-powered generation. Creators can launch dynamic NFT collections using simple text prompts, while collectors experience the excitement of mystery minting - where unique AI artwork is generated at the moment of purchase.

## 🎯 Core Innovation

Unlike traditional NFT platforms with pre-generated artwork, our system creates unique AI art in real-time during minting, providing:

- **Mystery Box Experience**: Collectors discover their unique NFT after minting
- **AI-Powered Creativity**: Text prompts transform into stunning visual art
- **Collection Forking**: Create derivative collections that build upon existing ones
- **Fair Economics**: Transparent fee structure with creator-first monetization

## 🚀 Quick Start

### Prerequisites

- Node.js v18+ and npm
- Git
- MetaMask or Web3 wallet

### Installation

1. Clone the repository:

```sh
git clone <repository-url>
cd ember-nft
npm install
```

2. Start the local blockchain (terminal 1):

```sh
cd hardhat
npm run chain
```

3. Deploy smart contracts (terminal 2):

```sh
cd hardhat
npm run deploy
```

4. Start the frontend application (terminal 3):

```sh
cd frontend
npm run dev
```

5. Open your browser at `http://localhost:5173`

## 📦 Project Structure

The project is organized as a monorepo with multiple packages:

```
ember-nft/
├── frontend/          # React-based web application
│   ├── src/          # Application source code
│   └── README.md     # Frontend documentation
│
├── hardhat/          # Smart contracts and blockchain
│   ├── contracts/    # Solidity contracts
│   └── README.md     # Smart contract documentation
│
├── generator/         # AI image generation service
│   ├── src/          # Backend service code
│   └── README.md     # Generator documentation
│
├── pinata/           # IPFS storage relayer
│   └── worker.js     # Cloudflare Worker for Pinata integration
│
└── PRD.md            # Product requirements document
```

## 🎨 Key Features

### For Creators

- **Simple Collection Launch**: Create NFT collections with just a text prompt
- **No Technical Barriers**: User-friendly interface, no coding required
- **Flexible Pricing**: Set your own prices
- **Collection Forking**: Build derivative collections from existing successful ones

### For Collectors

- **Mystery Minting**: Discover unique AI art after purchase
- **Marketplace Trading**: Buy, sell, and resell NFTs
- **Guaranteed Uniqueness**: Each NFT is one-of-a-kind

### Platform Capabilities

- **Real-time Generation**: AI creates artwork on-demand
- **IPFS Storage**: Decentralized, permanent storage
- **Event-Driven Architecture**: Automatic metadata updates
- **Lineage Tracking**: Track collection relationships and revenue sharing
- **Collaborative Creation**: Enable derivative works with fair compensation

## 💰 Economic Model

Transparent fee structure where costs are added on top of creator prices:

- **Creator Price**: 100% goes to the creator
- **Platform Fee**: Small percentage for platform sustainability
- **AI Generation Fee**: Fixed cost for image generation
- **Storage Fee**: IPFS storage costs

Example: If a creator sets 10 USDC, the total might be 13 USDC (10 to creator, 3 for platform services).

### For Derivative Creators

- **Access to Proven Concepts**: Build upon successful collections without starting from scratch
- **Fair Revenue Sharing**: Earn from mints while compensating original creators
- **Creative Collaboration**: Add unique value to existing concepts through forking
- **Lower Barriers to Entry**: Launch collections without needing an established audience

## 🛠️ Technical Stack

- **Frontend**: React, Vite, TailwindCSS, Privy Auth
- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin, Factory Pattern
- **Storage**: IPFS for decentralized media storage
- **AI Integration**: Event-driven image generation pipeline with DALL-E
- **Architecture**: Event-driven backend services with real-time blockchain monitoring
- **Networks**: Ethereum-compatible (Local, Somnia testnet/mainnet)

## 📖 Documentation

For detailed technical information and setup instructions, please refer to:

- [Product Requirements Document](./PRD.md)
- [Frontend Documentation](./frontend/README.md)
- [Smart Contracts Documentation](./hardhat/README.md)

## 🚧 Roadmap

### Current (MVP)

- ✅ Collection creation with AI prompts
- ✅ Mystery box minting experience
- ✅ Collection forking and derivative creation
- ✅ Revenue sharing across collection lineage
- ✅ Basic marketplace functionality
- ✅ IPFS integration

### Future Enhancements

- 🔄 Reference images for AI generation guidance
- 🔄 Fork hierarchy visualization and analytics
- 🔄 AI video NFT generation
- 🔄 Cross-chain compatibility
- 🔄 Advanced gamification mechanics
- 🔄 DAO governance
- 🔄 Metaverse integration

## 📄 License

MIT
