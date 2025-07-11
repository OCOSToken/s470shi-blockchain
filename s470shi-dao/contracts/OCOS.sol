// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OCOSToken is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 47_000_000 * 1e18;

    constructor(address treasury) ERC20("OCOS Governance Token", "OCOS") {
        _mint(treasury, INITIAL_SUPPLY);
    }
}
