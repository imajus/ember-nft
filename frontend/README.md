# Frontend - AI-Powered NFT Launchpad

## Overview

This is the frontend application for the AI-powered NFT Launchpad, built with React, Vite, and TailwindCSS. It provides a user-friendly interface for creating NFT collections, minting NFTs with AI-generated artwork, and trading on the marketplace.

## Prerequisites

- Node.js v18+ and npm
- Git
- Running Hardhat node (see hardhat project README)
- Deployed smart contracts

## Installation

1. Install dependencies:

```sh
npm install
```

2. Copy the `.env.example` to `.env` and configure:

```sh
cp .env.example .env
```

Update the following variables:

- `VITE_REOWN_PROJECT_ID` - Your Reown project ID

## Running the Application

1. Ensure the Hardhat node is running (in the hardhat directory):

```sh
cd ../hardhat
npm run chain
```

2. Ensure contracts are deployed and ABIs are copied:

```sh
# In hardhat directory
npm run deploy
```

3. Start the development server:

```sh
# In frontend directory
npm run dev
```

The application will be available at `http://localhost:5173`

## Development Workflow

### Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure

```
frontend/
├── src/
│   ├── abi/              # Contract ABIs (from hardhat project)
│   ├── components/       # Reusable React components
│   │   └── Navigation.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── CreateNFT.jsx
│   │   ├── Dashboard.jsx
│   │   ├── MyNFTs.jsx
│   │   └── ResellNFT.jsx
│   ├── lib/             # Utilities and configurations
│   │   ├── appkit.js    # WalletConnect AppKit setup
│   │   └── contracts.js # Contract interactions
│   ├── styles/          # Global styles
│   ├── App.jsx          # Main app component with routing
│   └── main.jsx         # Application entry point
├── public/              # Static assets
├── .env.example         # Environment variables template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # TailwindCSS configuration
└── package.json         # Project dependencies
```

## Features

### Core Functionality

1. **Home Page** - Browse collections and featured NFTs
2. **Create NFT** - Launch new NFT collections with AI prompts
3. **Dashboard** - Manage your collections and track sales
4. **My NFTs** - View and manage owned NFTs
5. **Resell NFT** - List NFTs for sale on marketplace

### Web3 Integration

- **Wallet Connection**: Support for MetaMask, WalletConnect, and other Web3 wallets
- **Network Support**: Local, Somnia testnet, and Somnia mainnet
- **Real-time Updates**: Listen to blockchain events for live updates
- **Transaction Management**: User-friendly transaction status and error handling

## Configuration

### Environment Variables

```env
# Reown Project ID (required)
VITE_REOWN_PROJECT_ID=your_project_id
```

### Network Configuration

The application supports multiple networks configured in `src/lib/appkit.js`:

- **Localhost**: Development network (Hardhat node)
- **Somnia Testnet**: Test network for staging

## Building for Production

1. Build the application:

```sh
npm run build
```

2. Preview the production build:

```sh
npm run preview
```

3. Deploy the `dist/` folder to your hosting service

## Styling

The application uses TailwindCSS for styling:

- Utility-first CSS framework
- Responsive design with mobile-first approach
- Dark mode support (can be implemented)
- Custom components in `src/styles/globals.css`

## State Management

- React hooks for local component state
- Context API for global state (wallet, contracts)
- Event listeners for blockchain state updates

## Error Handling

- Try-catch blocks for all async operations
- User-friendly error messages
- Loading states during transactions
- Fallback UI for connection issues

## License

MIT
