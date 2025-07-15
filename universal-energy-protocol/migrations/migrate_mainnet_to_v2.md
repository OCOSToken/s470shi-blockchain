# Universal Energy Protocol — Mainnet v1 ➔ v2 Migration Guide

**This guide describes the step-by-step procedure for a secure, auditable, and DAO-approved upgrade of UniversalEnergyProtocol from v1 to v2 on mainnet.  
All steps require explicit on-chain governance approval and are fully transparent to the community.**

---

## 1. Preparation

- **Announce migration** in all DAO/community channels with detailed timeline and rationale.
- **Freeze non-essential protocol upgrades** and major module changes until migration is complete.
- **Snapshot** all critical contract addresses, balances, and DAO parameters for v1.
- **Audit v2 contracts:**  
  - Independent security audit completed and report published.
  - Source code verified on block explorer.

---

## 2. DAO On-Chain Proposal

- Create a DAO governance proposal to:
  - Approve v2 contracts (addresses, versions, upgrade rationale).
  - Approve the migration script and custodian/relayer accounts.
  - Approve new module permissions, parameters, or changes.
- Include a detailed plan for:
  - State snapshot (ENERGY, reputation, modules)
  - Token and reputation mapping rules (see below)
  - Emergency rollback plan

---

## 3. Deployment of v2 Contracts

- Deploy all v2 contracts to mainnet (core, modules, interfaces).
- Verify source code, publish all ABIs and addresses.
- Initialize v2 contracts in "paused" state until migration is finalized.

---

## 4. State Snapshot & Data Migration

- **On-chain state export:**  
  - ENERGY token balances (`balanceOf`)
  - Reputation scores (`reputation`)
  - Module registry and parameters
  - DAO governor and ownership data

- **Mapping & validation:**  
  - Validate all addresses and token balances.
  - Prepare mapping scripts to transfer state into v2 contracts.

- **DAO community review:**  
  - Publish full snapshot and mapping logic for DAO and public audit.

---

## 5. Migration Execution

- **Pause v1 contracts** (if pausable), or disable new mint/burn via governance.
- **Run migration scripts:**  
  - Transfer ENERGY and reputation state to v2.
  - Register all modules and re-apply DAO parameters.
  - Confirm all balances and roles.

- **DAO/Community validation:**  
  - Open audit window for users to verify their balances and status.
  - Report any anomalies; address via DAO multi-sig.

---

## 6. Unpause & Activate v2

- After audit window and DAO approval, unpause v2 contracts and modules.
- Announce new contract addresses, documentation, and support.

---

## 7. Finalize & Decommission v1

- Optionally, renounce ownership or destroy v1 contracts (if appropriate).
- Update all dApps, docs, and integrations to point to v2.
- Publish a final migration and audit report on [s470shi.org](https://s470shi.org).

---

## 8. Best Practices

- All migration scripts must be open source and reviewed by multiple parties.
- Prefer multi-sig execution for all critical steps.
- Ensure full community awareness and engagement at every stage.

---

## 9. References

- [SECURITY.md](../SECURITY.md)
- [architecture.md](../docs/architecture.md)
- [DAO Governance Proposal Template](../.github/ISSUE_TEMPLATE.md)

---

**Migration must prioritize transparency, user safety, and DAO sovereignty at all times.**

