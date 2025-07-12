# Encrypted Legacy DAO Wallet Audit Scenarios

## Governance & Voting
- [ ] Proposal creation is open to all eligible DAO token holders.
- [ ] Voting period, quorum, and supermajority thresholds are properly enforced.
- [ ] Only governance (multi-sig recommended) can execute proposals.

## Unlock Event Security
- [ ] UnlockTriggered event is only emitted after a valid, executed proposal.
- [ ] No unauthorized unlock or backdoor possible.

## Unlock Agent & .aes Management
- [ ] Unlock agent listens only to on-chain events and requests secure passphrase input (never hardcoded or logged).
- [ ] Private key is only decrypted in memory, never written to disk.
- [ ] Every unlock operation is fully logged: proposalId, walletIdx, timestamp, admin confirmation.
- [ ] All fund transfers are verified and visible on blockchain.

## Penetration & Recovery
- [ ] Replay and reentrancy of UnlockTriggered event is tested — ensure wallets cannot be unlocked multiple times.
- [ ] Simulate passphrase compromise and confirm that no single admin or backend can unlock all wallets without DAO consensus.

## Compliance & Monitoring
- [ ] All actions and transfers are transparent to the DAO community (explorer, logs).
- [ ] Regular security reviews and independent audits are conducted.
