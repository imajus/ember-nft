// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./NFTCollection.sol";

contract NFTCollectionFactory is Ownable, ReentrancyGuard {
    uint256 private _collectionIds;
    uint256 public platformFeePercent = 250; // 2.5% platform fee (250 basis points)
    address public constant PLATFORM_WALLET =
        0xe55E9c8E6e2EfB0C7b62E78816B6A9Fed9218C81;

    mapping(uint256 => address) public collections;
    mapping(address => uint256[]) public creatorCollections;

    struct CollectionInfo {
        uint256 id;
        address contractAddress;
        address creator;
        string name;
        string symbol;
        string prompt;
        uint256 maxSupply;
        uint256 mintPrice;
        uint256 createdAt;
    }

    mapping(uint256 => CollectionInfo) public collectionInfo;

    event CollectionCreated(
        uint256 indexed collectionId,
        address indexed contractAddress,
        address indexed creator
    );

    constructor() Ownable(msg.sender) {}

    function createCollection(
        string memory name,
        string memory symbol,
        string memory prompt,
        string memory baseTokenURI,
        uint256 maxSupply,
        uint256 mintPrice
    ) external nonReentrant returns (uint256) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        require(bytes(prompt).length > 0, "Prompt cannot be empty");
        require(maxSupply > 0 && maxSupply <= 10000, "Invalid max supply");
        require(mintPrice > 0, "Mint price must be greater than 0");

        _collectionIds++;
        uint256 newCollectionId = _collectionIds;

        address payable[] memory payees = new address payable[](2);
        uint256[] memory shares = new uint256[](2);

        payees[0] = payable(msg.sender);
        shares[0] = 10000 - platformFeePercent; // Creator gets (100% - platform fee)

        payees[1] = payable(PLATFORM_WALLET);
        shares[1] = platformFeePercent; // Platform gets platform fee

        NFTCollection newCollection = new NFTCollection(
            name,
            symbol,
            prompt,
            baseTokenURI,
            maxSupply,
            mintPrice,
            msg.sender,
            address(this),
            payees,
            shares
        );

        address collectionAddress = address(newCollection);
        collections[newCollectionId] = collectionAddress;
        creatorCollections[msg.sender].push(newCollectionId);

        collectionInfo[newCollectionId] = CollectionInfo({
            id: newCollectionId,
            contractAddress: collectionAddress,
            creator: msg.sender,
            name: name,
            symbol: symbol,
            prompt: prompt,
            maxSupply: maxSupply,
            mintPrice: mintPrice,
            createdAt: block.timestamp
        });

        emit CollectionCreated(newCollectionId, collectionAddress, msg.sender);

        return newCollectionId;
    }



    function getCollectionsByCreator(
        address creator
    ) external view returns (uint256[] memory) {
        return creatorCollections[creator];
    }

    function getAllCollections()
        external
        view
        returns (CollectionInfo[] memory)
    {
        CollectionInfo[] memory allCollections = new CollectionInfo[](
            _collectionIds
        );
        for (uint256 i = 1; i <= _collectionIds; i++) {
            allCollections[i - 1] = collectionInfo[i];
        }
        return allCollections;
    }

    function getTotalCollections() external view returns (uint256) {
        return _collectionIds;
    }

    function updateTokenURI(
        address collectionAddress,
        uint256 tokenId,
        string memory newTokenURI
    ) external onlyOwner {
        require(collectionAddress != address(0), "Invalid collection address");
        
        NFTCollection collection = NFTCollection(collectionAddress);
        collection.updateTokenURI(tokenId, newTokenURI);
    }
}
