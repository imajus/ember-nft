import { createAIProvider } from './provider/factory.js';
import { IPFSService } from './ipfs.js';
import { BlockchainEventListener } from './blockchain.js';

export class NFTGenerator {
  constructor() {
    this.ipfsService = new IPFSService();
    this.blockchainListener = new BlockchainEventListener();
  }

  async initialize() {
    console.log('Initializing NFT Generator Service...');
    this.blockchainListener.processTokenGeneration =
      this.processTokenGeneration.bind(this);
    await this.blockchainListener.listenToFactoryEvents();
    const existingCollections =
      await this.blockchainListener.loadExistingCollections();
    console.log('NFT Generator Service initialized successfully');
    return existingCollections;
  }

  async processTokenGeneration(
    collectionAddress,
    tokenId,
    prompt,
    referenceImageUrl
  ) {
    try {
      console.log(
        `Starting generation for token ${tokenId} in collection ${collectionAddress}`
      );
      console.log(`Prompt: ${prompt}`);
      // Unified generation - handles both text-only and reference image generation internally
      const provider = createAIProvider();
      const generatedImage = await provider.generateWithRetry(
        prompt,
        referenceImageUrl
      );
      const imageName = `nft-${collectionAddress}-${tokenId}.png`;
      const metadata = {
        name: `Token #${tokenId}`,
        description: `Generated NFT from collection ${collectionAddress}`,
        prompt: prompt,
        revised_prompt: generatedImage.revisedPrompt,
        reference_image_url: generatedImage.referenceImageUrl,
        attributes: [
          {
            trait_type: 'Generation Method',
            value: generatedImage.hasReferenceImage
              ? 'AI Generated with Reference'
              : 'AI Generated',
          },
          {
            trait_type: 'Model',
            value: 'DALL-E 3',
          },
          {
            trait_type: 'Token ID',
            value: tokenId.toString(),
          },
        ],
      };
      if (generatedImage.hasReferenceImage) {
        metadata.attributes.push({
          trait_type: 'Has Reference Image',
          value: 'Yes',
        });
        // Add style analysis if available
        if (generatedImage.styleAnalysis) {
          metadata.style_analysis = generatedImage.styleAnalysis;
        }
      }
      const upload = await this.ipfsService.uploadImageAndMetadata(
        generatedImage.buffer,
        metadata,
        imageName
      );
      await this.blockchainListener.updateTokenURI(
        collectionAddress,
        tokenId,
        upload.metadataCid
      );
      console.log(
        `✅ Successfully generated and uploaded NFT for token ${tokenId}`
      );
    } catch (error) {
      console.error(`Error processing token ${tokenId}:`, error);
      throw error;
    }
  }

  async cleanup() {
    try {
      await this.blockchainListener.stop();
      console.log('NFT Generator Service cleaned up');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  }
}
