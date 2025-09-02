import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load ABIs
const abis = {
  NFTCollectionFactory: JSON.parse(
    fs.readFileSync(path.join(__dirname, 'abi/NFTCollectionFactory.json'), 'utf8')
  ),
  NFTCollection: JSON.parse(
    fs.readFileSync(path.join(__dirname, 'abi/NFTCollection.json'), 'utf8')
  ),
  NFTMarketplace: JSON.parse(
    fs.readFileSync(path.join(__dirname, 'abi/NFTMarketplace.json'), 'utf8')
  ),
  SimplePaymentSplitter: JSON.parse(
    fs.readFileSync(path.join(__dirname, 'abi/SimplePaymentSplitter.json'), 'utf8')
  ),
};

// Load deployment addresses for all chains
const deployments = {};
const deploymentsDir = path.join(__dirname, 'ignition/deployments');

try {
  const chainDirs = fs.readdirSync(deploymentsDir);
  
  for (const chainDir of chainDirs) {
    if (chainDir.startsWith('chain-')) {
      const chainId = chainDir.replace('chain-', '');
      const addressesPath = path.join(deploymentsDir, chainDir, 'deployed_addresses.json');
      
      if (fs.existsSync(addressesPath)) {
        const addresses = JSON.parse(fs.readFileSync(addressesPath, 'utf8'));
        deployments[chainId] = addresses;
      }
    }
  }
} catch (error) {
  console.warn('Warning: Could not load deployment addresses:', error.message);
}

// Generate browser-compatible contracts data
const contractsData = {
  abis,
  deployments,
  getDeployments: function(chainId) {
    const addresses = this.deployments[chainId] || {};
    return {
      NFTCollectionFactory: {
        abi: this.abis.NFTCollectionFactory,
        address: addresses['NFTCollectionFactoryModule#NFTCollectionFactory'] || null,
        name: 'NFTCollectionFactory',
        description: 'Factory contract for creating NFT collections',
      },
      NFTCollection: {
        abi: this.abis.NFTCollection,
        address: null, // Individual collection addresses are dynamic
        name: 'NFTCollection',
        description: 'Individual NFT collection contract',
      },
      NFTMarketplace: {
        abi: this.abis.NFTMarketplace,
        address: addresses['NFTMarketplaceModule#NFTMarketplace'] || null,
        name: 'NFTMarketplace',
        description: 'NFT marketplace contract',
      },
      SimplePaymentSplitter: {
        abi: this.abis.SimplePaymentSplitter,
        address: null, // Individual splitter addresses are dynamic
        name: 'SimplePaymentSplitter',
        description: 'Payment splitter contract for revenue sharing',
      },
    };
  }
};

// Write browser-compatible contracts file
const browserContractsContent = `// Generated file - do not edit manually
const abis = ${JSON.stringify(abis, null, 2)};

const deployments = ${JSON.stringify(deployments, null, 2)};

export function getDeployments(chainId) {
  const addresses = deployments[chainId] || {};
  return {
    NFTCollectionFactory: {
      abi: abis.NFTCollectionFactory,
      address: addresses['NFTCollectionFactoryModule#NFTCollectionFactory'] || null,
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
      address: addresses['NFTMarketplaceModule#NFTMarketplace'] || null,
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
`;

fs.writeFileSync(path.join(__dirname, 'dist/contracts.js'), browserContractsContent);
console.log('✅ Browser-compatible contracts file generated at dist/contracts.js');