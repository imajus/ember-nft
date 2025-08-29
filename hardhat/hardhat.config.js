import HardhatEthers from '@nomicfoundation/hardhat-ethers';
import HardhatIgnition from '@nomicfoundation/hardhat-ignition-ethers';
import HardhatABIExporter from '@solidstate/hardhat-abi-exporter';

export default {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  plugins: [HardhatEthers, HardhatIgnition, HardhatABIExporter],
  defaultNetwork: 'localhost',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
  },
  abiExporter: {
    path: './abi',
    runOnCompile: true,
    flat: true,
    format: 'json',
  },
};
