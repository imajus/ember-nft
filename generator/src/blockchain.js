import { ethers } from 'ethers';
import { config } from './config.js';
import { getNFTFactory, getNFTCollection } from './contracts.js';

export class BlockchainEventListener {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(config.SOMNIA_RPC_URL);
    this.wallet = new ethers.Wallet(config.DEPLOYER_PRIVATE_KEY, this.provider);
    this.contracts = new Map();
  }

  async addCollectionContract(address) {
    const contract = await getNFTCollection(address, this.provider);
    this.contracts.set(address, contract);

    try {
      const lastBlock = await this.provider.getBlockNumber();
      console.log(
        `Current block: ${lastBlock}, querying from block: ${Math.max(
          0,
          lastBlock - 999
        )}`
      );
      // Query for TokenMinted events - try different approaches
      const pastEvents = await contract.queryFilter(
        'TokenMinted',
        Math.max(0, lastBlock - 999),
        lastBlock
      );
      console.log(
        `Found ${pastEvents.length} TokenMinted events for ${address}`
      );
      for (const event of pastEvents) {
        console.log(`Past TokenMinted event:`, {
          tokenId: event.args[0].toString(),
          minter: event.args[1],
          timestamp: event.args[2].toString(),
          blockNumber: event.blockNumber,
          transactionHash: event.transactionHash,
        });
        // Process past events that haven't been generated yet
        await this.handleTokenMinted(
          address,
          event.args[0],
          event.args[1],
          event.args[2]
        );
      }
    } catch (error) {
      console.error(`Error querying past events for ${address}:`, error);
    }

    // Set up listener for future events
    contract.on('TokenMinted', (tokenId, minter, timestamp, event) => {
      console.log(`New TokenMinted event detected:`, {
        tokenId: tokenId.toString(),
        minter,
        timestamp: timestamp.toString(),
        blockNumber: event.blockNumber,
        transactionHash: event.transactionHash,
      });
      this.handleTokenMinted(address, tokenId, minter, timestamp);
    });

    console.log(`Added event listener for collection: ${address}`);
  }

  async handleTokenMinted(collectionAddress, tokenId, minter, timestamp) {
    const contract = this.contracts.get(collectionAddress);
    const isGenerated = await contract.isTokenGenerated(tokenId);
    if (isGenerated) {
      return;
    }
    console.log(`Token minted: ${tokenId} in collection ${collectionAddress}`);
    console.log(`Minter: ${minter}, Timestamp: ${timestamp}`);
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
