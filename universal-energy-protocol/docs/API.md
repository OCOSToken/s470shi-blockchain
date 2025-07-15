
# Universal Energy Protocol — Smart Contract API

**All contracts and modules here are 100% designed for DAO-managed integration, on-chain audits, and third-party developer composability.**

---

## Core: UniversalEnergyProtocol.sol

### ERC-20 Standard (partial)

| Function                 | Type      | Description                                             |
|--------------------------|-----------|---------------------------------------------------------|
| `name()`                 | view      | Returns token name (`"Universal Energy"`)               |
| `symbol()`               | view      | Returns token symbol (`"UEP"`)                          |
| `decimals()`             | view      | Returns decimals (`18`)                                 |
| `totalSupply()`          | view      | Returns total ENERGY supply                             |
| `balanceOf(address)`     | view      | Returns ENERGY balance of user                          |
| `transfer(address,uint)` | external  | Transfer ENERGY (ERC-20 style, between users)           |

### DAO / Governance

| Function                       | Type     | Description                                      |
|---------------------------------|----------|--------------------------------------------------|
| `owner()`                      | view     | Owner address                                    |
| `daoGovernor()`                | view     | DAO/multisig controller address                  |
| `addModule(address)`           | external | DAO: Add new module contract                     |
| `removeModule(address)`        | external | DAO: Remove module                               |
| `setDaoGovernor(address)`      | external | Owner: Set new DAO governor                      |
| `transferOwnership(address)`   | external | Owner: Transfer ownership                        |

### ENERGY Mint / Burn (Modules Only)

| Function                                         | Type     | Description                             |
|--------------------------------------------------|----------|-----------------------------------------|
| `mint(address,uint,string)`                      | external | Mint ENERGY to user (only by module)    |
| `burn(address,uint,string)`                      | external | Burn ENERGY from user (only by module)  |

### Reputation / User Data

| Function                          | Type     | Description                                 |
|------------------------------------|----------|---------------------------------------------|
| `reputation(address)`              | view     | User’s reputation score                     |
| `lastActivity(address)`            | view     | Last activity timestamp for user            |
| `userInfo(address)`                | view     | (energy, reputation, lastActivity) tuple    |

### Events

- `Transfer(address from, address to, uint256 value)`
- `EnergyMinted(address to, uint256 value, string ref, address triggeredBy)`
- `EnergyBurned(address from, uint256 value, string ref, address triggeredBy)`
- `ReputationIncreased(address user, uint256 delta, string ref)`
- `ReputationDecreased(address user, uint256 delta, string ref)`
- `ModuleAdded(address module, address by)`
- `ModuleRemoved(address module, address by)`

---

## Module: StakingModule.sol

| Function                                | Type     | Description                                          |
|------------------------------------------|----------|------------------------------------------------------|
| `stake(uint)`                            | external | Stake ERC-20 tokens (token set at deploy)            |
| `unstake()`                              | external | Unstake, claim ENERGY reward, and withdraw tokens    |
| `claimReward()`                          | external | Claim ENERGY reward without unstaking                |
| `setRewardRate(uint)`                    | external | DAO/owner: set reward per block                      |
| `setMinStakePeriod(uint)`                | external | DAO/owner: set min required stake period (in blocks) |
| `rescueTokens(address,uint)`             | external | DAO/owner: rescue stuck tokens                       |

**Events:**  
- `Staked(address user, uint amount, uint startBlock)`
- `Unstaked(address user, uint amount, uint endBlock, uint reward, uint penalty)`
- `Claimed(address user, uint reward, uint blockNumber)`
- `ParametersUpdated(uint rewardRate, uint minStakePeriod)`

---

## Module: NftUnlockModule.sol

| Function                            | Type     | Description                                    |
|--------------------------------------|----------|------------------------------------------------|
| `unlockNft()`                        | external | Burn ENERGY and mint/unlock NFT                |
| `setUnlockPrice(uint)`               | external | DAO/owner: Set new unlock price                |
| `isUnlocked(uint tokenId)`           | view     | Checks if tokenId has been unlocked            |
| `getUnlockedTokens(address)`         | view     | List of tokenIds unlocked by user              |
| `getUnlocker(uint tokenId)`          | view     | Address that unlocked given tokenId            |
| `transferOwnership(address)`         | external | DAO/owner: transfer module ownership           |

**Events:**  
- `NftUnlocked(address user, uint tokenId, uint energySpent, uint timestamp)`
- `UnlockPriceChanged(uint oldPrice, uint newPrice)`

---

## Module: OracleBridgeModule.sol

| Function                               | Type     | Description                                           |
|-----------------------------------------|----------|-------------------------------------------------------|
| `processOracleEvent(address,bytes32)`   | external | Oracle/bridge calls to mint ENERGY to user            |
| `setReward(uint)`                       | external | DAO/owner: set oracle event reward amount             |
| `setOracle(address)`                    | external | DAO/owner: set trusted oracle contract address        |
| `isProcessed(bytes32)`                  | view     | Returns true if requestId is already processed        |
| `transferOwnership(address)`            | external | DAO/owner: transfer module ownership                  |

**Events:**  
- `OracleEventProcessed(address user, bytes32 requestId, uint oracleValue, uint reward, uint timestamp)`
- `RewardChanged(uint oldReward, uint newReward)`
- `OracleChanged(address oldOracle, address newOracle)`

---

## IModule Interface

All modules must implement:

```solidity
function onEnergyMint(address user, uint256 amount, string calldata ref) external;
function onEnergyBurn(address user, uint256 amount, string calldata ref) external;
```

---

## Example: Full User Flow

1. User stakes tokens (`StakingModule.stake()`), earns ENERGY via block rewards.
2. User burns ENERGY to unlock NFT (`NftUnlockModule.unlockNft()`).
3. Oracle or bridge triggers an ENERGY reward for off-chain activity (`OracleBridgeModule.processOracleEvent()`).
4. DAO updates reward rates, unlock price, or adds new modules (`UniversalEnergyProtocol.addModule()` etc).

---

For full contract details, see [contracts/](../contracts/) and protocol specs in [`architecture.md`](architecture.md).
