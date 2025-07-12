// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Encrypted Legacy DAO Wallet Contract
 * @notice Handles DAO proposals, voting, and unlock event triggers for encrypted wallets
 */
contract EncryptedWalletDAO {
    address public governance;
    uint256 public requiredQuorum = 4700 * 1e18; // Example: 4700 tokens

    struct Proposal {
        uint256 id;
        string description;
        uint256 targetWalletIndex;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 endTime;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;

    event ProposalCreated(uint256 indexed id, string desc, uint256 walletIdx, uint256 endTime);
    event Voted(uint256 indexed id, address voter, bool support, uint256 weight);
    event UnlockTriggered(uint256 indexed id, uint256 walletIdx);

    modifier onlyGovernance() {
        require(msg.sender == governance, "Not governance");
        _;
    }

    constructor(address _governance) {
        governance = _governance;
    }

    // Dummy voting power for example — replace with real token integration!
    function votingPower(address user) public pure returns (uint256) {
        return 1e18; // Each user gets 1 vote
    }

    function createProposal(string calldata desc, uint256 walletIdx, uint256 duration) external returns (uint256) {
        proposalCount++;
        Proposal storage p = proposals[proposalCount];
        p.id = proposalCount;
        p.description = desc;
        p.targetWalletIndex = walletIdx;
        p.endTime = block.timestamp + duration;
        emit ProposalCreated(p.id, desc, walletIdx, p.endTime);
        return p.id;
    }

    function vote(uint256 proposalId, bool support) external {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp < p.endTime, "Voting ended");
        require(!p.hasVoted[msg.sender], "Already voted");
        uint256 weight = votingPower(msg.sender);
        require(weight > 0, "No voting power");
        if (support) {
            p.votesFor += weight;
        } else {
            p.votesAgainst += weight;
        }
        p.hasVoted[msg.sender] = true;
        emit Voted(proposalId, msg.sender, support, weight);
    }

    function executeProposal(uint256 proposalId) external onlyGovernance {
        Proposal storage p = proposals[proposalId];
        require(!p.executed, "Already executed");
        require(block.timestamp >= p.endTime, "Voting still active");
        require(p.votesFor + p.votesAgainst >= requiredQuorum, "Quorum not met");
        require(p.votesFor > p.votesAgainst, "Not approved");
        p.executed = true;
        emit UnlockTriggered(proposalId, p.targetWalletIndex);
    }
}
