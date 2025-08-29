import { ethers } from 'ethers';

/**
 * Get NFT Collection Factory contract instance
 * @param {ethers.ContractRunner} runner
 */
export async function getNFTCollectionFactory(runner) {
  try {
    const { chainId } = await runner.provider.getNetwork();
    const { default: addresses } = await import(
      `./deployments/chain-${chainId}/deployed_addresses.json`
    );
    const { default: abi } = await import('./abi/NFTCollectionFactory.json');
    return new ethers.Contract(
      addresses['NFTCollectionFactoryModule#NFTCollectionFactory'],
      abi,
      runner
    );
  } catch (error) {
    console.error('Error loading NFT Collection Factory contract:', error);
    console.warn('Make sure the contract is deployed to the current network');
    throw error;
  }
}

/**
 * Get NFT Collection contract instance by address
 * @param {string} contractAddress
 * @param {ethers.ContractRunner} runner
 */
export async function getNFTCollection(contractAddress, runner) {
  try {
    const { default: abi } = await import('./abi/NFTCollection.json');
    return new ethers.Contract(contractAddress, abi, runner);
  } catch (error) {
    console.error('Error loading NFT Collection contract:', error);
    throw error;
  }
}
