// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title S47 Governance & Legacy Token
 * @author S470SHI DAO & OCOSToken Community
 * @notice Open-source, extensible, and audit-friendly ERC20 governance token
 * @dev Includes mint, burn, and pause features; designed for DAO integration
 */

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract S47Token is ERC20, ERC20Burnable, Pausable, Ownable {
    uint256 public constant INITIAL_SUPPLY = 47_000_000 * 1e18; // 47 million S47, 18 decimals

    // DAO/Multisig address with minting and pausing rights
    address public governance;

    event GovernanceTransferred(address indexed previousGov, address indexed newGov);

    modifier onlyGovernance() {
        require(msg.sender == governance, "Not authorized: governance only");
        _;
    }

    constructor(address _governance) ERC20("S470SHI Governance Token", "S47") {
        _mint(_governance, INITIAL_SUPPLY);
        governance = _governance;
    }

    function pause() public onlyGovernance {
        _pause();
    }

    function unpause() public onlyGovernance {
        _unpause();
    }

    function mint(address to, uint256 amount) public onlyGovernance {
        _mint(to, amount);
    }

    function transferGovernance(address newGov) external onlyGovernance {
        require(newGov != address(0), "New governance cannot be zero address");
        emit GovernanceTransferred(governance, newGov);
        governance = newGov;
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal override(ERC20)
    {
        require(!paused(), "Transfers are paused");
        super._beforeTokenTransfer(from, to, amount);
    }
}
