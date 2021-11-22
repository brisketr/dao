// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @dev Interface representing a snapshot of BRIB token holders.
 */
interface IBRIBSnapshot {
	/**
	 * @dev Get the full array of BRIB holders.
	 */
	function getHolders() external view returns (address[] memory);

	/**
	 * @dev Determine whether given address was a BRIB holder at the time of snapshot.
	 */
	function isHolder(address addr) external view returns (bool);

    /**
	 * @dev Get the BRIB holding amount for a specific address.
	 */
    function amount(address addr) external view returns (uint256);
}
