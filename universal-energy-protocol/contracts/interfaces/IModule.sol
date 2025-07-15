// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title IModule — UniversalEnergyProtocol standard module interface
/// @dev All plug-in modules (staking, NFT, oracle, game, etc.) MUST implement this interface

interface IModule {
    /// @notice Called by UniversalEnergyProtocol after ENERGY is minted for a user
    /// @param user The user who received ENERGY
    /// @param amount The amount of ENERGY minted
    /// @param ref Reference string describing the reason/context
    function onEnergyMint(address user, uint256 amount, string calldata ref) external;

    /// @notice Called by UniversalEnergyProtocol after ENERGY is burned from a user
    /// @param user The user who spent ENERGY
    /// @param amount The amount of ENERGY burned
    /// @param ref Reference string describing the reason/context
    function onEnergyBurn(address user, uint256 amount, string calldata ref) external;
}
