import { ethers } from 'ethers';
import { config } from './config.js';
import { getNFTFactory, getNFTCollection } from './contracts.js';

export class BlockchainEventListener {
  constructor() {
    this.provider = new ethers.WebSocketProvider(config.SOMNIA_RPC_URL);
    this.wallet = new ethers.Wallet(config.DEPLOYER_PRIVATE_KEY, this.provider);
    this.contracts = new Map();
  }

  async addCollectionContract(address) {
    const contract = await getNFTCollection(address, this.provider);
    this.contracts.set(address, contract);
    try {
      // Get current supply and process all existing tokens
      const currentSupply = await contract.getCurrentSupply();
      console.log(
        `Found ${currentSupply} existing tokens in collection ${address}`
      );
      // Process each existing token (those not generated will be handled)
      for (
        let tokenId = 1;
        tokenId <= parseInt(currentSupply.toString());
        tokenId++
      ) {
        console.log(`Processing existing token ${tokenId}`);
        await this.handleTokenMinted(address, tokenId);
      }
    } catch (error) {
      console.error(`Error processing existing tokens for ${address}:`, error);
    }
    // Set up listener for future events
    contract.on('TokenMinted', async (tokenId, minter, timestamp, event) => {
      console.log(`New TokenMinted event detected:`, {
        tokenId: tokenId.toString(),
        minter,
        timestamp: timestamp.toString(),
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
      });
      await this.handleTokenMinted(address, tokenId);
    });
    console.log(`Added event listener for collection: ${address}`);
  }

  async handleTokenMinted(collectionAddress, tokenId) {
    const contract = this.contracts.get(collectionAddress);
    const isGenerated = await contract.isTokenGenerated(tokenId);
    if (isGenerated) {
      console.log(`Token already generated: ${tokenId}`);
      return;
    }
    console.log(`Token minted: ${tokenId} in collection ${collectionAddress}`);
    try {
      // Fetch the collection's prompt and reference image URL
      const contract = this.contracts.get(collectionAddress);
      const prompt = await contract.getPrompt();
      const referenceImageUrl = await contract.getReferenceImageUrl();
      
      // Check if this is a forked collection and compose prompt from lineage
      const parentAddress = await contract.getParent();
      let finalPrompt = prompt;
      
      if (parentAddress && parentAddress !== ethers.ZeroAddress) {
        console.log(`Collection ${collectionAddress} is a fork of ${parentAddress}`);
        try {
          const compositePrompt = await this.composePromptFromLineage(collectionAddress);
          if (compositePrompt) {
            finalPrompt = compositePrompt;
            console.log(`Using composite prompt: ${finalPrompt}`);
          }
        } catch (error) {
          console.error(`Error composing prompt from lineage, using original:`, error);
        }
      }
      
      console.log(`Collection prompt: ${prompt}`);
      console.log(`Final prompt: ${finalPrompt}`);
      console.log(`Reference image URL: ${referenceImageUrl}`);
      await this.processTokenGeneration(
        collectionAddress,
        tokenId,
        finalPrompt,
        referenceImageUrl
      );
    } catch (error) {
      console.error(`Error processing token generation:`, error);
    }
  }

  async processTokenGeneration(
    collectionAddress,
    tokenId,
    prompt,
    referenceImageUrl
  ) {
    console.log(
      `Processing generation for token ${tokenId} with prompt: ${prompt}`
    );
    if (referenceImageUrl && referenceImageUrl !== '') {
      console.log(`Using reference image: ${referenceImageUrl}`);
    }
  }

  async updateTokenURI(collectionAddress, tokenId, tokenURI) {
    try {
      const contract = await getNFTFactory(this.wallet);
      const tx = await contract.updateTokenURI(
        collectionAddress,
        tokenId,
        tokenURI
      );
      await tx.wait();
      console.log(`Updated token URI for ${tokenId}: ${tokenURI}`);
      return tx.hash;
    } catch (error) {
      console.error(`Error updating token URI:`, error);
      throw error;
    }
  }

  async listenToFactoryEvents() {
    const factoryContract = await getNFTFactory(this.provider);
    factoryContract.on('CollectionCreated', (id, collectionAddress, creator, parent, event) => {
      const parentStr = parent === ethers.ZeroAddress ? 'None' : parent;
      console.log(`New collection created: ${collectionAddress}, Creator: ${creator}, Parent: ${parentStr}`);
      if (parent !== ethers.ZeroAddress) {
        console.log(`This is a fork of collection: ${parent}`);
      }
      this.addCollectionContract(collectionAddress);
    });
    const factoryAddress = await factoryContract.getAddress();
    console.log(`Listening to factory events at: ${factoryAddress}`);
    return factoryContract;
  }

  async loadExistingCollections() {
    try {
      const factoryContract = await getNFTFactory(this.provider);
      const allCollections = await factoryContract.getAllCollections();
      const collectionAddresses = [];
      for (const collection of allCollections) {
        collectionAddresses.push(collection.contractAddress);
        await this.addCollectionContract(collection.contractAddress);
      }
      console.log(`Loaded ${collectionAddresses.length} existing collections`);
      return collectionAddresses;
    } catch (error) {
      console.error('Error loading existing collections:', error);
      return [];
    }
  }

  async getCollectionLineage(collectionAddress) {
    try {
      const factoryContract = await getNFTFactory(this.provider);
      const lineage = await factoryContract.getCollectionLineage(collectionAddress);
      console.log(`Lineage for ${collectionAddress}:`, lineage.map(addr => addr.toString()));
      return lineage;
    } catch (error) {
      console.error(`Error getting collection lineage for ${collectionAddress}:`, error);
      throw error;
    }
  }

  async composePromptFromLineage(collectionAddress) {
    try {
      // Get the current collection's prompt
      const currentContract = this.contracts.get(collectionAddress);
      const currentPrompt = await currentContract.getPrompt();
      
      // Get the lineage (parent collections)
      const lineage = await this.getCollectionLineage(collectionAddress);
      
      if (lineage.length === 0) {
        return currentPrompt; // No parents, return current prompt
      }
      
      // Fetch prompts from all ancestor collections (from original to immediate parent)
      const ancestorPrompts = [];
      
      // Process lineage in reverse order (original creator first)
      for (let i = lineage.length - 1; i >= 0; i--) {
        const ancestorAddress = lineage[i];
        try {
          // Get or create contract for ancestor
          let ancestorContract = this.contracts.get(ancestorAddress);
          if (!ancestorContract) {
            ancestorContract = await getNFTCollection(ancestorAddress, this.provider);
          }
          const ancestorPrompt = await ancestorContract.getPrompt();
          ancestorPrompts.push(ancestorPrompt);
          console.log(`Ancestor ${i} (${ancestorAddress}): ${ancestorPrompt}`);
        } catch (error) {
          console.error(`Error fetching prompt from ancestor ${ancestorAddress}:`, error);
          // Continue with other ancestors even if one fails
        }
      }
      
      // Compose final prompt: original + fork1 + fork2 + ... + current
      const allPrompts = [...ancestorPrompts, currentPrompt];
      const compositePrompt = allPrompts.join(' + ');
      
      console.log(`Composite prompt composed from ${allPrompts.length} collections: ${compositePrompt}`);
      return compositePrompt;
      
    } catch (error) {
      console.error(`Error composing prompt from lineage for ${collectionAddress}:`, error);
      throw error;
    }
  }

  async stop() {
    this.provider.removeAllListeners();
    this.contracts.forEach((contract) => {
      contract.removeAllListeners();
    });
    console.log('Event listener stopped');
  }
}
