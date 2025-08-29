import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const NFTCollectionFactoryModule = buildModule("NFTCollectionFactoryModule", (m) => {
  const factory = m.contract("NFTCollectionFactory");

  return { factory };
});

export default NFTCollectionFactoryModule;