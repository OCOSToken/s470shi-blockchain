// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title S470SHI DAO Governance Contract
 * @author S470SHI DAO & OCOSToken Community
 * @notice On-chain proposal, voting, and treasury control for S470SHI DAO
 * @dev Universal, modular, and audit-ready — supports legacy and governance tokens (S47 & OCOS)
 */

interface IVotingToken {
    function balanceOf(address user) external view returns (uint256);
}

contract S470SHIDAO {
    // Tokens with voting rights (S47 and OCOS)
    address public s47Token;
    address public ocosToken;
    address public treasury;
    uint256 public quorum = 4700 * 1e18; // Minimum 4,700 voting power
    uint256 public supermajority = 75;   // 75% for critical actions

    enum ProposalType { GENERAL, TREASURY, LEGACY }

    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        ProposalType proposalType;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 deadline;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    uint256 public proposalCount;
    mapping(uint256 => Proposal) public proposals;

    event ProposalCreated(uint256 id, address proposer, string description, ProposalType proposalType, uint256 deadline);
    event Voted(uint256 id, address voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 id, bool success);

    modifier onlyTokenHolder() {
        require(votingPower(msg.sender) > 0, "Not a token holder");
        _;
    }

    constructor(address _s47Token, address _ocosToken, address _treasury) {
        s47Token = _s47Token;
        ocosToken = _ocosToken;
        treasury = _treasury;
    }

    // Calculate total voting power (S47 + OCOS)
    function votingPower(address user) public view returns (uint256) {
        return IVotingToken(s47Token).balanceOf(user) + IVotingToken(ocosToken).balanceOf(user);
    }

    // Create a new proposal (any token holder can)
    function createProposal(string calldata description, ProposalType proposalType, uint256 duration) external onlyTokenHolder returns (uint256) {
        proposalCount++;
        Proposal storage p = proposals[proposalCount];
        p.id = proposalCount;
        p.proposer = msg.sender;
        p.description = description;
        p.proposalType = proposalType;
        p.deadline = block.timestamp + duration;
        emit ProposalCreated(p.id, msg.sender, description, proposalType, p.deadline);
        return p.id;
    }

    // Vote on a proposal
    function vote(uint256 proposalId, bool support) external onlyTokenHolder {
        Proposal storage p = proposals[proposalId];
        require(block.timestamp < p.deadline, "Voting period ended");
        require(!p.hasVoted[msg.sender], "Already voted");
        uint256 power = votingPower(msg.sender);
        require(power > 0, "No voting power");
        if (support) {
            p.votesFor += power;
        } else {
            p.votesAgainst += power;
        }
        p.hasVoted[msg.sender] = true;
        emit Voted(proposalId, msg.sender, support, power);
    }

    // Execute proposal if voting and quorum requirements are met
    function executeProposal(uint256 proposalId) external {
        Proposal storage p = proposals[proposalId];
        require(!p.executed, "Already executed");
        require(block.timestamp >= p.deadline, "Voting still active");
        require(p.votesFor + p.votesAgainst >= quorum, "Quorum not met");

        bool success;
        if (
            (p.proposalType == ProposalType.TREASURY || p.proposalType == ProposalType.LEGACY) &&
            p.votesFor * 100 / (p.votesFor + p.votesAgainst) >= supermajority
        ) {
            // Critical proposal passed with supermajority (75%)
            success = true;
            // Additional on-chain logic for treasury or legacy transfers goes here
        } else if (
            p.proposalType == ProposalType.GENERAL &&
            p.votesFor > p.votesAgainst
        ) {
            // General proposal passed with simple majority
            success = true;
        }
        p.executed = true;
        emit ProposalExecuted(proposalId, success);
    }

    // -- Additional DAO functions (e.g., treasury, legacy claims, airdrops) can be added below --
}
