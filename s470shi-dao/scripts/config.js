// scripts/config.js
/**
 * S470SHI DAO Deployment Configuration
 * All critical contract addresses and network parameters
 * (Update this file after every deployment for consistent scripting and frontend integration)
 */

module.exports = {
    network: "mainnet",  // or 'testnet', 'goerli', etc.
    deployer: "0xYourDeployerAddressHere",
    treasury: "0xYourTreasuryAddressHere",
    contracts: {
        S47Token:    "0xS47TokenDeployedAddress",
        OCOSToken:   "0xOCOSTokenDeployedAddress",
        S470SHIDAO:  "0xS470SHIDAODeployedAddress",
        DAOTreasury: "0xDAOTreasuryDeployedAddress"
    },
    oracles: {
        S47PriceFeed:  "0xS47OracleAddress",
        OCOSPriceFeed: "0xOCOSOracleAddress"
    },
    // Advanced settings
    proposal: {
        minQuorum: 4700,        // Minimum votes for proposals
        superMajority: 75,      // 75% for critical actions
        votingDuration: 604800, // in seconds (e.g. 1 week)
    },
    // Admins and multi-sig wallets
    governance: [
        "0xFirstGovernorAddress",
        "0xSecondGovernorAddress"
    ],
    api: {
        explorer: "https://explorer.s470shi.org",
        rpc:      "https://rpc.yourdao.net"
    }
};
