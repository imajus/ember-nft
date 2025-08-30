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
      // Fetch the collection's prompt since it's not in the event anymore
      const contract = this.contracts.get(collectionAddress);
      const prompt = await contract.getPrompt();
      console.log(`Collection prompt: ${prompt}`);
      await this.processTokenGeneration(collectionAddress, tokenId, prompt);
    } catch (error) {
      console.error(`Error processing token generation:`, error);
    }
  }

  async processTokenGeneration(collectionAddress, tokenId, prompt) {
    console.log(
      `Processing generation for token ${tokenId} with prompt: ${prompt}`
    );
  }

  async updateTokenURI(collectionAddress, tokenId, tokenURI) {
    try {
      const factoryContract = await getNFTFactory(this.wallet);
      const tx = await factoryContract.updateTokenURI(
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
    factoryContract.on('CollectionCreated', (id, collectionAddress) => {
      console.log(`New collection created: ${collectionAddress}`);
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

  async stop() {
    this.provider.removeAllListeners();
    this.contracts.forEach((contract) => {
      contract.removeAllListeners();
    });
    console.log('Event listener stopped');
  }
}
