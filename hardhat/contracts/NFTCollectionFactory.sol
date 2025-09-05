// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./NFTCollection.sol";

contract NFTCollectionFactory is Ownable, ReentrancyGuard {
    uint256 private _collectionIds;
    uint256 public constant LLM_GENERATION_FEE = 0.001 ether;
    uint256 public constant PLATFORM_FEE_PERCENT = 250; // 2.5% platform fee (250 basis points)
    address public constant PLATFORM_WALLET = 0xe55E9c8E6e2EfB0C7b62E78816B6A9Fed9218C81;

    mapping(uint256 => address) public collections;
    mapping(address => uint256[]) public creatorCollections;

    struct CollectionInfo {
        uint256 id;
        address contractAddress;
        address creator;
        string name;
        string symbol;
        string prompt;
        string referenceImageUrl;
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

    function _createPaymentArrays(uint256 mintPrice) 
        private 
        view 
        returns (address payable[] memory payees, uint256[] memory amounts) 
    {
        payees = new address payable[](2);
        amounts = new uint256[](2);

        uint256 platformFeeAmount = (mintPrice * PLATFORM_FEE_PERCENT) / 10000;
        
        payees[0] = payable(msg.sender);
        amounts[0] = mintPrice - platformFeeAmount;

        payees[1] = payable(PLATFORM_WALLET);
        amounts[1] = platformFeeAmount + LLM_GENERATION_FEE;
    }

    function createCollection(
        string memory name,
        string memory symbol,
        string memory prompt,
        string memory referenceImageUrl,
        uint256 maxSupply,
        uint256 mintPrice
    ) external payable nonReentrant returns (uint256) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        require(bytes(prompt).length > 0, "Prompt cannot be empty");
        require(maxSupply > 0 && maxSupply <= 10000, "Invalid max supply");
        require(mintPrice > 0, "Mint price must be greater than 0");
        require(msg.value >= LLM_GENERATION_FEE, "Insufficient payment for LLM generation");
        
        _collectionIds++;
        
        (address payable[] memory payees, uint256[] memory amounts) = _createPaymentArrays(mintPrice);

        NFTCollection newCollection = new NFTCollection(
            name,
            symbol,
            prompt,
            referenceImageUrl,
            maxSupply,
            msg.sender,
            address(this),
            payees,
            amounts
        );

        collections[_collectionIds] = address(newCollection);
        creatorCollections[msg.sender].push(_collectionIds);

        collectionInfo[_collectionIds] = CollectionInfo({
            id: _collectionIds,
            contractAddress: address(newCollection),
            creator: msg.sender,
            name: name,
            symbol: symbol,
            prompt: prompt,
            referenceImageUrl: referenceImageUrl,
            maxSupply: maxSupply,
            mintPrice: mintPrice,
            createdAt: block.timestamp
        });

        payable(PLATFORM_WALLET).transfer(msg.value);
        newCollection.factoryMint(msg.sender);
        emit CollectionCreated(_collectionIds, address(newCollection), msg.sender);

        return _collectionIds;
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

    function getCollectionPrice() external pure returns (uint256) {
        return LLM_GENERATION_FEE;
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
