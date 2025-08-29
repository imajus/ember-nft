import { AIImageGenerator } from './openai.js';
import { IPFSService } from './ipfs.js';
import { BlockchainEventListener } from './blockchain.js';

export class NFTGenerator {
  constructor() {
    this.aiGenerator = new AIImageGenerator();
    this.ipfsService = new IPFSService();
    this.blockchainListener = new BlockchainEventListener();
  }

  async initialize() {
    console.log('Initializing NFT Generator Service...');
    await this.blockchainListener.listenToFactoryEvents();
    const existingCollections =
      await this.blockchainListener.loadExistingCollections();
    this.blockchainListener.processTokenGeneration =
      this.processTokenGeneration.bind(this);
    console.log('NFT Generator Service initialized successfully');
    return existingCollections;
  }

  async processTokenGeneration(collectionAddress, tokenId, prompt) {
    try {
      console.log(
        `Starting generation for token ${tokenId} in collection ${collectionAddress}`
      );
      console.log(`Prompt: ${prompt}`);

      const generatedImage = await this.aiGenerator.generateWithRetry(prompt);
      const imageName = `nft-${collectionAddress}-${tokenId}.png`;

      const metadata = {
        name: `Token #${tokenId}`,
        description: `Generated NFT from collection ${collectionAddress}`,
        prompt: prompt,
        revised_prompt: generatedImage.revisedPrompt,
        attributes: [
          {
            trait_type: 'Generation Method',
            value: 'AI Generated',
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

      const upload = await this.ipfsService.uploadImageAndMetadata(
        generatedImage.buffer,
        metadata,
        imageName
      );

      await this.blockchainListener.updateTokenURI(
        collectionAddress,
        tokenId,
        upload.metadata.hash
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
