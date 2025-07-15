# Universal Energy Protocol (UEP)

A modular, secure, and DAO-governed energy and reputation layer designed for advanced Web3 ecosystems, social DAOs, staking systems, oracle bridges, and NFT infrastructure.

> All components, modules, governance logic, and smart contracts in this repository are **100% aligned for a single DAO** — governed by OCOS DAO or its successors.

---

## 🔥 What is Universal Energy Protocol?

UniversalEnergyProtocol (UEP) introduces a fully modular, on-chain system that tokenizes **energy**, **reputation**, and **merit** for DAO-powered platforms.

It powers:
- **Staking-based rewards**
- **NFT unlocks via on-chain ENERGY**
- **Oracle and off-chain bridge triggers**
- **Governance-aligned ENERGY minting/burning**
- **Reputation tracking**
- **Multi-module coordination (plug-and-play)**

---

## 🧱 Architecture

- `UniversalEnergyProtocol.sol`: The core ERC-20 compatible energy engine (ENERGY token + reputation + governance + module logic)
- `StakingModule.sol`: Stake ERC-20 tokens to earn ENERGY. DAO can adjust reward rates, time periods.
- `NftUnlockModule.sol`: Burn ENERGY to unlock/mint NFTs. Each unlock is tracked and auditable.
- `OracleBridgeModule.sol`: Mint ENERGY via oracle-confirmed external actions (e.g. bridge, off-chain proof).
- `IModule.sol`: Required interface all modules must implement (mint/burn hooks).
- `TestToken.sol` & `TestNFT.sol`: Minimal demo contracts for integration testing.

All modules are explicitly **added via DAO** using `addModule()` and removed with `removeModule()` — no implicit permissions.

---

## ⚙️ For Developers

### Requirements
- [Node.js](https://nodejs.org/)
- [Hardhat](https://hardhat.org/)
- [ethers.js](https://docs.ethers.org/)
- Optional: [Foundry](https://book.getfoundry.sh/), [Brownie](https://eth-brownie.readthedocs.io/)

### Install

```bash
git clone https://github.com/s470shi/universal-energy-protocol.git
cd universal-energy-protocol
yarn install
```

### Deploy locally
```bash
npx hardhat run scripts/deploy.js --network localhost
```

### Verify on explorer
```bash
npx hardhat run scripts/verify.js --network sepolia
```

### Faucet for testing
```bash
npx hardhat run scripts/helpers/faucet.js --network localhost
```

---

## ✅ Features

| Module                | Functionality                                        |
|-----------------------|------------------------------------------------------|
| UniversalEnergyProtocol | ENERGY + reputation + transfer + DAO + module logic |
| StakingModule         | Stake-to-EARN ENERGY (auto reward / mint logic)     |
| NftUnlockModule       | Burn ENERGY to unlock NFT, gamified experiences     |
| OracleBridgeModule    | Trigger ENERGY via oracle or off-chain event        |

---

## 🔒 Security & Governance

- DAO owns all critical roles (minting modules, updates, governance)
- All mint/burn operations require module registration (no public access)
- Replay protection, event logging, and DAO-only upgrades included
- See [`SECURITY.md`](SECURITY.md) for full vulnerability disclosure policy

---

## 📁 Directory Overview

```
contracts/           → All Solidity contracts (core + modules)
interfaces/          → IModule interface (all modules implement it)
scripts/             → Deployment, verify, faucet and helper scripts
test/                → Unit + integration tests (staking, nft, oracle, DAO)
docs/                → Architecture, use-cases, diagrams
.github/             → CI, PR templates, workflows
```

---

## 🧠 DAO Usage

This protocol is built for **one DAO, one energy economy.**  
All governance actions (parameter updates, module additions, ownership) are on-chain, managed by DAO multisig or contract-based voting.

---

## 🪪 License

MIT © 2025 — OCOS DAO  
See [`LICENSE`](LICENSE)

---

## 🌐 More

- Docs, audits and governance guidelines: coming soon
- DAO Portal: [s470shi.org](https://s470shi.org)
- Bug reports: [security@s470shi.org](mailto:security@s470shi.org)

**Build the future of reputation. On-chain. With ENERGY.**
