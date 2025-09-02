// Generated file - do not edit manually
const abis = {
  "NFTCollectionFactory": [
    {
      "type": "constructor",
      "payable": false,
      "inputs": []
    },
    {
      "type": "error",
      "name": "OwnableInvalidOwner",
      "inputs": [
        {
          "type": "address",
          "name": "owner"
        }
      ]
    },
    {
      "type": "error",
      "name": "OwnableUnauthorizedAccount",
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ]
    },
    {
      "type": "error",
      "name": "ReentrancyGuardReentrantCall",
      "inputs": []
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "CollectionCreated",
      "inputs": [
        {
          "type": "uint256",
          "name": "collectionId",
          "indexed": true
        },
        {
          "type": "address",
          "name": "contractAddress",
          "indexed": true
        },
        {
          "type": "address",
          "name": "creator",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "OwnershipTransferred",
      "inputs": [
        {
          "type": "address",
          "name": "previousOwner",
          "indexed": true
        },
        {
          "type": "address",
          "name": "newOwner",
          "indexed": true
        }
      ]
    },
    {
      "type": "function",
      "name": "PLATFORM_WALLET",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "address"
        }
      ]
    },
    {
      "type": "function",
      "name": "collectionInfo",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256"
        }
      ],
      "outputs": [
        {
          "type": "uint256",
          "name": "id"
        },
        {
          "type": "address",
          "name": "contractAddress"
        },
        {
          "type": "address",
          "name": "creator"
        },
        {
          "type": "string",
          "name": "name"
        },
        {
          "type": "string",
          "name": "symbol"
        },
        {
          "type": "string",
          "name": "prompt"
        },
        {
          "type": "uint256",
          "name": "maxSupply"
        },
        {
          "type": "uint256",
          "name": "mintPrice"
        },
        {
          "type": "uint256",
          "name": "createdAt"
        }
      ]
    },
    {
      "type": "function",
      "name": "collections",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256"
        }
      ],
      "outputs": [
        {
          "type": "address"
        }
      ]
    },
    {
      "type": "function",
      "name": "createCollection",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "string",
          "name": "name"
        },
        {
          "type": "string",
          "name": "symbol"
        },
        {
          "type": "string",
          "name": "prompt"
        },
        {
          "type": "uint256",
          "name": "maxSupply"
        },
        {
          "type": "uint256",
          "name": "mintPrice"
        }
      ],
      "outputs": [
        {
          "type": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "name": "creatorCollections",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address"
        },
        {
          "type": "uint256"
        }
      ],
      "outputs": [
        {
          "type": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "name": "getAllCollections",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "tuple[]",
          "components": [
            {
              "type": "uint256",
              "name": "id"
            },
            {
              "type": "address",
              "name": "contractAddress"
            },
            {
              "type": "address",
              "name": "creator"
            },
            {
              "type": "string",
              "name": "name"
            },
            {
              "type": "string",
              "name": "symbol"
            },
            {
              "type": "string",
              "name": "prompt"
            },
            {
              "type": "uint256",
              "name": "maxSupply"
            },
            {
              "type": "uint256",
              "name": "mintPrice"
            },
            {
              "type": "uint256",
              "name": "createdAt"
            }
          ]
        }
      ]
    },
    {
      "type": "function",
      "name": "getCollectionsByCreator",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "creator"
        }
      ],
      "outputs": [
        {
          "type": "uint256[]"
        }
      ]
    },
    {
      "type": "function",
      "name": "getTotalCollections",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "name": "owner",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "address"
        }
      ]
    },
    {
      "type": "function",
      "name": "platformFeePercent",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "name": "renounceOwnership",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "transferOwnership",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "newOwner"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "updateTokenURI",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "collectionAddress"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        },
        {
          "type": "string",
          "name": "newTokenURI"
        }
      ],
      "outputs": []
    }
  ],
  "NFTCollection": [
    {
      "type": "constructor",
      "payable": false,
      "inputs": [
        {
          "type": "string",
          "name": "name"
        },
        {
          "type": "string",
          "name": "symbol"
        },
        {
          "type": "string",
          "name": "_prompt"
        },
        {
          "type": "uint256",
          "name": "_maxSupply"
        },
        {
          "type": "uint256",
          "name": "_mintPrice"
        },
        {
          "type": "address",
          "name": "_creator"
        },
        {
          "type": "address",
          "name": "_factory"
        },
        {
          "type": "address[]",
          "name": "_payees"
        },
        {
          "type": "uint256[]",
          "name": "_shares"
        }
      ]
    },
    {
      "type": "error",
      "name": "ERC721IncorrectOwner",
      "inputs": [
        {
          "type": "address",
          "name": "sender"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        },
        {
          "type": "address",
          "name": "owner"
        }
      ]
    },
    {
      "type": "error",
      "name": "ERC721InsufficientApproval",
      "inputs": [
        {
          "type": "address",
          "name": "operator"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ]
    },
    {
      "type": "error",
      "name": "ERC721InvalidApprover",
      "inputs": [
        {
          "type": "address",
          "name": "approver"
        }
      ]
    },
    {
      "type": "error",
      "name": "ERC721InvalidOperator",
      "inputs": [
        {
          "type": "address",
          "name": "operator"
        }
      ]
    },
    {
      "type": "error",
      "name": "ERC721InvalidOwner",
      "inputs": [
        {
          "type": "address",
          "name": "owner"
        }
      ]
    },
    {
      "type": "error",
      "name": "ERC721InvalidReceiver",
      "inputs": [
        {
          "type": "address",
          "name": "receiver"
        }
      ]
    },
    {
      "type": "error",
      "name": "ERC721InvalidSender",
      "inputs": [
        {
          "type": "address",
          "name": "sender"
        }
      ]
    },
    {
      "type": "error",
      "name": "ERC721NonexistentToken",
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ]
    },
    {
      "type": "error",
      "name": "OwnableInvalidOwner",
      "inputs": [
        {
          "type": "address",
          "name": "owner"
        }
      ]
    },
    {
      "type": "error",
      "name": "OwnableUnauthorizedAccount",
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ]
    },
    {
      "type": "error",
      "name": "ReentrancyGuardReentrantCall",
      "inputs": []
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Approval",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "indexed": true
        },
        {
          "type": "address",
          "name": "approved",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "tokenId",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "ApprovalForAll",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "indexed": true
        },
        {
          "type": "address",
          "name": "operator",
          "indexed": true
        },
        {
          "type": "bool",
          "name": "approved",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "BatchMetadataUpdate",
      "inputs": [
        {
          "type": "uint256",
          "name": "_fromTokenId",
          "indexed": false
        },
        {
          "type": "uint256",
          "name": "_toTokenId",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "MetadataUpdate",
      "inputs": [
        {
          "type": "uint256",
          "name": "_tokenId",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "OwnershipTransferred",
      "inputs": [
        {
          "type": "address",
          "name": "previousOwner",
          "indexed": true
        },
        {
          "type": "address",
          "name": "newOwner",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "PaymentDistributed",
      "inputs": [
        {
          "type": "address",
          "name": "recipient",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "amount",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "TokenMinted",
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId",
          "indexed": true
        },
        {
          "type": "address",
          "name": "minter",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "timestamp",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "TokenURIUpdated",
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId",
          "indexed": true
        },
        {
          "type": "string",
          "name": "newTokenURI",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Transfer",
      "inputs": [
        {
          "type": "address",
          "name": "from",
          "indexed": true
        },
        {
          "type": "address",
          "name": "to",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "tokenId",
          "indexed": true
        }
      ]
    },
    {
      "type": "function",
      "name": "approve",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "balanceOf",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "owner"
        }
      ],
      "outputs": [
        {
          "type": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "name": "creator",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "address"
        }
      ]
    },
    {
      "type": "function",
      "name": "factory",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "address"
        }
      ]
    },
    {
      "type": "function",
      "name": "getApproved",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": [
        {
          "type": "address"
        }
      ]
    },
    {
      "type": "function",
      "name": "getCurrentSupply",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "name": "getPrompt",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "string"
        }
      ]
    },
    {
      "type": "function",
      "name": "getTokenPrompt",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": [
        {
          "type": "string"
        }
      ]
    },
    {
      "type": "function",
      "name": "isApprovedForAll",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "owner"
        },
        {
          "type": "address",
          "name": "operator"
        }
      ],
      "outputs": [
        {
          "type": "bool"
        }
      ]
    },
    {
      "type": "function",
      "name": "isTokenGenerated",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": [
        {
          "type": "bool"
        }
      ]
    },
    {
      "type": "function",
      "name": "maxSupply",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "name": "mint",
      "constant": false,
      "stateMutability": "payable",
      "payable": true,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "mintEndTime",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "name": "mintPrice",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "name": "mintStartTime",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "name": "name",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "string"
        }
      ]
    },
    {
      "type": "function",
      "name": "owner",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "address"
        }
      ]
    },
    {
      "type": "function",
      "name": "ownerOf",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": [
        {
          "type": "address"
        }
      ]
    },
    {
      "type": "function",
      "name": "payees",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256"
        }
      ],
      "outputs": [
        {
          "type": "address"
        }
      ]
    },
    {
      "type": "function",
      "name": "prompt",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "string"
        }
      ]
    },
    {
      "type": "function",
      "name": "renounceOwnership",
      "constant": false,
      "payable": false,
      "inputs": [],
      "outputs": []
    },
    {
      "type": "function",
      "name": "safeTransferFrom",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "from"
        },
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "safeTransferFrom",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "from"
        },
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        },
        {
          "type": "bytes",
          "name": "data"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "setApprovalForAll",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "operator"
        },
        {
          "type": "bool",
          "name": "approved"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "shares",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256"
        }
      ],
      "outputs": [
        {
          "type": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "name": "supportsInterface",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "bytes4",
          "name": "interfaceId"
        }
      ],
      "outputs": [
        {
          "type": "bool"
        }
      ]
    },
    {
      "type": "function",
      "name": "symbol",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "string"
        }
      ]
    },
    {
      "type": "function",
      "name": "tokenURI",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": [
        {
          "type": "string"
        }
      ]
    },
    {
      "type": "function",
      "name": "totalShares",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "name": "transferFrom",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "from"
        },
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "transferOwnership",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "newOwner"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "updateTokenURI",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        },
        {
          "type": "string",
          "name": "newTokenURI"
        }
      ],
      "outputs": []
    }
  ],
  "NFTMarketplace": [
    {
      "type": "constructor",
      "payable": false,
      "inputs": []
    },
    {
      "type": "error",
      "name": "ERC721IncorrectOwner",
      "inputs": [
        {
          "type": "address",
          "name": "sender"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        },
        {
          "type": "address",
          "name": "owner"
        }
      ]
    },
    {
      "type": "error",
      "name": "ERC721InsufficientApproval",
      "inputs": [
        {
          "type": "address",
          "name": "operator"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ]
    },
    {
      "type": "error",
      "name": "ERC721InvalidApprover",
      "inputs": [
        {
          "type": "address",
          "name": "approver"
        }
      ]
    },
    {
      "type": "error",
      "name": "ERC721InvalidOperator",
      "inputs": [
        {
          "type": "address",
          "name": "operator"
        }
      ]
    },
    {
      "type": "error",
      "name": "ERC721InvalidOwner",
      "inputs": [
        {
          "type": "address",
          "name": "owner"
        }
      ]
    },
    {
      "type": "error",
      "name": "ERC721InvalidReceiver",
      "inputs": [
        {
          "type": "address",
          "name": "receiver"
        }
      ]
    },
    {
      "type": "error",
      "name": "ERC721InvalidSender",
      "inputs": [
        {
          "type": "address",
          "name": "sender"
        }
      ]
    },
    {
      "type": "error",
      "name": "ERC721NonexistentToken",
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Approval",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "indexed": true
        },
        {
          "type": "address",
          "name": "approved",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "tokenId",
          "indexed": true
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "ApprovalForAll",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "indexed": true
        },
        {
          "type": "address",
          "name": "operator",
          "indexed": true
        },
        {
          "type": "bool",
          "name": "approved",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "BatchMetadataUpdate",
      "inputs": [
        {
          "type": "uint256",
          "name": "_fromTokenId",
          "indexed": false
        },
        {
          "type": "uint256",
          "name": "_toTokenId",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "MarketItemCreated",
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId",
          "indexed": true
        },
        {
          "type": "address",
          "name": "seller",
          "indexed": false
        },
        {
          "type": "address",
          "name": "owner",
          "indexed": false
        },
        {
          "type": "uint256",
          "name": "price",
          "indexed": false
        },
        {
          "type": "bool",
          "name": "sold",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "MetadataUpdate",
      "inputs": [
        {
          "type": "uint256",
          "name": "_tokenId",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "Transfer",
      "inputs": [
        {
          "type": "address",
          "name": "from",
          "indexed": true
        },
        {
          "type": "address",
          "name": "to",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "tokenId",
          "indexed": true
        }
      ]
    },
    {
      "type": "function",
      "name": "approve",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "balanceOf",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "owner"
        }
      ],
      "outputs": [
        {
          "type": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "name": "createMarketSale",
      "constant": false,
      "stateMutability": "payable",
      "payable": true,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "createToken",
      "constant": false,
      "stateMutability": "payable",
      "payable": true,
      "inputs": [
        {
          "type": "string",
          "name": "tokenURI"
        },
        {
          "type": "uint256",
          "name": "price"
        }
      ],
      "outputs": [
        {
          "type": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "name": "fetchItemsListed",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "tuple[]",
          "components": [
            {
              "type": "uint256",
              "name": "tokenId"
            },
            {
              "type": "address",
              "name": "seller"
            },
            {
              "type": "address",
              "name": "owner"
            },
            {
              "type": "uint256",
              "name": "price"
            },
            {
              "type": "bool",
              "name": "sold"
            }
          ]
        }
      ]
    },
    {
      "type": "function",
      "name": "fetchMarketItems",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "tuple[]",
          "components": [
            {
              "type": "uint256",
              "name": "tokenId"
            },
            {
              "type": "address",
              "name": "seller"
            },
            {
              "type": "address",
              "name": "owner"
            },
            {
              "type": "uint256",
              "name": "price"
            },
            {
              "type": "bool",
              "name": "sold"
            }
          ]
        }
      ]
    },
    {
      "type": "function",
      "name": "fetchMyNFTs",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "tuple[]",
          "components": [
            {
              "type": "uint256",
              "name": "tokenId"
            },
            {
              "type": "address",
              "name": "seller"
            },
            {
              "type": "address",
              "name": "owner"
            },
            {
              "type": "uint256",
              "name": "price"
            },
            {
              "type": "bool",
              "name": "sold"
            }
          ]
        }
      ]
    },
    {
      "type": "function",
      "name": "getApproved",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": [
        {
          "type": "address"
        }
      ]
    },
    {
      "type": "function",
      "name": "getListingPrice",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "name": "isApprovedForAll",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "owner"
        },
        {
          "type": "address",
          "name": "operator"
        }
      ],
      "outputs": [
        {
          "type": "bool"
        }
      ]
    },
    {
      "type": "function",
      "name": "name",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "string"
        }
      ]
    },
    {
      "type": "function",
      "name": "ownerOf",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": [
        {
          "type": "address"
        }
      ]
    },
    {
      "type": "function",
      "name": "resellToken",
      "constant": false,
      "stateMutability": "payable",
      "payable": true,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        },
        {
          "type": "uint256",
          "name": "price"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "safeTransferFrom",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "from"
        },
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "safeTransferFrom",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "from"
        },
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        },
        {
          "type": "bytes",
          "name": "data"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "setApprovalForAll",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "operator"
        },
        {
          "type": "bool",
          "name": "approved"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "supportsInterface",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "bytes4",
          "name": "interfaceId"
        }
      ],
      "outputs": [
        {
          "type": "bool"
        }
      ]
    },
    {
      "type": "function",
      "name": "symbol",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "string"
        }
      ]
    },
    {
      "type": "function",
      "name": "tokenURI",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": [
        {
          "type": "string"
        }
      ]
    },
    {
      "type": "function",
      "name": "transferFrom",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "from"
        },
        {
          "type": "address",
          "name": "to"
        },
        {
          "type": "uint256",
          "name": "tokenId"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "updateListingPrice",
      "constant": false,
      "stateMutability": "payable",
      "payable": true,
      "inputs": [
        {
          "type": "uint256",
          "name": "_listingPrice"
        }
      ],
      "outputs": []
    }
  ],
  "SimplePaymentSplitter": [
    {
      "type": "constructor",
      "payable": false,
      "inputs": [
        {
          "type": "address[]",
          "name": "payees"
        },
        {
          "type": "uint256[]",
          "name": "shares_"
        }
      ]
    },
    {
      "type": "error",
      "name": "FailedCall",
      "inputs": []
    },
    {
      "type": "error",
      "name": "InsufficientBalance",
      "inputs": [
        {
          "type": "uint256",
          "name": "balance"
        },
        {
          "type": "uint256",
          "name": "needed"
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "PaymentReceived",
      "inputs": [
        {
          "type": "address",
          "name": "from",
          "indexed": false
        },
        {
          "type": "uint256",
          "name": "amount",
          "indexed": false
        }
      ]
    },
    {
      "type": "event",
      "anonymous": false,
      "name": "PaymentReleased",
      "inputs": [
        {
          "type": "address",
          "name": "to",
          "indexed": false
        },
        {
          "type": "uint256",
          "name": "amount",
          "indexed": false
        }
      ]
    },
    {
      "type": "function",
      "name": "releasable",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "name": "release",
      "constant": false,
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": []
    },
    {
      "type": "function",
      "name": "released",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "name": "shares",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [
        {
          "type": "address",
          "name": "account"
        }
      ],
      "outputs": [
        {
          "type": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "name": "totalReleased",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "name": "totalShares",
      "constant": true,
      "stateMutability": "view",
      "payable": false,
      "inputs": [],
      "outputs": [
        {
          "type": "uint256"
        }
      ]
    }
  ]
};

const deployments = {
  "31337": {
    "NFTCollectionFactoryModule#NFTCollectionFactory": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
  },
  "50312": {
    "NFTCollectionFactoryModule#NFTCollectionFactory": "0x647ae194d4a2536aF93464f718906aDf43910A95"
  }
};

export function getDeployments(chainId) {
  const addresses = deployments[chainId] || {};
  return {
    NFTCollectionFactory: {
      abi: abis.NFTCollectionFactory,
      address: addresses['NFTCollectionFactoryModule#NFTCollectionFactory'] || null,
      name: 'NFTCollectionFactory',
      description: 'Factory contract for creating NFT collections',
    },
    NFTCollection: {
      abi: abis.NFTCollection,
      address: null, // Individual collection addresses are dynamic
      name: 'NFTCollection',
      description: 'Individual NFT collection contract',
    },
    NFTMarketplace: {
      abi: abis.NFTMarketplace,
      address: addresses['NFTMarketplaceModule#NFTMarketplace'] || null,
      name: 'NFTMarketplace',
      description: 'NFT marketplace contract',
    },
    SimplePaymentSplitter: {
      abi: abis.SimplePaymentSplitter,
      address: null, // Individual splitter addresses are dynamic
      name: 'SimplePaymentSplitter',
      description: 'Payment splitter contract for revenue sharing',
    },
  };
}

export { abis };
