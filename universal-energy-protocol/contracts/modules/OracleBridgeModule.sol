// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title OracleBridgeModule for UniversalEnergyProtocol (UEP)
/// @notice Modular oracle/bridge reward & action trigger — cross-chain ready, fully auditable, DAO governance

interface IUniversalEnergyProtocol {
    function mint(address to, uint256 value, string calldata ref) external;
    function burn(address from, uint256 value, string calldata ref) external;
    function owner() external view returns (address);
    function daoGovernor() external view returns (address);
}

interface IOracle {
    function latestValue(bytes32 requestId) external view returns (uint256 value, uint256 timestamp, bool fulfilled);
}

contract OracleBridgeModule {
    IUniversalEnergyProtocol public immutable energyProtocol;
    address public owner;
    address public oracle; // Off-chain oracle or bridge contract
    uint256 public rewardPerEvent; // ENERGY reward for valid oracle event
    mapping(bytes32 => bool) public processed; // Prevent replay

    event OracleEventProcessed(
        address indexed user,
        bytes32 indexed requestId,
        uint256 oracleValue,
        uint256 reward,
        uint256 timestamp
    );
    event RewardChanged(uint256 oldReward, uint256 newReward);
    event OwnerChanged(address indexed oldOwner, address indexed newOwner);
    event OracleChanged(address indexed oldOracle, address indexed newOracle);

    modifier onlyOwnerOrDAO() {
        require(msg.sender == owner || msg.sender == energyProtocol.daoGovernor(), "Only owner or DAO");
        _;
    }

    constructor(address _energyProtocol, address _oracle, uint256 _rewardPerEvent) {
        energyProtocol = IUniversalEnergyProtocol(_energyProtocol);
        oracle = _oracle;
        owner = msg.sender;
        rewardPerEvent = _rewardPerEvent;
    }

    /// @notice Triggered by backend or oracle when an off-chain/on-chain event is validated
    function processOracleEvent(address user, bytes32 requestId) external {
        require(msg.sender == oracle, "Only oracle can process");
        require(!processed[requestId], "Event already processed");

        (uint256 value, uint256 timestamp, bool fulfilled) = IOracle(oracle).latestValue(requestId);
        require(fulfilled, "Oracle not fulfilled");
        require(user != address(0), "Zero address");

        // Example: reward for cross-chain bridge, proof-of-activity, or off-chain event
        energyProtocol.mint(user, rewardPerEvent, "Oracle/Bridge event reward");

        processed[requestId] = true;
        emit OracleEventProcessed(user, requestId, value, rewardPerEvent, timestamp);
    }

    // --- ADMIN FUNCTIONS ---
    function setReward(uint256 newReward) external onlyOwnerOrDAO {
        emit RewardChanged(rewardPerEvent, newReward);
        rewardPerEvent = newReward;
    }

    function setOracle(address newOracle) external onlyOwnerOrDAO {
        require(newOracle != address(0), "Zero address");
        emit OracleChanged(oracle, newOracle);
        oracle = newOracle;
    }

    function transferOwnership(address newOwner) external onlyOwnerOrDAO {
        require(newOwner != address(0), "Zero address");
        emit OwnerChanged(owner, newOwner);
        owner = newOwner;
    }

    // --- AUDIT & VIEW ---
    function isProcessed(bytes32 requestId) external view returns (bool) {
        return processed[requestId];
    }
}
