FROM node:24-alpine
WORKDIR /app
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY generator/package*.json ./generator/
COPY hardhat/package*.json ./hardhat/
RUN npm ci --include-workspace-root --workspaces
COPY . ./
WORKDIR /app/generator
CMD ["npm", "start"]