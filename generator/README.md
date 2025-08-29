# NFT Generator Service

AI-powered NFT generation service built as a Node.js application that continuously listens for blockchain events and automatically generates and uploads NFT images and metadata when minting events occur on the Somnia blockchain.

## Features

- **Continuous Blockchain Monitoring**: Runs as a persistent Node.js service monitoring Somnia Testnet
- **AI Image Generation**: Uses OpenAI's DALL-E 3 to generate high-quality NFT artwork from prompts
- **IPFS Integration**: Uploads images and metadata to IPFS via Pinata
- **Automated Metadata Updates**: Updates smart contract token URIs automatically
- **Rate Limiting**: Implements OpenAI API rate limiting and cost management
- **Error Handling**: Robust error handling with retry mechanisms

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Smart         │    │   Generator      │    │   OpenAI        │
│   Contract      │───▶│   Service        │───▶│   DALL-E 3      │
│   (Somnia)      │    │   (Node.js)      │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                               │
                               ▼
                       ┌──────────────────┐
                       │   IPFS/Pinata    │
                       │   Storage        │
                       └──────────────────┘
```

## Prerequisites

- Node.js 18+
- OpenAI API key
- Pinata JWT token for IPFS uploads
- Deployer private key for blockchain transactions

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
DEPLOYER_PRIVATE_KEY=your_deployer_private_key_here
SOMNIA_RPC_URL=https://dream-rpc.somnia.network
OPENAI_API_KEY=your_openai_api_key_here
PINATA_JWT=your_pinata_jwt_token_here
PINATA_GATEWAY_URL=https://gateway.pinata.cloud
```

**Note**: The factory contract address is automatically loaded from `deployments/chain-50312/deployed_addresses.json` and existing collections are discovered from the factory contract.

## Installation

```bash
npm install
```

## Development

Run in development mode with file watching:

```bash
npm run dev
```

## Production

Run the service:

```bash
npm start
```

## Service Management

The service runs continuously and automatically:

1. **Connects to Somnia blockchain** using the configured RPC URL
2. **Monitors factory contract** for new collection creation events
3. **Listens to collection contracts** for minting and generation request events
4. **Processes generation requests** automatically in the background
5. **Handles graceful shutdown** on SIGINT/SIGTERM signals

## How It Works

1. **Service Startup**: The service automatically connects to the Somnia blockchain and starts monitoring
2. **Event Monitoring**: Continuously listens to events from the NFT Collection Factory contract
3. **New Collections**: When a new collection is created, it automatically starts monitoring that collection
4. **Mint Detection**: When a `TokenMinted` event occurs, it triggers the generation process
5. **AI Generation**: The service sends the prompt to OpenAI's DALL-E 3 API
6. **IPFS Upload**: Generated images and metadata are uploaded to IPFS via Pinata
7. **Contract Update**: The smart contract's `updateTokenURI()` function is called with the IPFS metadata URL

## Event Types Monitored

### From NFTCollectionFactory
- `CollectionCreated`: Adds new collection to monitoring list

### From NFTCollection
- `TokenMinted`: Triggers image generation for newly minted tokens

## Rate Limiting

The service implements rate limiting for OpenAI API requests:
- Maximum 20 requests per minute
- Automatic backoff and retry mechanism
- Exponential backoff for failed requests (up to 3 retries)

## Error Handling

- Failed generations are retried up to 3 times with exponential backoff
- Processing status is tracked for all tokens
- Comprehensive error logging and status reporting
- Graceful cleanup on service termination

## Process Management

The service handles system signals gracefully:
- **SIGINT** (Ctrl+C): Graceful shutdown with cleanup
- **SIGTERM**: Graceful shutdown for process managers
- **Unhandled rejections**: Logged for debugging
- **Uncaught exceptions**: Logged and service exits

## File Structure

```
generator/
├── src/
│   ├── index.js          # Main Node.js application entry point
│   ├── generator.js      # Core NFT generation orchestration
│   ├── blockchain.js     # Blockchain event listener
│   ├── openai.js         # OpenAI integration with rate limiting
│   ├── ipfs.js          # IPFS/Pinata integration
│   └── config.js        # Configuration management
├── abi/                 # Symlink to smart contract ABIs
├── package.json         # Dependencies and scripts
└── .env.example        # Environment variables template
```

## Dependencies

- `dotenv`: Environment variable management
- `ethers`: Ethereum blockchain interaction
- `openai`: OpenAI API integration
- `pinata-web3`: IPFS uploads via Pinata

## Security Considerations

- Private keys are stored as environment variables
- Rate limiting prevents excessive API usage
- Input validation and error handling
- Error messages don't expose sensitive information

## Deployment Options

### Local Development
```bash
npm run dev  # Runs with file watching for development
```

### Production Server
```bash
npm start  # Runs the service in production mode
```

### Process Manager (PM2)
```bash
npm install -g pm2
pm2 start src/index.js --name nft-generator
pm2 save
pm2 startup
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["npm", "start"]
```

### Systemd Service
```ini
[Unit]
Description=NFT Generator Service
After=network.target

[Service]
Type=simple
User=nft-generator
WorkingDirectory=/path/to/generator
ExecStart=/usr/bin/node src/index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

## Troubleshooting

### Common Issues

1. **Service not starting**: Check that all required environment variables are set
2. **Generation failures**: Verify OpenAI API key and billing status
3. **IPFS upload failures**: Confirm Pinata JWT token is valid
4. **Blockchain connection**: Ensure Somnia RPC URL is accessible

### Logs

The service outputs detailed logs to console including:
- Service initialization status
- Blockchain event detection
- Generation progress and results
- Error details and retry attempts