// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract DAOGrant {
    address public dao;
    mapping(address => uint256) public grantBalance;

    event GrantRequested(address indexed applicant, uint256 amount, string purpose);
    event GrantApproved(address indexed applicant, uint256 amount);

    modifier onlyDAO() {
        require(msg.sender == dao, "Only DAO");
        _;
    }

    constructor(address _dao) {
        dao = _dao;
    }

    function requestGrant(uint256 amount, string calldata purpose) external {
        emit GrantRequested(msg.sender, amount, purpose);
        // Proposal should be created in DAO
    }

    function approveGrant(address applicant, uint256 amount) external onlyDAO {
        grantBalance[applicant] += amount;
        emit GrantApproved(applicant, amount);
        // Optionally, transfer tokens here
    }
}
