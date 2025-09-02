import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const abis = {
  NFTCollectionFactory: JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../abi/NFTCollectionFactory.json'),
      'utf8'
    )
  ),
  NFTCollection: JSON.parse(
    fs.readFileSync(path.join(__dirname, '../abi/NFTCollection.json'), 'utf8')
  ),
  NFTMarketplace: JSON.parse(
    fs.readFileSync(path.join(__dirname, '../abi/NFTMarketplace.json'), 'utf8')
  ),
  SimplePaymentSplitter: JSON.parse(
    fs.readFileSync(
      path.join(__dirname, '../abi/SimplePaymentSplitter.json'),
      'utf8'
    )
  ),
};

function loadDeploymentAddresses(chainId) {
  try {
    const deploymentPath = path.join(
      __dirname,
      `../ignition/deployments/chain-${chainId}/deployed_addresses.json`
    );
    return JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  } catch (error) {
    throw new Error(
      `No deployment found for chain ${chainId}: ${error.message}`
    );
  }
}

export function getDeployments(chainId) {
  const addresses = loadDeploymentAddresses(chainId);
  return {
    NFTCollectionFactory: {
      abi: abis.NFTCollectionFactory,
      address: addresses['NFTCollectionFactoryModule#NFTCollectionFactory'],
      name: 'NFTCollectionFactory',
      description: 'Factory contract for creating NFT collections',
    },
    NFTCollection: {
      abi: abis.NFTCollection,
      address: null, // Individual collection addresses are dynamic
      name: 'NFTCollection',
      description: 'Individual NFT collection contract',
    },
    NFTMarketplace: {
      abi: abis.NFTMarketplace,
      address: null, // Not deployed yet
      name: 'NFTMarketplace',
      description: 'NFT marketplace contract',
    },
    SimplePaymentSplitter: {
      abi: abis.SimplePaymentSplitter,
      address: null, // Individual splitter addresses are dynamic
      name: 'SimplePaymentSplitter',
      description: 'Payment splitter contract for revenue sharing',
    },
  };
}

export { abis };
