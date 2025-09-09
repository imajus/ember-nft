# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Development Commands

**Local Development:**
- `npm run chain` - Start local Hardhat node on localhost:8545
- `npm run compile` - Compile Solidity contracts and generate ABIs in ./abi/
- `npx hardhat test` - Run contract tests
- `npm run build` - Build browser-compatible contracts file for frontend integration

**Deployment:**
- `npm run deploy:local` - Deploy to localhost network and build contracts
- `npm run deploy:prod` - Deploy to Somnia testnet and build contracts
- `npm run verify:prod` - Verify contracts on Somnia block explorer

**Single Test Execution:**
- `npx hardhat test test/FileName.test.js` - Run specific test file

## Smart Contract Architecture

This is a factory-based NFT launchpad system with AI-powered metadata generation:

### Core Contracts Architecture

**NFTCollectionFactory.sol** - Central factory contract that:
- Creates new NFT collections via `createCollection()`
- Manages collection registry and creator mappings
- Handles immediate payment distribution (2.5% platform fee + LLM generation fee)
- Enables post-mint metadata updates through `updateTokenURI()` (owner-only)
- Stores collection metadata including AI prompt templates

**NFTCollection.sol** - Individual collection contracts that:
- Handle AI-prompted minting with deferred metadata updates
- Implement immediate multi-party payment splitting on each mint
- Track generation status for tokens awaiting AI processing
- Support minting controls and time windows
- Emit comprehensive events for backend AI generation pipeline

**Key Workflow:**
1. Creator pays LLM_GENERATION_FEE to deploy collection via factory
2. Users mint NFTs by providing specific prompts to collection contract
3. Backend monitors `TokenMinted` events to trigger AI image generation
4. Factory owner calls `updateTokenURI()` to set final metadata after AI processing
5. Payment distribution happens immediately on each mint (creator share + platform fee)

### Deployment & ABI Management

**Hardhat Ignition:** Uses modules in `ignition/modules/` for deterministic deployments
**ABI Export:** Auto-generates ABIs to `./abi/` on compilation for frontend consumption
**Contract Distribution:** `build-contracts.js` creates `dist/contracts.js` with deployment addresses and ABIs for browser integration

### Network Configuration

- **localhost:** Hardhat's built-in network (127.0.0.1:8545)
- **somnia:** Somnia testnet with Blockscout explorer integration
- **Chain ID 50312:** Somnia testnet identifier

### Payment Architecture

Factory charges LLM_GENERATION_FEE (0.001 ETH) on collection creation. Each NFT mint distributes payments immediately:
- Creator receives: `mintPrice - (mintPrice * 2.5%)`
- Platform receives: `2.5% + LLM_GENERATION_FEE`

### Event Monitoring for AI Pipeline

Essential events for backend integration:
- `CollectionCreated` - New collection deployed with prompt template
- `TokenMinted` - NFT minted with user prompt (triggers AI generation)
- `TokenURIUpdated` - Metadata finalized after AI processing
- `PaymentDistributed` - Payment distribution completed