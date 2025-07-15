// scripts/helpers/faucet.js
const hre = require("hardhat");

async function main() {
  // Dəyişdirilə bilən parametrlər:
  const tokenAddress = "0xYourTokenAddress"; // ERC-20/UEP/ENERGY token address
  const recipient = "0xRecipientAddress";    // Address to receive tokens (can be multiple)
  const amount = hre.ethers.utils.parseEther("1000"); // Amount to send (as string/ETH units)

  // Əlavə etmək üçün: bir neçə recipient adres
  // const recipients = ["0x...", "0x...", ...];

  // Token contract ABI — standard ERC-20
  const abi = [
    "function transfer(address to, uint256 value) public returns (bool)",
    "function balanceOf(address) public view returns (uint256)",
    "function decimals() public view returns (uint8)"
  ];

  // Provider və signer
  const [signer] = await hre.ethers.getSigners();
  const token = new hre.ethers.Contract(tokenAddress, abi, signer);

  // Token decimals-ı oxu (çox vacibdir!)
  const decimals = await token.decimals();
  const realAmount = amount.div(hre.ethers.BigNumber.from(10).pow(18 - decimals));

  // Transfer (fərdi)
  try {
    const tx = await token.transfer(recipient, realAmount);
    await tx.wait();
    const bal = await token.balanceOf(recipient);
    console.log(`[SUCCESS] Faucet sent ${hre.ethers.utils.formatUnits(realAmount, decimals)} tokens to ${recipient}. New balance: ${hre.ethers.utils.formatUnits(bal, decimals)}`);
  } catch (e) {
    console.error(`[ERROR] Faucet failed for ${recipient}:`, e.message);
  }

  // // Əgər batch göndəriş lazımdırsa, aşağıdakı şərhi sil:
  // for (const rec of recipients) {
  //   try {
  //     const tx = await token.transfer(rec, realAmount);
  //     await tx.wait();
  //     const bal = await token.balanceOf(rec);
  //     console.log(`[SUCCESS] Faucet sent ${hre.ethers.utils.formatUnits(realAmount, decimals)} tokens to ${rec}. New balance: ${hre.ethers.utils.formatUnits(bal, decimals)}`);
  //   } catch (e) {
  //     console.error(`[ERROR] Faucet failed for ${rec}:`, e.message);
  //   }
  // }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
