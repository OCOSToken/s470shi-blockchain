// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title S470SHI Hybrid Blockchain Token (S47)
 * @author Ocoshy Nakomoto & OCOSToken Community
 * @notice Professional, extensible, and audit-friendly ERC20 smart contract
 * @dev Includes mint, burn, pause, DAO governance and modular upgrades.
 */

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract S470SHIToken is ERC20, ERC20Burnable, Pausable, Ownable {
    // Initial total supply: 21,000,000 S47 (decimals: 18)
    uint256 public constant INITIAL_SUPPLY = 21_000_000 * 1e18;

    // Governance address (DAO or Multisig)
    address public governance;

    event GovernanceTransferred(address indexed previousGov, address indexed newGov);

    modifier onlyGovernance() {
        require(msg.sender == governance, "Not authorized: governance only");
        _;
    }

    constructor(address _governance) ERC20("S470SHI Hybrid Blockchain Token", "S47") {
        _mint(_governance, INITIAL_SUPPLY);
        governance = _governance;
    }

    /// @notice Pause contract operations (emergency stop)
    function pause() public onlyGovernance {
        _pause();
    }

    /// @notice Resume contract operations
    function unpause() public onlyGovernance {
        _unpause();
    }

    /// @notice Mint new tokens (DAO upgrade/future extension)
    function mint(address to, uint256 amount) public onlyGovernance {
        _mint(to, amount);
    }

    /// @notice Transfer governance role to new DAO/owner/multisig
    function transferGovernance(address newGov) external onlyGovernance {
        require(newGov != address(0), "New governance cannot be zero address");
        emit GovernanceTransferred(governance, newGov);
        governance = newGov;
    }

    /// @dev ERC20 hook to restrict transfers while paused
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal override(ERC20)
    {
        require(!paused(), "Transfers are paused");
        super._beforeTokenTransfer(from, to, amount);
    }

    // --- Optional: DAO proposals, on-chain voting, and module upgrades can be added here ---

    /**
     * Satoshi-inspired message:
     * "A true token is not built by code, but by the shared will of the community."
     * — S470SHI Genesis
     */
}
