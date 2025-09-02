import { ethers } from 'ethers';
import { getDeployments } from 'ember-nft-contracts';

/**
 * Get NFT Collection Factory contract instance
 * @param {ethers.ContractRunner} runner
 */
export async function getNFTCollectionFactory(runner) {
  try {
    const { chainId } = await runner.provider.getNetwork();
    const deployments = getDeployments(chainId);
    const { abi, address } = deployments.NFTCollectionFactory;
    return new ethers.Contract(address, abi, runner);
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
    const deployments = getDeployments(31337); // chainId doesn't matter for ABI-only access
    const { abi } = deployments.NFTCollection;
    return new ethers.Contract(contractAddress, abi, runner);
  } catch (error) {
    console.error('Error loading NFT Collection contract:', error);
    throw error;
  }
}
