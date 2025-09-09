# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm start` - Run the NFT generator service in production mode
- `npm run dev` - Run the service with file watching for development
- `npm test` - Run tests using Vitest

## Environment Configuration

The service requires environment variables configured in `.env`:
- `DEPLOYER_PRIVATE_KEY` - Private key for blockchain transactions
- `SOMNIA_RPC_URL` - Somnia blockchain RPC endpoint (defaults to https://dream-rpc.somnia.network)
- `OPENAI_API_KEY` - OpenAI API key for DALL-E image generation
- `PINATA_JWT` - Pinata JWT token for IPFS uploads
- `PINATA_GATEWAY_URL` - Pinata gateway URL (defaults to https://gateway.pinata.cloud)
- `AI_MODEL` - AI model selection: 'dalle2' or 'dalle3' (defaults to 'dalle3')

Copy `.env.example` to `.env` and configure these values before running.

## Architecture Overview

This is a Node.js service that monitors blockchain events and generates NFT images using AI. The main components are:

### Core Architecture Flow
1. **Service Entry Point** (`src/index.js`) - Initializes service with graceful shutdown handling
2. **NFT Generator** (`src/generator.js`) - Main orchestrator that coordinates AI generation and IPFS uploads
3. **Blockchain Listener** (`src/blockchain.js`) - Monitors Somnia blockchain for NFT minting events
4. **AI Provider System** (`src/provider/`) - Pluggable AI image generation with DALL-E 2/3 support
5. **IPFS Service** (`src/ipfs.js`) - Handles image and metadata uploads to IPFS via Pinata

### Key Design Patterns

**Event-Driven Architecture**: The service listens to blockchain events (`TokenMinted`, `CollectionCreated`) and processes them asynchronously.

**Provider Pattern**: AI image generation uses a factory pattern (`src/provider/factory.js`) that can switch between DALL-E 2 and DALL-E 3 implementations based on configuration.

**Smart Contract Integration**: Uses the `ember-nft-contracts` package to load contract ABIs and addresses. Factory contract discovery happens automatically from deployment files.

### Processing Flow
1. Service connects to Somnia blockchain via WebSocket provider
2. Loads existing NFT collections from factory contract
3. Listens for new `TokenMinted` events across all monitored collections
4. For each minted token:
   - Fetches collection prompt and reference image URL
   - Generates image using configured AI provider (DALL-E 2/3)
   - Uploads image and metadata to IPFS
   - Updates token URI on blockchain via factory contract

## Working with AI Providers

The service supports both DALL-E 2 and DALL-E 3 with different capabilities:
- **DALL-E 2** (`src/provider/dalle2.js`) - Better reference image handling via Variation API, higher rate limits
- **DALL-E 3** (`src/provider/dalle3.js`) - Higher quality generation, better prompt following, Vision API analysis

Switch between providers using the `AI_MODEL` environment variable.

## Blockchain Integration

- Uses ethers.js v6 with WebSocket provider for real-time event listening
- Contract addresses and ABIs loaded from `ember-nft-contracts` package
- Automatically discovers collections from factory contract on startup
- Processes both existing tokens and new mints

## Error Handling & Reliability

- Implements exponential backoff retry logic for AI generation
- Rate limiting for OpenAI API (20 requests/minute default)
- Graceful shutdown on SIGINT/SIGTERM with cleanup
- Comprehensive error logging with operation status tracking