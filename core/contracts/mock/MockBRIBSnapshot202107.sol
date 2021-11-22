// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "../interfaces/IBRIBSnapshot.sol";

/**
 * @title BrisketRib DAO 2021-07 Snapshot
 * @author BrisketRib DAO
 * @dev This contract holds hardcoded addresses and amounts of DAO token holders
 *  as of 2021-07-06.
 *
 * Info was sourced from
 * https://blockscout.com/xdai/mainnet/tokens/0xF100Ed7021D095d1eBE23710a1aE0358993a033b/token-holders
 */
contract MockBRIBSnapshot202107 is IBRIBSnapshot {
    mapping(address => uint256) private _amounts;
    address[] private _holders;

    function setAmount(address addr, uint256 amt) public {
        _amounts[addr] = amt;
		_holders.push(addr);
    }

	/**
	 * @dev See {IBRIBSnapshot.amount}
	 */
	function getHolders() external view override returns (address[] memory) {
		return _holders;
	}

	/**
	 * @dev See {IBRIBSnapshot.isHolder}
	 */
	function isHolder(address addr) external view override returns (bool) {
		return _amounts[addr] > 0;
	}

	/**
	 * @dev See {IBRIBSnapshot.amount}
	 */
    function amount(address addr) external view override returns (uint256) {
        return _amounts[addr];
    }
}
