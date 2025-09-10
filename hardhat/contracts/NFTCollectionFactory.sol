// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./NFTCollection.sol";

contract NFTCollectionFactory is Ownable, ReentrancyGuard {
    uint256 private _collectionIds;
    uint256 public constant LLM_GENERATION_FEE = 0.001 ether;
    uint256 public constant PLATFORM_FEE_PERCENT = 250; // 2.5% platform fee (250 basis points)
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
        string referenceImageUrl;
        uint256 maxSupply;
        uint256 mintPrice;
        uint256 createdAt;
        uint256 parentId;
    }

    mapping(uint256 => CollectionInfo) public collectionInfo;

    event CollectionCreated(
        uint256 indexed collectionId,
        address indexed contractAddress,
        address indexed creator,
        address parent
    );

    constructor() Ownable(msg.sender) {}

    function _createPaymentArrays(
        uint256 mintPrice,
        address parent
    )
        private
        view
        returns (address payable[] memory payees, uint256[] memory amounts)
    {
        uint256 platformFeeAmount = (mintPrice * PLATFORM_FEE_PERCENT) / 10000;

        if (parent == address(0)) {
            // No parent - simple creator + platform split
            payees = new address payable[](2);
            amounts = new uint256[](2);

            payees[0] = payable(msg.sender);
            amounts[0] = mintPrice - platformFeeAmount;

            payees[1] = payable(PLATFORM_WALLET);
            amounts[1] = platformFeeAmount;
        } else {
            // Has parent - distribute fees through lineage according to PRD
            address[] memory lineage = getCollectionLineage(parent);
            uint256 lineageCount = lineage.length;

            // Creator + lineage creators + platform
            payees = new address payable[](lineageCount + 2);
            amounts = new uint256[](lineageCount + 2);

            // Calculate lineage fees according to PRD:
            // Original Creator: 10% (constant across all fork levels)
            // Fork Level n: 5% / (2^(n-1))
            uint256 totalLineageFee = 0;

            // Calculate total lineage fees first
            for (uint256 i = 0; i < lineageCount; i++) {
                if (i == lineageCount - 1) {
                    // Original creator gets 10%
                    totalLineageFee += (mintPrice * 1000) / 10000; // 10%
                } else {
                    // Fork creators get diminishing returns: 5% / (2^(level-1))
                    uint256 forkLevel = lineageCount - 1 - i;
                    uint256 forkFeePercent = 500 / (2 ** (forkLevel - 1)); // 5% / 2^(n-1) in basis points
                    totalLineageFee += (mintPrice * forkFeePercent) / 10000;
                }
            }

            // Current creator gets remaining after platform and lineage fees
            uint256 creatorAmount = mintPrice -
                platformFeeAmount -
                totalLineageFee;

            payees[0] = payable(msg.sender);
            amounts[0] = creatorAmount;

            // Distribute to lineage
            for (uint256 i = 0; i < lineageCount; i++) {
                NFTCollection ancestor = NFTCollection(lineage[i]);
                payees[i + 1] = payable(ancestor.creator());

                if (i == lineageCount - 1) {
                    // Original creator gets 10%
                    amounts[i + 1] = (mintPrice * 1000) / 10000;
                } else {
                    // Fork creators get diminishing returns
                    uint256 forkLevel = lineageCount - 1 - i;
                    uint256 forkFeePercent = 500 / (2 ** (forkLevel - 1));
                    amounts[i + 1] = (mintPrice * forkFeePercent) / 10000;
                }
            }

            // Platform gets its fee
            payees[lineageCount + 1] = payable(PLATFORM_WALLET);
            amounts[lineageCount + 1] = platformFeeAmount;
        }
    }

    function createCollection(
        string memory name,
        string memory symbol,
        string memory prompt,
        string memory referenceImageUrl,
        uint256 maxSupply,
        uint256 mintPrice,
        uint256 parentId
    ) external payable nonReentrant returns (uint256) {
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        require(bytes(prompt).length > 0, "Prompt cannot be empty");
        require(maxSupply > 0 && maxSupply <= 10000, "Invalid max supply");
        require(mintPrice > 0, "Mint price must be greater than 0");
        require(
            msg.value >= LLM_GENERATION_FEE,
            "Insufficient payment for LLM generation"
        );

        // Convert parentId to parent address
        address parentAddress = address(0);
        if (parentId > 0) {
            require(parentId <= _collectionIds, "Invalid parent collection ID");
            parentAddress = collections[parentId];
        }

        _collectionIds++;

        (
            address payable[] memory payees,
            uint256[] memory amounts
        ) = _createPaymentArrays(mintPrice, parentAddress);

        NFTCollection newCollection = new NFTCollection(
            name,
            symbol,
            prompt,
            referenceImageUrl,
            maxSupply,
            msg.sender,
            address(this),
            parentAddress,
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
            createdAt: block.timestamp,
            parentId: parentId
        });

        payable(PLATFORM_WALLET).transfer(msg.value);
        newCollection.factoryMint(msg.sender);
        emit CollectionCreated(
            _collectionIds,
            address(newCollection),
            msg.sender,
            parentAddress
        );

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

    function getCollectionLineage(
        address collectionAddress
    ) public view returns (address[] memory lineage) {
        require(collectionAddress != address(0), "Invalid collection address");

        // First, count the lineage depth
        uint256 depth = 0;
        address current = collectionAddress;

        while (current != address(0)) {
            NFTCollection collection = NFTCollection(current);
            current = collection.parent();
            if (current != address(0)) {
                depth++;
            }
        }

        // Create the lineage array
        lineage = new address[](depth);
        current = collectionAddress;

        for (uint256 i = 0; i < depth; i++) {
            NFTCollection collection = NFTCollection(current);
            current = collection.parent();
            lineage[i] = current;
        }

        return lineage;
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
