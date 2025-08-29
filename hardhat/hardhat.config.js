import dotenv from 'dotenv';
// import { configVariable } from 'hardhat/config';
// import HardhatKeystore from '@nomicfoundation/hardhat-keystore';
import HardhatEthers from '@nomicfoundation/hardhat-ethers';
import HardhatIgnition from '@nomicfoundation/hardhat-ignition-ethers';
import HardhatABIExporter from '@solidstate/hardhat-abi-exporter';
dotenv.config();

export default {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  plugins: [
    // HardhatKeystore,
    HardhatEthers,
    HardhatIgnition,
    HardhatABIExporter,
  ],
  defaultNetwork: 'localhost',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    somnia: {
      type: 'http',
      chainType: 'l1',
      url: 'https://dream-rpc.somnia.network/',
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
    },
  },
  chainDescriptors: {
    50312: {
      name: 'Somnia Testnet',
      blockExplorers: {
        blockscout: {
          name: 'Shannon Explorer',
          url: 'https://shannon-explorer.somnia.network',
          apiUrl: 'https://shannon-explorer.somnia.network/api',
        },
      },
    },
  },
  abiExporter: {
    path: './abi',
    runOnCompile: true,
    flat: true,
    format: 'json',
  },
};
