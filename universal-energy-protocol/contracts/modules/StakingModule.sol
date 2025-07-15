// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title StakingModule for UniversalEnergyProtocol (UEP)
/// @notice Modular, upgradable, DAO-managed staking for energy minting & platform reputation

interface IUniversalEnergyProtocol {
    function mint(address to, uint256 value, string calldata ref) external;
    function burn(address from, uint256 value, string calldata ref) external;
    function owner() external view returns (address);
    function daoGovernor() external view returns (address);
}

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

contract StakingModule {
    IERC20 public immutable stakingToken;
    IUniversalEnergyProtocol public immutable energyProtocol;
    address public owner;
    uint256 public rewardRate; // ENERGY per block
    uint256 public minStakePeriod; // Minimum blocks to avoid penalty

    struct StakeInfo {
        uint256 amount;
        uint256 startBlock;
        uint256 lastClaimBlock;
    }

    mapping(address => StakeInfo) public stakes;
    mapping(address => uint256) public claimedRewards;

    event Staked(address indexed user, uint256 amount, uint256 startBlock);
    event Unstaked(address indexed user, uint256 amount, uint256 endBlock, uint256 reward, uint256 penalty);
    event Claimed(address indexed user, uint256 reward, uint256 toBlock);
    event OwnerChanged(address indexed oldOwner, address indexed newOwner);
    event ParametersUpdated(uint256 rewardRate, uint256 minStakePeriod);

    modifier onlyOwnerOrDAO() {
        require(msg.sender == owner || msg.sender == energyProtocol.daoGovernor(), "Only owner or DAO");
        _;
    }

    constructor(address _stakingToken, address _energyProtocol, uint256 _rewardRate, uint256 _minStakePeriod) {
        stakingToken = IERC20(_stakingToken);
        energyProtocol = IUniversalEnergyProtocol(_energyProtocol);
        owner = msg.sender;
        rewardRate = _rewardRate;
        minStakePeriod = _minStakePeriod;
    }

    /// @notice Stake stakingToken for ENERGY rewards
    function stake(uint256 amount) external {
        require(amount > 0, "Zero amount");
        require(stakes[msg.sender].amount == 0, "Already staked, must unstake first");
        stakingToken.transferFrom(msg.sender, address(this), amount);
        stakes[msg.sender] = StakeInfo({
            amount: amount,
            startBlock: block.number,
            lastClaimBlock: block.number
        });
        emit Staked(msg.sender, amount, block.number);
    }

    /// @notice Unstake and claim rewards; early unstake gets penalty
    function unstake() external {
        StakeInfo storage info = stakes[msg.sender];
        require(info.amount > 0, "No stake");
        uint256 stakedBlocks = block.number - info.startBlock;
        uint256 reward = stakedBlocks * rewardRate * info.amount / 1e18;
        uint256 penalty = 0;
        if (stakedBlocks < minStakePeriod) {
            penalty = reward / 2; // 50% penalty if unstake early
            reward = reward / 2;
        }
        stakingToken.transfer(msg.sender, info.amount);
        delete stakes[msg.sender];

        if (reward > 0) {
            energyProtocol.mint(msg.sender, reward, "Stake reward");
            claimedRewards[msg.sender] += reward;
        }
        emit Unstaked(msg.sender, info.amount, block.number, reward, penalty);
    }

    /// @notice Claim ENERGY rewards without unstaking
    function claimReward() external {
        StakeInfo storage info = stakes[msg.sender];
        require(info.amount > 0, "No stake");
        uint256 stakedBlocks = block.number - info.lastClaimBlock;
        require(stakedBlocks > 0, "Already claimed");
        uint256 reward = stakedBlocks * rewardRate * info.amount / 1e18;
        info.lastClaimBlock = block.number;

        if (reward > 0) {
            energyProtocol.mint(msg.sender, reward, "Stake reward (claim)");
            claimedRewards[msg.sender] += reward;
            emit Claimed(msg.sender, reward, block.number);
        }
    }

    // --- DAO/Owner can update reward parameters ---
    function setRewardRate(uint256 newRate) external onlyOwnerOrDAO {
        rewardRate = newRate;
        emit ParametersUpdated(newRate, minStakePeriod);
    }

    function setMinStakePeriod(uint256 newPeriod) external onlyOwnerOrDAO {
        minStakePeriod = newPeriod;
        emit ParametersUpdated(rewardRate, newPeriod);
    }

    function transferOwnership(address newOwner) external onlyOwnerOrDAO {
        require(newOwner != address(0), "Zero address");
        emit OwnerChanged(owner, newOwner);
        owner = newOwner;
    }

    /// @notice Owner/DAO can rescue tokens sent by mistake
    function rescueTokens(address token, address to, uint256 amount) external onlyOwnerOrDAO {
        IERC20(token).transfer(to, amount);
    }
}
