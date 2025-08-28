# AGENTS.md - Developer Guidelines for Ethereum NFT Marketplace

## Build/Test/Lint Commands
- **Development**: `npm run dev` (frontend), `npm run chain` (local blockchain)
- **Build**: `npm run build` (production build)
- **Lint**: `npm run lint` (ESLint for JS/JSX files)
- **Smart Contracts**: `npm run compile` → `npm run deploy` → `npm run export` (deployment workflow)
- **No tests configured** - consider adding Vitest for frontend, Hardhat tests for contracts

## Code Style & Conventions
- **ES Modules**: Use `import/export`, not CommonJS (type: "module" in package.json)
- **React**: Functional components, JSX runtime (no React import needed), hooks pattern
- **Naming**: PascalCase components, camelCase functions/variables, kebab-case files
- **Imports**: Absolute imports from src/, group by: React/external → internal → styles
- **Error Handling**: Try/catch with descriptive console.error, graceful fallbacks
- **Smart Contracts**: Solidity 0.8.20, OpenZeppelin patterns, gas optimization enabled

## Architecture
- **Frontend**: React + Vite + TailwindCSS + React Router
- **Blockchain**: Hardhat + Ethers.js v6 + Reown AppKit wallet integration
- **Deployment**: Hardhat Ignition system, ABIs exported to src/abi/
- **State**: No global state management - use React hooks and context as needed