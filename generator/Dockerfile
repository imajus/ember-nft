FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Copy symlinked directories as actual directories
COPY ../hardhat/abi/ ./abi/
COPY ../hardhat/ignition/deployments/ ./deployments/

# Copy environment example
COPY .env.example ./

EXPOSE 3000

CMD ["npm", "start"]