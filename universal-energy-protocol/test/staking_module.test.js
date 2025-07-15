// test/staking_module.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StakingModule", function () {
  let owner, dao, user, other, energy, stakingToken, stakingModule;

  beforeEach(async function () {
    [owner, dao, user, other] = await ethers.getSigners();

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
    const rewardRate = ethers.utils.parseEther("1"); // 1 ENERGY per block per token (example)
    const minStakePeriod = 10; // 10 blocks minimum
    const StakingModule = await ethers.getContractFactory("StakingModule");
    stakingModule = await StakingModule.deploy(
      stakingToken.address,
      energy.address,
      rewardRate,
      minStakePeriod
    );
    await stakingModule.deployed();

    // 4. Add StakingModule as authorized ENERGY minter/burner
    await energy.connect(dao).addModule(stakingModule.address);

    // 5. Fund user with staking tokens
    await stakingToken.transfer(user.address, ethers.utils.parseEther("1000"));
  });

  it("Should allow user to stake tokens", async function () {
    await stakingToken.connect(user).approve(stakingModule.address, ethers.utils.parseEther("100"));
    await expect(stakingModule.connect(user).stake(ethers.utils.parseEther("100")))
      .to.emit(stakingModule, "Staked")
      .withArgs(user.address, ethers.utils.parseEther("100"), await ethers.provider.getBlockNumber());
    const info = await stakingModule.stakes(user.address);
    expect(info.amount).to.equal(ethers.utils.parseEther("100"));
  });

  it("Should not allow restake before unstake", async function () {
    await stakingToken.connect(user).approve(stakingModule.address, ethers.utils.parseEther("100"));
    await stakingModule.connect(user).stake(ethers.utils.parseEther("100"));
    await expect(
      stakingModule.connect(user).stake(ethers.utils.parseEther("50"))
    ).to.be.revertedWith("Already staked, must unstake first");
  });

  it("Should accumulate and claim ENERGY reward after blocks", async function () {
    await stakingToken.connect(user).approve(stakingModule.address, ethers.utils.parseEther("10"));
    await stakingModule.connect(user).stake(ethers.utils.parseEther("10"));

    // Advance blocks
    for (let i = 0; i < 5; i++) {
      await ethers.provider.send("evm_mine");
    }
    const info = await stakingModule.stakes(user.address);
    const claimable = 5 * ethers.utils.parseEther("1") * ethers.utils.parseEther("10") / ethers.utils.parseEther("1");
    await expect(stakingModule.connect(user).claimReward())
      .to.emit(stakingModule, "Claimed")
      .withArgs(user.address, claimable, await ethers.provider.getBlockNumber());
    expect(await energy.balanceOf(user.address)).to.equal(claimable);
  });

  it("Should penalize early unstake and mint correct ENERGY", async function () {
    await stakingToken.connect(user).approve(stakingModule.address, ethers.utils.parseEther("20"));
    await stakingModule.connect(user).stake(ethers.utils.parseEther("20"));

    // Mine fewer than minStakePeriod blocks (simulate early unstake)
    for (let i = 0; i < 5; i++) {
      await ethers.provider.send("evm_mine");
    }
    const stakedBlocks = 5;
    const reward = stakedBlocks * ethers.utils.parseEther("1") * ethers.utils.parseEther("20") / ethers.utils.parseEther("1");
    const penalty = reward.div(2);

    await expect(stakingModule.connect(user).unstake())
      .to.emit(stakingModule, "Unstaked")
      .withArgs(user.address, ethers.utils.parseEther("20"), await ethers.provider.getBlockNumber(), reward.div(2), penalty);

    expect(await energy.balanceOf(user.address)).to.equal(reward.div(2));
    expect(await stakingModule.stakes(user.address)).to.eql([ethers.BigNumber.from(0), ethers.BigNumber.from(0), ethers.BigNumber.from(0)]);
  });

  it("Should allow owner/DAO to update reward rate and minStakePeriod", async function () {
    // Owner update
    await expect(stakingModule.connect(owner).setRewardRate(ethers.utils.parseEther("2")))
      .to.emit(stakingModule, "ParametersUpdated")
      .withArgs(ethers.utils.parseEther("2"), 10);
    await expect(stakingModule.connect(owner).setMinStakePeriod(20))
      .to.emit(stakingModule, "ParametersUpdated")
      .withArgs(ethers.utils.parseEther("2"), 20);
    // DAO update
    await expect(stakingModule.connect(dao).setRewardRate(ethers.utils.parseEther("3")))
      .to.emit(stakingModule, "ParametersUpdated")
      .withArgs(ethers.utils.parseEther("3"), 20);
  });

  it("Should allow rescue of tokens by owner/DAO", async function () {
    // Owner rescues staking tokens
    const balBefore = await stakingToken.balanceOf(owner.address);
    await expect(stakingModule.connect(owner).rescueTokens(stakingToken.address, owner.address, 10))
      .to.changeTokenBalances(stakingToken, [stakingModule, owner], [-10, 10]);
    // DAO rescues
    await expect(stakingModule.connect(dao).rescueTokens(stakingToken.address, dao.address, 5))
      .to.changeTokenBalances(stakingToken, [stakingModule, dao], [-5, 5]);
  });

  it("Should not allow unstake without staking", async function () {
    await expect(stakingModule.connect(user).unstake()).to.be.revertedWith("No stake");
  });

  it("Should not allow claimReward without staking", async function () {
    await expect(stakingModule.connect(user).claimReward()).to.be.revertedWith("No stake");
  });
});
