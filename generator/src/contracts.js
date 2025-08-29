import { ethers } from 'ethers';

/**
 * Get NFT Collection Factory contract instance
 * @param {ethers.ContractRunner} runner
 */
export async function getNFTFactory(runner) {
  try {
    const { chainId } = await runner.provider.getNetwork();
    const { default: addresses } = await import(
      `../deployments/chain-${chainId}/deployed_addresses.json`,
      { with: { type: 'json' } }
    );
    const { default: abi } = await import('../abi/NFTCollectionFactory.json', {
      with: { type: 'json' },
    });
    const address =
      addresses['NFTCollectionFactoryModule#NFTCollectionFactory'];
    return new ethers.Contract(address, abi, runner);
  } catch (error) {
    console.error('Error loading NFT Collection Factory contract:', error);
    throw new Error(`Failed to load factory contract: ${error.message}`);
  }
}

/**
 * Get NFT Collection contract instance by address
 * @param {string} contractAddress
 * @param {ethers.ContractRunner} runner
 */
export async function getNFTCollection(contractAddress, runner) {
  try {
    const { default: abi } = await import('../abi/NFTCollection.json', {
      with: { type: 'json' },
    });
    return new ethers.Contract(contractAddress, abi, runner);
  } catch (error) {
    console.error('Error loading NFT Collection contract:', error);
    throw error;
  }
}
