# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Development Commands

This is a monorepo with workspaces for frontend, hardhat (smart contracts), and generator (AI service).

### Root Level Commands
- `npm install` - Install dependencies for all workspaces
- `npm run dev --workspace frontend` - Start frontend development server
- `npm run dev --workspace generator` - Start AI generator service with file watching
- `npm run chain --workspace hardhat` - Start local Hardhat blockchain node
- `npm run deploy:local --workspace hardhat` - Deploy contracts to localhost and build artifacts
- `npm run build --workspace hardhat` - Build contract artifacts for frontend consumption

### Frontend Development (cd frontend/)
- `npm run dev` - Start Vite dev server on port 5173
- `npm run build` - Production build
- `npm run lint` - ESLint with strict mode (max-warnings 0)

### Smart Contract Development (cd hardhat/)
- `npm run chain` - Start local blockchain on localhost:8545
- `npm run compile` - Compile contracts and export ABIs to ./abi/
- `npm run deploy:prod` - Deploy to Somnia testnet
- `npx hardhat test` - Run all contract tests
- `npx hardhat test test/FileName.test.js` - Run specific test file

### AI Generator Service (cd generator/)
- `npm start` - Run service in production mode
- `npm run dev` - Development mode with file watching
- `npm test` - Run tests with Vitest

## Development Workflow Setup

1. **Start Local Blockchain**: `npm run chain --workspace hardhat` (terminal 1)
2. **Deploy Contracts**: `npm run deploy:local --workspace hardhat` (terminal 2)
3. **Start Frontend**: `npm run dev --workspace frontend` (terminal 3)
4. **Start AI Service** (optional): `npm run dev --workspace generator` (terminal 4)

## Architecture Overview

### System Design
This is an AI-powered NFT launchpad with mystery box minting - artwork is generated on-demand during the minting process rather than pre-created.

**Core Flow**:
1. Creators deploy NFT collections via factory contract with AI prompts
2. Users mint NFTs by providing specific prompts to collection contracts
3. Backend AI service monitors blockchain events and generates images via DALL-E
4. Generated images are uploaded to IPFS and token metadata is updated on-chain

### Smart Contract Architecture

**Factory Pattern**: `NFTCollectionFactory.sol` creates individual `NFTCollection.sol` contracts.

**Payment Model**: 
- Collection creation: LLM_GENERATION_FEE (0.001 ETH) paid to factory
- NFT minting: Creator price + 2.5% platform fee, distributed immediately on each mint
- AI generation costs covered by collection creation fee

**Key Events for Backend Integration**:
- `TokenMinted` - Triggers AI generation pipeline
- `CollectionCreated` - New collection with prompt template
- `TokenURIUpdated` - Metadata finalized after AI processing

### Frontend Architecture

**Web3 Stack**: 
- Privy for wallet connection and user management
- Ethers.js v6 for blockchain interactions
- Dynamic contract loading via `ember-nft-contracts` package

**Key Integration Points**:
- `src/lib/contracts.js` - Dynamic contract discovery based on chainId
- `src/hooks/useProvider.js` - Ethers provider wrapper around Privy wallets
- `src/lib/privy.js` - Somnia network configuration

**IPFS Integration**: Uploads routed through Cloudflare Worker relayer to Pinata service.

### AI Generator Service

**Event-Driven**: Monitors Somnia blockchain via WebSocket for real-time `TokenMinted` events.

**AI Provider System**: Pluggable architecture supporting DALL-E 2/3 with different capabilities:
- DALL-E 2: Better reference image handling, higher rate limits
- DALL-E 3: Higher quality generation, better prompt following

**Pipeline**: Event detection → AI generation → IPFS upload → Blockchain metadata update

## Environment Configuration

### Frontend (.env)
```
VITE_PRIVY_APP_ID=your_privy_app_id
VITE_PINATA_RELAYER_URL=http://localhost:8787
```

### Hardhat (.env)
```
DEPLOYER_PRIVATE_KEY=your_private_key
```

### Generator (.env)
```
DEPLOYER_PRIVATE_KEY=your_private_key
SOMNIA_RPC_URL=https://dream-rpc.somnia.network
OPENAI_API_KEY=your_openai_key
PINATA_JWT=your_pinata_jwt
AI_MODEL=dalle3
```

## Network Configuration

- **localhost**: Hardhat node (127.0.0.1:8545, chainId 31337)
- **somnia**: Somnia Testnet (chainId 50312)
- **Block Explorer**: Shannon Explorer (shannon-explorer.somnia.network)

## Code Conventions

- ES modules throughout (type: "module" in package.json files)
- Functional React components with hooks, no class components
- JSDoc comments for type hints instead of TypeScript
- Error handling: try/catch with console.error and user-friendly messages
- Contract interactions: Always show loading states during async operations

## Key Dependencies

- **Smart Contracts**: OpenZeppelin contracts, Hardhat with Ignition deployment
- **Frontend**: React 18, Vite, TailwindCSS v4, Privy auth, Ethers v6
- **AI Service**: OpenAI API, Pinata SDK, Sharp for image processing
- **Shared**: `ember-nft-contracts` package for ABI/address distribution

## Testing

- **Smart Contracts**: Hardhat test framework (currently no test files present)
- **Generator Service**: Vitest for unit tests
- **Frontend**: No test framework currently configured