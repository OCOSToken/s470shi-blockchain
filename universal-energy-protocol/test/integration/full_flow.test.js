// test/integration/full_flow.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Full Integration Flow: UniversalEnergyProtocol", function () {
  let owner, dao, user, mod, oracle, energy, stakingToken, stakingModule, nft, nftUnlockModule, oracleBridgeModule;

  beforeEach(async function () {
    [owner, dao, user, mod, oracle] = await ethers.getSigners();

    // 1. Deploy ENERGY contract (UniversalEnergyProtocol)
    const UEP = await ethers.getContractFactory("UniversalEnergyProtocol");
    energy = await UEP.deploy();
    await energy.deployed();
    await energy.setDaoGovernor(dao.address);

    // 2. Deploy test ERC-20 staking token
    const TestToken = await ethers.getContractFactory("TestToken");
    stakingToken = await TestToken.deploy("Test Staking Token", "TST", 18, ethers.utils.parseEther("1000000"));
    await stakingToken.deployed();

    // 3. Deploy StakingModule
    const rewardRate = ethers.utils.parseEther("1");
    const minStakePeriod = 5;
    const StakingModule = await ethers.getContractFactory("StakingModule");
    stakingModule = await StakingModule.deploy(
      stakingToken.address,
      energy.address,
      rewardRate,
      minStakePeriod
    );
    await stakingModule.deployed();

    // 4. Deploy test ERC-721 NFT contract (with simple mint)
    const TestNFT = await ethers.getContractFactory("TestNFT");
    nft = await TestNFT.deploy("TestNFT", "TNFT");
    await nft.deployed();

    // 5. Deploy NftUnlockModule
    const unlockPrice = ethers.utils.parseEther("100");
    const firstTokenId = 1;
    const NftUnlockModule = await ethers.getContractFactory("NftUnlockModule");
    nftUnlockModule = await NftUnlockModule.deploy(
      energy.address,
      nft.address,
      unlockPrice,
      firstTokenId
    );
    await nftUnlockModule.deployed();

    // 6. Deploy OracleBridgeModule
    const rewardPerEvent = ethers.utils.parseEther("10");
    const OracleBridgeModule = await ethers.getContractFactory("OracleBridgeModule");
    oracleBridgeModule = await OracleBridgeModule.deploy(
      energy.address,
      oracle.address,
      rewardPerEvent
    );
    await oracleBridgeModule.deployed();

    // 7. Add modules to ENERGY contract
    await energy.connect(dao).addModule(stakingModule.address);
    await energy.connect(dao).addModule(nftUnlockModule.address);
    await energy.connect(dao).addModule(oracleBridgeModule.address);

    // 8. Fund user with staking tokens
    await stakingToken.transfer(user.address, ethers.utils.parseEther("1000"));
  });

  it("Full DAO flow: staking, reward, NFT unlock, oracle event, and governance", async function () {
    // Step 1: Stake tokens
    await stakingToken.connect(user).approve(stakingModule.address, ethers.utils.parseEther("500"));
    await stakingModule.connect(user).stake(ethers.utils.parseEther("500"));

    // Mine blocks for staking reward
    for (let i = 0; i < 10; i++) {
      await ethers.provider.send("evm_mine");
    }
    // Claim rewards
    await stakingModule.connect(user).claimReward();
    const stakedReward = await energy.balanceOf(user.address);
    expect(stakedReward).to.be.gt(0);

    // Step 2: Unlock NFT using ENERGY (user burns ENERGY, gets NFT)
    // Make sure user has enough ENERGY
    expect(stakedReward).to.be.gte(ethers.utils.parseEther("100"));
    await energy.connect(user).approve(nftUnlockModule.address, ethers.utils.parseEther("100")); // Optional if needed by NFT contract
    await expect(nftUnlockModule.connect(user).unlockNft())
      .to.emit(nftUnlockModule, "NftUnlocked")
      .withArgs(user.address, 1, ethers.utils.parseEther("100"), await ethers.provider.getBlockNumber());
    expect(await nft.ownerOf(1)).to.equal(user.address);

    // Step 3: Oracle event triggers ENERGY reward
    // Mock: set oracle contract as contract with latestValue(requestId) returning (value, timestamp, fulfilled)
    // For demo, we'll just simulate the processOracleEvent directly
    const requestId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("req1"));
    // For real systems, oracleBridgeModule.processOracleEvent would be called only by oracle
    await expect(oracleBridgeModule.connect(oracle).processOracleEvent(user.address, requestId))
      .to.emit(oracleBridgeModule, "OracleEventProcessed")
      .withArgs(user.address, requestId, 0, ethers.utils.parseEther("10"), anyValue);
    // Check ENERGY balance increased
    expect(await energy.balanceOf(user.address)).to.be.gte(stakedReward.sub(ethers.utils.parseEther("100")).add(ethers.utils.parseEther("10")));

    // Step 4: DAO governance — update module parameters
    await expect(stakingModule.connect(dao).setRewardRate(ethers.utils.parseEther("2")))
      .to.emit(stakingModule, "ParametersUpdated")
      .withArgs(ethers.utils.parseEther("2"), 5);

    await expect(nftUnlockModule.connect(dao).setUnlockPrice(ethers.utils.parseEther("150")))
      .to.emit(nftUnlockModule, "UnlockPriceChanged")
      .withArgs(ethers.utils.parseEther("100"), ethers.utils.parseEther("150"));

    await expect(oracleBridgeModule.connect(dao).setReward(ethers.utils.parseEther("20")))
      .to.emit(oracleBridgeModule, "RewardChanged")
      .withArgs(ethers.utils.parseEther("10"), ethers.utils.parseEther("20"));
  });

  it("Should prevent double NFT unlock for same tokenId", async function () {
    await stakingToken.connect(user).approve(stakingModule.address, ethers.utils.parseEther("500"));
    await stakingModule.connect(user).stake(ethers.utils.parseEther("500"));
    for (let i = 0; i < 10; i++) await ethers.provider.send("evm_mine");
    await stakingModule.connect(user).claimReward();
    await nftUnlockModule.connect(user).unlockNft();
    await expect(nftUnlockModule.connect(user).unlockNft())
      .to.not.emit(nftUnlockModule, "NftUnlocked"); // Should fail due to tokenId logic
  });

  it("Should prevent oracle replay", async function () {
    const requestId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("uniqueReq"));
    await expect(oracleBridgeModule.connect(oracle).processOracleEvent(user.address, requestId))
      .to.emit(oracleBridgeModule, "OracleEventProcessed")
      .withArgs(user.address, requestId, 0, ethers.utils.parseEther("10"), anyValue);
    await expect(oracleBridgeModule.connect(oracle).processOracleEvent(user.address, requestId))
      .to.be.revertedWith("Event already processed");
  });
});
