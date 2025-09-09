# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Test/Lint Commands

- `npm run dev` - Start Vite development server on port 5173
- `npm run build` - Production build to `dist/`
- `npm run start` - Preview production build locally
- `npm run lint` - ESLint with max-warnings 0 (strict mode)

## Prerequisites for Development

- Node.js v18+ and npm
- Running Hardhat node (from `../hardhat` directory): `npm run chain`
- Deployed smart contracts with ABIs copied: `npm run deploy` (from hardhat directory)
- Environment variables configured in `.env` (copy from `.env.example`)

## Architecture Overview

### Web3 Integration Stack
- **Wallet Management**: Privy (@privy-io/react-auth) for authentication and wallet connection
- **Blockchain**: Ethers.js v6 for contract interactions
- **Network**: Somnia Testnet (chain ID 50311) with local development support
- **Contracts**: Dynamic loading via `ember-nft-contracts` package from hardhat project

### Core Application Flow
1. **Contract Discovery**: `src/lib/contracts.js` dynamically loads contract ABIs and addresses based on chainId using `getDeployments()` from the hardhat package
2. **Provider Management**: `src/hooks/useProvider.js` wraps Privy wallet connection for ethers compatibility  
3. **NFT Collection Creation**: Multi-step wizard in `src/pages/Create.jsx` with AI prompt-based generation
4. **IPFS Integration**: `src/lib/ipfs.js` handles metadata and image uploads via Pinata relayer
5. **Reusable Components**: `Web3Button` component automatically handles wallet connection state

### Key Configuration Files
- `src/lib/privy.js` - Somnia network configuration and Privy setup
- `src/App.jsx` - Main router with PrivyProvider wrapper
- Environment requires `VITE_PRIVY_APP_ID` and `VITE_PINATA_RELAYER_URL`

### Data Dependencies
- Contract ABIs are imported as npm package from `../hardhat` project
- No ABI files stored locally - all come from `ember-nft-contracts` package
- IPFS uploads routed through Cloudflare Worker relayer for Pinata integration

## Code Conventions

- ES modules only, no React import needed (new JSX transform)
- Functional components with hooks, PascalCase naming
- camelCase for variables/functions
- Try/catch with console.error and user-friendly error messages
- Show loading states during async operations
- JSDoc comments for type hints (no TypeScript)