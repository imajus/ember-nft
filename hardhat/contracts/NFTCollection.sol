// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTCollection is ERC721URIStorage, ReentrancyGuard, Ownable {
    uint256 private _tokenIds;
    uint256 public maxSupply;
    uint256 public mintPrice;
    string public prompt;
    address public creator;
    address public factory;
    uint256 public mintStartTime;
    uint256 public mintEndTime;

    address payable[] public payees;
    uint256[] public shares;
    uint256 public totalShares;

    mapping(uint256 => bool) private _tokenGenerated;

    event TokenMinted(
        uint256 indexed tokenId,
        address indexed minter,
        uint256 timestamp
    );
    event TokenURIUpdated(uint256 indexed tokenId, string newTokenURI);
    event PaymentDistributed(address indexed recipient, uint256 amount);

    constructor(
        string memory name,
        string memory symbol,
        string memory _prompt,
        uint256 _maxSupply,
        uint256 _mintPrice,
        address _creator,
        address _factory,
        address payable[] memory _payees,
        uint256[] memory _shares
    ) ERC721(name, symbol) Ownable(_creator) {
        require(
            _payees.length == _shares.length,
            "Payees and shares length mismatch"
        );
        require(_payees.length > 0, "Must have at least one payee");

        prompt = _prompt;
        maxSupply = _maxSupply;
        mintPrice = _mintPrice;
        creator = _creator;
        factory = _factory;
        mintStartTime = block.timestamp;
        mintEndTime = block.timestamp + 30 days;

        payees = _payees;
        shares = _shares;
        for (uint256 i = 0; i < _shares.length; i++) {
            totalShares += _shares[i];
        }
    }

    modifier onlyCreatorOrOwner() {
        require(
            msg.sender == creator || msg.sender == owner(),
            "Not authorized"
        );
        _;
    }

    modifier mintingAllowed() {
        require(block.timestamp >= mintStartTime, "Minting not started");
        require(block.timestamp <= mintEndTime, "Minting ended");
        require(_tokenIds < maxSupply, "Max supply reached");
        _;
    }

    function mint() external payable nonReentrant mintingAllowed {
        require(msg.value >= mintPrice, "Insufficient payment");

        // Distribute payments immediately
        for (uint256 i = 0; i < payees.length; i++) {
            uint256 payment = (msg.value * shares[i]) / totalShares;
            payable(payees[i]).transfer(payment);
            emit PaymentDistributed(payees[i], payment);
        }

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _mint(msg.sender, newTokenId);
        _tokenGenerated[newTokenId] = false;

        emit TokenMinted(newTokenId, msg.sender, block.timestamp);
    }

    function updateTokenURI(
        uint256 tokenId,
        string memory newTokenURI
    ) external {
        require(msg.sender == factory, "Only factory can update token URI");
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        _setTokenURI(tokenId, newTokenURI);
        _tokenGenerated[tokenId] = true;

        emit TokenURIUpdated(tokenId, newTokenURI);
    }

    function getTokenPrompt(
        uint256 tokenId
    ) external view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return prompt;
    }

    function getPrompt() external view returns (string memory) {
        return prompt;
    }

    function isTokenGenerated(uint256 tokenId) external view returns (bool) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _tokenGenerated[tokenId];
    }

    function getCurrentSupply() external view returns (uint256) {
        return _tokenIds;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }
}
