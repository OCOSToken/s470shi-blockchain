// scripts/verify.js
const hre = require("hardhat");

async function main() {
  // Addresses of deployed contracts (fill in after deployment)
  const contracts = [
    {
      name: "UniversalEnergyProtocol",
      address: "0xYourUEPAddress",
      constructorArgs: []
    },
    {
      name: "TestToken",
      address: "0xYourTestTokenAddress",
      constructorArgs: [
        "Test Staking Token",
        "TST",
        18,
        hre.ethers.utils.parseEther("1000000")
      ]
    },
    {
      name: "TestNFT",
      address: "0xYourTestNFTAddress",
      constructorArgs: [
        "TestNFT",
        "TNFT"
      ]
    },
    {
      name: "StakingModule",
      address: "0xYourStakingModuleAddress",
      constructorArgs: [
        "0xYourTestTokenAddress",
        "0xYourUEPAddress",
        hre.ethers.utils.parseEther("1"),
        100
      ]
    },
    {
      name: "NftUnlockModule",
      address: "0xYourNftUnlockModuleAddress",
      constructorArgs: [
        "0xYourUEPAddress",
        "0xYourTestNFTAddress",
        hre.ethers.utils.parseEther("100"),
        1
      ]
    },
    {
      name: "OracleBridgeModule",
      address: "0xYourOracleBridgeModuleAddress",
      constructorArgs: [
        "0xYourUEPAddress",
        "0xYourOracleAddress",
        hre.ethers.utils.parseEther("10")
      ]
    }
  ];

  for (const c of contracts) {
    if (!c.address || c.address.startsWith("0xYour")) {
      console.log(`[WARN] Please set the correct deployed address for ${c.name}.`);
      continue;
    }
    try {
      console.log(`[INFO] Verifying ${c.name} at ${c.address} ...`);
      await hre.run("verify:verify", {
        address: c.address,
        constructorArguments: c.constructorArgs,
      });
      console.log(`[SUCCESS] ${c.name} verified successfully.`);
    } catch (e) {
      if (e.message && e.message.includes("Already Verified")) {
        console.log(`[OK] ${c.name} is already verified.`);
      } else {
        console.error(`[ERROR] Verification failed for ${c.name}:`, e.message);
      }
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
