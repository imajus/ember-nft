import { NFTGenerator } from './generator.js';
import { validateConfig } from './config.js';

async function main() {
  try {
    console.log('🚀 Starting NFT Generator Service...');

    validateConfig();

    const nftGenerator = new NFTGenerator();
    const existingCollections = await nftGenerator.initialize();

    console.log(`✅ NFT Generator Service initialized successfully`);
    console.log(
      `📊 Monitoring ${existingCollections.length} existing collections`
    );
    console.log('🔄 Listening for blockchain events...');

    global.nftGenerator = nftGenerator;
  } catch (error) {
    console.error('❌ Error starting service:', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log('\n🛑 Received SIGINT, cleaning up...');
  if (global.nftGenerator) {
    await global.nftGenerator.cleanup();
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Received SIGTERM, cleaning up...');
  if (global.nftGenerator) {
    await global.nftGenerator.cleanup();
  }
  process.exit(0);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

main();
