// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SnapshotVoting {
    // This contract can be used as a snapshot/record of balances at proposal time for off-chain voting
    mapping(uint256 => mapping(address => uint256)) public snapshotBalances;

    function recordSnapshot(uint256 proposalId, address user, uint256 balance) external {
        snapshotBalances[proposalId][user] = balance;
    }

    // ...Integration with Snapshot.org off-chain tools recommended
}
