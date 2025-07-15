// test/energy_protocol.test.js

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UniversalEnergyProtocol", function () {
  let UEP, uep, owner, dao, user, mod1, mod2;

  beforeEach(async function () {
    [owner, dao, user, mod1, mod2, other] = await ethers.getSigners();

    // Deploy contract
    UEP = await ethers.getContractFactory("UniversalEnergyProtocol");
    uep = await UEP.deploy();
    await uep.deployed();

    // Transfer DAO governance to 'dao'
    await uep.transferOwnership(owner.address); // For explicitness
    await uep.setDaoGovernor(dao.address);
  });

  it("Should deploy with correct defaults", async function () {
    expect(await uep.owner()).to.equal(owner.address);
    expect(await uep.daoGovernor()).to.equal(dao.address);
    expect(await uep.totalSupply()).to.equal(0);
  });

  it("Should allow DAO to add and remove modules", async function () {
    await expect(uep.connect(dao).addModule(mod1.address))
      .to.emit(uep, "ModuleAdded")
      .withArgs(mod1.address, dao.address);

    expect(await uep.authorizedModule(mod1.address)).to.equal(true);

    await expect(uep.connect(dao).removeModule(mod1.address))
      .to.emit(uep, "ModuleRemoved")
      .withArgs(mod1.address, dao.address);

    expect(await uep.authorizedModule(mod1.address)).to.equal(false);
  });

  it("Should mint energy only from authorized module", async function () {
    // Add mod1 as authorized module
    await uep.connect(dao).addModule(mod1.address);

    // Create a contract mock for module
    const moduleInterface = [
      "function onEnergyMint(address, uint256, string calldata) external",
      "function onEnergyBurn(address, uint256, string calldata) external"
    ];
    // (No actual logic needed for this test)

    // Mint (mod1 calls mint)
    await expect(
      uep.connect(mod1).mint(user.address, 1000, "TestMint")
    )
      .to.emit(uep, "EnergyMinted")
      .withArgs(user.address, 1000, "TestMint", mod1.address);

    expect(await uep.balanceOf(user.address)).to.equal(1000);
    expect(await uep.totalSupply()).to.equal(1000);
    expect(await uep.lastActivity(user.address)).to.be.gt(0);
  });

  it("Should burn energy only from authorized module", async function () {
    await uep.connect(dao).addModule(mod1.address);

    // Mint first
    await uep.connect(mod1).mint(user.address, 5000, "TestMint");
    expect(await uep.balanceOf(user.address)).to.equal(5000);

    // Burn
    await expect(
      uep.connect(mod1).burn(user.address, 2000, "TestBurn")
    )
      .to.emit(uep, "EnergyBurned")
      .withArgs(user.address, 2000, "TestBurn", mod1.address);

    expect(await uep.balanceOf(user.address)).to.equal(3000);
    expect(await uep.totalSupply()).to.equal(3000);
  });

  it("Should not allow mint/burn from unauthorized address", async function () {
    await expect(
      uep.connect(user).mint(user.address, 1000, "IllegalMint")
    ).to.be.revertedWith("Not authorized module");

    await expect(
      uep.connect(user).burn(user.address, 1000, "IllegalBurn")
    ).to.be.revertedWith("Not authorized module");
  });

  it("Should transfer energy between users", async function () {
    await uep.connect(dao).addModule(mod1.address);
    await uep.connect(mod1).mint(user.address, 2500, "TestMint");

    await expect(uep.connect(user).transfer(other.address, 1000))
      .to.emit(uep, "Transfer")
      .withArgs(user.address, other.address, 1000);

    expect(await uep.balanceOf(user.address)).to.equal(1500);
    expect(await uep.balanceOf(other.address)).to.equal(1000);
  });

  it("Should update and track reputation on mint/burn", async function () {
    await uep.connect(dao).addModule(mod1.address);
    await uep.connect(mod1).mint(user.address, 10000, "ReputationTest");

    const repAfterMint = await uep.reputation(user.address);
    expect(repAfterMint).to.equal(100); // 1% of 10000

    await uep.connect(mod1).burn(user.address, 2000, "ReputationPenalty");
    const repAfterBurn = await uep.reputation(user.address);
    expect(repAfterBurn).to.equal(90); // -0.5% of 2000 = 10, 100-10=90
  });

  it("Should allow owner and DAO to transfer ownership and governance", async function () {
    await expect(uep.connect(owner).transferOwnership(other.address))
      .to.emit(uep, "OwnerChanged")
      .withArgs(owner.address, other.address);

    await expect(uep.connect(other).setDaoGovernor(user.address))
      .to.emit(uep, "DaoGovernorChanged")
      .withArgs(dao.address, user.address);
  });

  it("Should return correct user info", async function () {
    await uep.connect(dao).addModule(mod1.address);
    await uep.connect(mod1).mint(user.address, 1234, "UserInfoTest");
    const info = await uep.userInfo(user.address);
    expect(info.energy).to.equal(1234);
    expect(info.rep).to.be.gt(0);
    expect(info.lastActive).to.be.gt(0);
  });
});
