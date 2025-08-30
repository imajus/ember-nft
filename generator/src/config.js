import dotenv from 'dotenv';

dotenv.config();

export const config = {
  DEPLOYER_PRIVATE_KEY: process.env.DEPLOYER_PRIVATE_KEY,
  SOMNIA_RPC_URL:
    process.env.SOMNIA_RPC_URL || 'https://dream-rpc.somnia.network',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  PINATA_JWT: process.env.PINATA_JWT,
  PINATA_GATEWAY_URL:
    process.env.PINATA_GATEWAY_URL || 'https://gateway.pinata.cloud',
};

export const validateConfig = () => {
  const required = ['DEPLOYER_PRIVATE_KEY', 'OPENAI_API_KEY', 'PINATA_JWT'];
  const missing = required.filter((key) => !config[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }
};
