// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract NFTCollection is ERC721URIStorage, ReentrancyGuard, Ownable {
    uint256 private _tokenIds;
    uint256 public maxSupply;
    uint256 public mintPrice;
    string private _baseTokenURI;
    string public prompt;
    address public creator;
    address public factory;
    bool public mintingEnabled = true;
    uint256 public mintStartTime;
    uint256 public mintEndTime;

    address payable[] public payees;
    uint256[] public shares;
    uint256 public totalShares;
    mapping(address => uint256) public released;
    uint256 public totalReleased;

    mapping(uint256 => bool) private _tokenGenerated;
    mapping(uint256 => string) private _tokenPrompts;

    event TokenMinted(
        uint256 indexed tokenId,
        address indexed minter,
        string prompt,
        uint256 timestamp
    );
    event GenerationRequested(
        uint256 indexed tokenId,
        string prompt,
        address requester
    );
    event TokenURIUpdated(uint256 indexed tokenId, string newTokenURI);
    event MintingStatusUpdated(bool enabled);
    event PaymentReceived(address from, uint256 amount);
    event PaymentReleased(address to, uint256 amount);

    constructor(
        string memory name,
        string memory symbol,
        string memory _prompt,
        string memory baseTokenURI,
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

        _baseTokenURI = baseTokenURI;
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
        require(mintingEnabled, "Minting is disabled");
        require(block.timestamp >= mintStartTime, "Minting not started");
        require(block.timestamp <= mintEndTime, "Minting ended");
        require(_tokenIds < maxSupply, "Max supply reached");
        _;
    }

    function mint(
        string memory prompt
    ) external payable nonReentrant mintingAllowed {
        require(msg.value >= mintPrice, "Insufficient payment");
        require(bytes(prompt).length > 0, "Prompt cannot be empty");

        _tokenIds++;
        uint256 newTokenId = _tokenIds;

        _mint(msg.sender, newTokenId);
        _tokenPrompts[newTokenId] = prompt;
        _tokenGenerated[newTokenId] = false;

        emit TokenMinted(newTokenId, msg.sender, prompt, block.timestamp);
        emit GenerationRequested(newTokenId, prompt, msg.sender);
    }

    function updateTokenURI(
        uint256 tokenId,
        string memory newTokenURI
    ) external {
        require(
            msg.sender == factory || msg.sender == owner(),
            "Not authorized to update URI"
        );
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        _setTokenURI(tokenId, newTokenURI);
        _tokenGenerated[tokenId] = true;

        emit TokenURIUpdated(tokenId, newTokenURI);
    }

    function setMintingEnabled(bool enabled) external onlyCreatorOrOwner {
        mintingEnabled = enabled;
        emit MintingStatusUpdated(enabled);
    }

    function getTokenPrompt(
        uint256 tokenId
    ) external view returns (string memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return _tokenPrompts[tokenId];
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

    function release(address payable account) public {
        require(
            msg.sender == account || msg.sender == owner(),
            "Not authorized"
        );
        uint256 payment = releasable(account);
        require(payment != 0, "Account is not due payment");

        released[account] += payment;
        totalReleased += payment;

        Address.sendValue(account, payment);
        emit PaymentReleased(account, payment);
    }

    function releasable(address account) public view returns (uint256) {
        uint256 totalReceived = address(this).balance + totalReleased;
        uint256 accountShares = 0;

        for (uint256 i = 0; i < payees.length; i++) {
            if (payees[i] == account) {
                accountShares = shares[i];
                break;
            }
        }

        if (accountShares == 0) return 0;

        return
            (totalReceived * accountShares) / totalShares - released[account];
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory newBaseURI) external onlyCreatorOrOwner {
        _baseTokenURI = newBaseURI;
    }

    receive() external payable {
        emit PaymentReceived(msg.sender, msg.value);
    }
}
