// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";

/**
 * @title BrisketRib DAO Treasury
 * @author BrisketRib DAO
 * @dev Contains treasury assets held by the BrisketRib DAO.
 */
contract BrisketTreasury is AccessControlEnumerable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    bytes32 public constant TREASURER_ROLE = keccak256("TREASURER_ROLE");

    /**
     * @dev Give the contract deployer the following roles:
     * - DEFAULT_ADMIN_ROLE
     * - TREASURER_ROLE
     */
    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(TREASURER_ROLE, msg.sender);
    }

    /**
     * @dev Transfer funds from the treasury. Only callable by those with
     * TREASURER_ROLE.
     */
    function disburse(
        address tokenAddress,
        address recipient,
        uint256 amount
    ) public onlyRole(TREASURER_ROLE) {
        require(hasRole(TREASURER_ROLE, msg.sender), "must have treasurer role in order to disburse assets");
        IERC20(tokenAddress).safeTransfer(recipient, amount);
    }
}
