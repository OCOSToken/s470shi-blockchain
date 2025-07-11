// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IDAO {
    function votingPower(address user) external view returns (uint256);
}

contract DAOTreasury {
    address public dao;

    modifier onlyDAO() {
        require(msg.sender == dao, "Only DAO");
        _;
    }

    constructor(address _dao) {
        dao = _dao;
    }

    function transferFunds(address payable to, uint256 amount) external onlyDAO {
        require(address(this).balance >= amount, "Insufficient funds");
        to.transfer(amount);
    }

    receive() external payable {}
}
