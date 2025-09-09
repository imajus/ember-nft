import { useWeb3 } from '../context/Web3Context';

/**
 * Hook that provides Web3 functionality
 * Returns ethers provider and signer for Web3 interactions
 */
export function useProvider() {
  return useWeb3();
}
