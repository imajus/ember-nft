import { useEffect, useState } from 'react';
import { getNFTCollection } from '../lib/contracts';
import {
  fetchTokenMetadata,
  getImageFromMetadata,
  convertIpfsToHttp,
} from '../lib/ipfs';
import { useProvider } from '../hooks/useProvider';

const DEFAULT_COVER_IMAGE = '/loading.gif';

export default function CollectionCover({ contractAddress, alt = 'Collection cover', className = '', ...props }) {
  const { getProvider } = useProvider();
  const [coverImage, setCoverImage] = useState(DEFAULT_COVER_IMAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (contractAddress) {
      fetchCollectionCover();
    }
  }, [contractAddress]);

  async function fetchCollectionCover() {
    if (!contractAddress) {
      setCoverImage(DEFAULT_COVER_IMAGE);
      setIsLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      setError(null);
      const contract = await getNFTCollection(contractAddress, getProvider());
      const supply = await contract.getCurrentSupply();
      if (supply === 0) {
        setCoverImage(DEFAULT_COVER_IMAGE);
        setIsLoading(false);
        return;
      }
      const tokenId = 1;
      const isGenerated = await contract.isTokenGenerated(tokenId);
      if (!isGenerated) {
        setCoverImage(DEFAULT_COVER_IMAGE);
        setIsLoading(false);
        return;
      }
      const tokenURI = await contract.tokenURI(tokenId);
      if (!tokenURI) {
        setCoverImage(DEFAULT_COVER_IMAGE);
        setIsLoading(false);
        return;
      }
      const metadata = await fetchTokenMetadata(tokenURI);
      if (metadata && metadata.image) {
        const imageUrl = getImageFromMetadata(metadata);
        setCoverImage(imageUrl);
      } else {
        const directImageUrl = convertIpfsToHttp(tokenURI);
        setCoverImage(directImageUrl);
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching collection cover:', err);
      setError(err.message || 'Failed to load collection cover');
      setCoverImage(DEFAULT_COVER_IMAGE);
      setIsLoading(false);
    }
  }

  return (
    <img
      src={coverImage}
      alt={alt}
      className={`${className} ${isLoading ? 'animate-pulse bg-gray-200' : ''}`}
      onError={(e) => {
        e.target.src = '/error.gif';
      }}
      {...props}
    />
  );
}