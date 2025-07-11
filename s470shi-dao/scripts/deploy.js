// scripts/deploy.js
const hre = require("hardhat");

async function main() {
    // 1. Deployer hesabını al
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);

    // 2. S47Token deploy
    const S47Token = await hre.ethers.getContractFactory("S47Token");
    const s47Token = await S47Token.deploy(deployer.address);
    await s47Token.deployed();
    console.log("S47Token deployed at:", s47Token.address);

    // 3. OCOSToken deploy
    const OCOSToken = await hre.ethers.getContractFactory("OCOSToken");
    const ocosToken = await OCOSToken.deploy(deployer.address);
    await ocosToken.deployed();
    console.log("OCOSToken deployed at:", ocosToken.address);

    // 4. S470SHIDAO deploy
    const S470SHIDAO = await hre.ethers.getContractFactory("S470SHIDAO");
    const dao = await S470SHIDAO.deploy(s47Token.address, ocosToken.address, deployer.address);
    await dao.deployed();
    console.log("S470SHIDAO deployed at:", dao.address);

    // 5. DAOTreasury deploy
    const DAOTreasury = await hre.ethers.getContractFactory("DAOTreasury");
    const treasury = await DAOTreasury.deploy(dao.address);
    await treasury.deployed();
    console.log("DAOTreasury deployed at:", treasury.address);

    // 6. Nəticə çıxışı və adreslərin yadda saxlanılması (fayla yazmaq üçün əlavə edə bilərsən)
    console.log("\nDeployed contract addresses:");
    console.log("S47Token:", s47Token.address);
    console.log("OCOSToken:", ocosToken.address);
    console.log("S470SHIDAO:", dao.address);
    console.log("DAOTreasury:", treasury.address);

    // (İstəsən: config.js və ya .json fayla ünvanları yazmaq üçün burada fs istifadə edə bilərsən)
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
