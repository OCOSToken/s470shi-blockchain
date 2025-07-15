// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title NftUnlockModule for UniversalEnergyProtocol (UEP)
/// @notice Modular NFT unlock/access system using on-chain ENERGY — audit, governance and anti-abuse ready

interface IUniversalEnergyProtocol {
    function burn(address from, uint256 value, string calldata ref) external;
    function balanceOf(address user) external view returns (uint256);
    function owner() external view returns (address);
    function daoGovernor() external view returns (address);
}

interface IERC721 {
    function mint(address to, uint256 tokenId) external;
    function ownerOf(uint256 tokenId) external view returns (address);
    function exists(uint256 tokenId) external view returns (bool);
}

contract NftUnlockModule {
    IUniversalEnergyProtocol public immutable energyProtocol;
    IERC721 public immutable nftContract;
    address public owner;
    uint256 public unlockPrice; // ENERGY required to unlock NFT
    uint256 public nextTokenId;

    mapping(address => uint256[]) public unlockedTokens;
    mapping(uint256 => address) public unlockedBy;

    event NftUnlocked(address indexed user, uint256 indexed tokenId, uint256 energySpent, uint256 timestamp);
    event UnlockPriceChanged(uint256 oldPrice, uint256 newPrice);
    event OwnerChanged(address indexed oldOwner, address indexed newOwner);

    modifier onlyOwnerOrDAO() {
        require(msg.sender == owner || msg.sender == energyProtocol.daoGovernor(), "Only owner or DAO");
        _;
    }

    constructor(address _energyProtocol, address _nftContract, uint256 _unlockPrice, uint256 _firstTokenId) {
        energyProtocol = IUniversalEnergyProtocol(_energyProtocol);
        nftContract = IERC721(_nftContract);
        owner = msg.sender;
        unlockPrice = _unlockPrice;
        nextTokenId = _firstTokenId;
    }

    /// @notice User burns ENERGY to unlock/mint an NFT
    function unlockNft() external {
        require(energyProtocol.balanceOf(msg.sender) >= unlockPrice, "Not enough ENERGY");
        uint256 tokenId = nextTokenId;
        require(!_isUnlocked(tokenId), "Already unlocked");

        // Burn ENERGY as payment
        energyProtocol.burn(msg.sender, unlockPrice, "NFT unlock");

        // Mint NFT to user
        nftContract.mint(msg.sender, tokenId);

        unlockedTokens[msg.sender].push(tokenId);
        unlockedBy[tokenId] = msg.sender;
        emit NftUnlocked(msg.sender, tokenId, unlockPrice, block.timestamp);

        nextTokenId += 1;
    }

    /// @notice Admin/DAO can change unlock price
    function setUnlockPrice(uint256 newPrice) external onlyOwnerOrDAO {
        emit UnlockPriceChanged(unlockPrice, newPrice);
        unlockPrice = newPrice;
    }

    function transferOwnership(address newOwner) external onlyOwnerOrDAO {
        require(newOwner != address(0), "Zero address");
        emit OwnerChanged(owner, newOwner);
        owner = newOwner;
    }

    // --- View helpers ---
    function isUnlocked(uint256 tokenId) external view returns (bool) {
        return _isUnlocked(tokenId);
    }

    function getUnlockedTokens(address user) external view returns (uint256[] memory) {
        return unlockedTokens[user];
    }

    function getUnlocker(uint256 tokenId) external view returns (address) {
        return unlockedBy[tokenId];
    }

    // --- Internal ---
    function _isUnlocked(uint256 tokenId) internal view returns (bool) {
        return unlockedBy[tokenId] != address(0);
    }
}
