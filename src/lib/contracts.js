import { ethers } from 'ethers';

/**
 * Get default provider based on environment configuration
 */
export function getDefaultProvider() {
  const hardhatRpcUrl = import.meta.env.VITE_HARDHAT_RPC_URL || 'http://127.0.0.1:8545';
  
  // Default to local hardhat network
  return new ethers.JsonRpcProvider(hardhatRpcUrl);
}

/**
 * Get NFT Marketplace contract instance
 * @param {ethers.ContractRunner} runner
 */
export async function getNFTMarketplace(runner) {
  try {
    const { chainId } = await runner.provider.getNetwork();
    const { default: addresses } = await import(
      `../../ignition/deployments/chain-${chainId}/deployed_addresses.json`
    );
    const { default: abi } = await import('../abi/NFTMarketplace.json');
    return new ethers.Contract(
      addresses['NFTMarketplaceModule#NFTMarketplace'],
      abi,
      runner
    );
  } catch (error) {
    console.error('Error loading contract:', error);
    console.warn('Make sure the contract is deployed to the current network');
    throw error;
  }
}
