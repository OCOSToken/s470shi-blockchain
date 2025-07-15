// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  // ----- 1. Deploy UniversalEnergyProtocol -----
  const UniversalEnergyProtocol = await hre.ethers.getContractFactory("UniversalEnergyProtocol");
  const uep = await UniversalEnergyProtocol.deploy();
  await uep.deployed();
  console.log("UniversalEnergyProtocol deployed to:", uep.address);

  // ----- 2. Deploy Test ERC-20 (for staking) -----
  // Optionally replace with your existing token contract/address
  const TestToken = await hre.ethers.getContractFactory("TestToken");
  const testToken = await TestToken.deploy("Test Staking Token", "TST", 18, hre.ethers.utils.parseEther("1000000"));
  await testToken.deployed();
  console.log("TestToken deployed to:", testToken.address);

  // ----- 3. Deploy Test ERC-721 (for NFT unlock) -----
  const TestNFT = await hre.ethers.getContractFactory("TestNFT");
  const testNFT = await TestNFT.deploy("TestNFT", "TNFT");
  await testNFT.deployed();
  console.log("TestNFT deployed to:", testNFT.address);

  // ----- 4. Deploy StakingModule -----
  const rewardRate = hre.ethers.utils.parseEther("1");      // 1 ENERGY per block per token (example)
  const minStakePeriod = 100;                               // 100 blocks minimum stake period
  const StakingModule = await hre.ethers.getContractFactory("StakingModule");
  const stakingModule = await StakingModule.deploy(
    testToken.address,
    uep.address,
    rewardRate,
    minStakePeriod
  );
  await stakingModule.deployed();
  console.log("StakingModule deployed to:", stakingModule.address);

  // ----- 5. Deploy NftUnlockModule -----
  const unlockPrice = hre.ethers.utils.parseEther("100");   // 100 ENERGY per NFT unlock
  const firstTokenId = 1;
  const NftUnlockModule = await hre.ethers.getContractFactory("NftUnlockModule");
  const nftUnlockModule = await NftUnlockModule.deploy(
    uep.address,
    testNFT.address,
    unlockPrice,
    firstTokenId
  );
  await nftUnlockModule.deployed();
  console.log("NftUnlockModule deployed to:", nftUnlockModule.address);

  // ----- 6. Deploy OracleBridgeModule -----
  // For demo, use deployer address as "oracle" — replace with actual oracle contract in prod
  const oracleAddress = (await hre.ethers.getSigners())[0].address;
  const rewardPerEvent = hre.ethers.utils.parseEther("10");
  const OracleBridgeModule = await hre.ethers.getContractFactory("OracleBridgeModule");
  const oracleBridgeModule = await OracleBridgeModule.deploy(
    uep.address,
    oracleAddress,
    rewardPerEvent
  );
  await oracleBridgeModule.deployed();
  console.log("OracleBridgeModule deployed to:", oracleBridgeModule.address);

  // ----- 7. Add Modules to UEP (DAO permission needed; here deployer is DAO/owner) -----
  let tx;
  tx = await uep.addModule(stakingModule.address);
  await tx.wait();
  console.log("StakingModule added to UEP modules.");

  tx = await uep.addModule(nftUnlockModule.address);
  await tx.wait();
  console.log("NftUnlockModule added to UEP modules.");

  tx = await uep.addModule(oracleBridgeModule.address);
  await tx.wait();
  console.log("OracleBridgeModule added to UEP modules.");

  console.log("Deployment complete.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
