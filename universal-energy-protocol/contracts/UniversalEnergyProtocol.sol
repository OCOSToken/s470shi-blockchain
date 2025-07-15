// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title UniversalEnergyProtocol (UEP)
/// @author Ocos DAO
/// @notice Modular, auditable, reputation-based energy protocol for next-gen DAOs & platforms

interface IModule {
    function onEnergyMint(address user, uint256 amount, string calldata ref) external;
    function onEnergyBurn(address user, uint256 amount, string calldata ref) external;
}

contract UniversalEnergyProtocol {
    // --- ERC-20 COMPATIBLE ---
    string public constant name = "Universal Energy";
    string public constant symbol = "UEP";
    uint8 public constant decimals = 18;
    uint256 public totalSupply;

    // --- CORE ROLES ---
    address public owner;
    address public daoGovernor;

    // --- USER STATE ---
    mapping(address => uint256) public balanceOf;
    mapping(address => uint256) public reputation;
    mapping(address => uint256) public lastActivity;

    // --- MODULES & PERMISSIONS ---
    mapping(address => bool) public authorizedModule;
    IModule[] public modules;

    // --- EVENTS ---
    event Transfer(address indexed from, address indexed to, uint256 value);
    event EnergyMinted(address indexed to, uint256 value, string ref, address indexed triggeredBy);
    event EnergyBurned(address indexed from, uint256 value, string ref, address indexed triggeredBy);
    event ReputationIncreased(address indexed user, uint256 delta, string ref);
    event ReputationDecreased(address indexed user, uint256 delta, string ref);
    event ModuleAdded(address indexed module, address indexed by);
    event ModuleRemoved(address indexed module, address indexed by);
    event DaoGovernorChanged(address indexed oldDao, address indexed newDao);
    event OwnerChanged(address indexed oldOwner, address indexed newOwner);

    // --- MODIFIERS ---
    modifier onlyOwner() { require(msg.sender == owner, "Only owner"); _; }
    modifier onlyDAO() { require(msg.sender == daoGovernor, "Only DAO"); _; }
    modifier onlyModule() { require(authorizedModule[msg.sender], "Not authorized module"); _; }

    // --- CONSTRUCTOR ---
    constructor() {
        owner = msg.sender;
        daoGovernor = msg.sender;
    }

    // --- ENERGY MINT ---
    /// @notice Mint energy for user (only authorized modules, with event and reputation gain)
    function mint(address to, uint256 value, string calldata ref) external onlyModule {
        require(to != address(0), "Zero address");
        require(value > 0, "Zero value");
        totalSupply += value;
        balanceOf[to] += value;
        lastActivity[to] = block.timestamp;
        emit EnergyMinted(to, value, ref, msg.sender);
        emit Transfer(address(0), to, value);
        _increaseReputation(to, value / 100, ref); // Example: +1% of minted energy as reputation
        _moduleCallback_onMint(to, value, ref);
    }

    // --- ENERGY BURN ---
    /// @notice Burn energy from user (only authorized modules, with event and reputation update)
    function burn(address from, uint256 value, string calldata ref) external onlyModule {
        require(from != address(0), "Zero address");
        require(balanceOf[from] >= value && value > 0, "Not enough energy");
        balanceOf[from] -= value;
        totalSupply -= value;
        lastActivity[from] = block.timestamp;
        emit EnergyBurned(from, value, ref, msg.sender);
        emit Transfer(from, address(0), value);
        _decreaseReputation(from, value / 200, ref); // Example: -0.5% burn penalty
        _moduleCallback_onBurn(from, value, ref);
    }

    // --- ENERGY TRANSFER (ERC-20 compatible) ---
    function transfer(address to, uint256 value) external returns (bool) {
        require(to != address(0), "Zero address");
        require(balanceOf[msg.sender] >= value, "Not enough energy");
        balanceOf[msg.sender] -= value;
        balanceOf[to] += value;
        lastActivity[msg.sender] = block.timestamp;
        lastActivity[to] = block.timestamp;
        emit Transfer(msg.sender, to, value);
        return true;
    }

    // --- DAO GOVERNANCE: MODULE MANAGEMENT ---
    function addModule(address module) external onlyDAO {
        require(module != address(0), "Zero address");
        require(!authorizedModule[module], "Already authorized");
        authorizedModule[module] = true;
        modules.push(IModule(module));
        emit ModuleAdded(module, msg.sender);
    }

    function removeModule(address module) external onlyDAO {
        require(authorizedModule[module], "Not found");
        authorizedModule[module] = false;
        emit ModuleRemoved(module, msg.sender);
    }

    // --- DAO GOVERNANCE: DAO/OWNER TRANSFER ---
    function setDaoGovernor(address newDao) external onlyOwner {
        require(newDao != address(0), "Zero address");
        emit DaoGovernorChanged(daoGovernor, newDao);
        daoGovernor = newDao;
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        emit OwnerChanged(owner, newOwner);
        owner = newOwner;
    }

    // --- REPUTATION SYSTEM ---
    function _increaseReputation(address user, uint256 delta, string memory ref) internal {
        if (delta > 0) {
            reputation[user] += delta;
            emit ReputationIncreased(user, delta, ref);
        }
    }

    function _decreaseReputation(address user, uint256 delta, string memory ref) internal {
        if (delta > 0) {
            if (reputation[user] >= delta) {
                reputation[user] -= delta;
            } else {
                reputation[user] = 0;
            }
            emit ReputationDecreased(user, delta, ref);
        }
    }

    // --- MODULE CALLBACKS (for on-chain triggers to all modules) ---
    function _moduleCallback_onMint(address user, uint256 value, string memory ref) internal {
        for (uint i = 0; i < modules.length; i++) {
            if (address(modules[i]) != address(0)) {
                modules[i].onEnergyMint(user, value, ref);
            }
        }
    }

    function _moduleCallback_onBurn(address user, uint256 value, string memory ref) internal {
        for (uint i = 0; i < modules.length; i++) {
            if (address(modules[i]) != address(0)) {
                modules[i].onEnergyBurn(user, value, ref);
            }
        }
    }

    // --- DASHBOARD: USER INFO VIEW ---
    function userInfo(address user) external view returns (
        uint256 energy, uint256 rep, uint256 lastActive
    ) {
        return (balanceOf[user], reputation[user], lastActivity[user]);
    }
}
