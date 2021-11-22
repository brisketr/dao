// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./interfaces/IBRIBSnapshot.sol";

/**
 * @title BrisketRib DAO 2021-07 Snapshot
 * @author BrisketRib DAO
 * @dev This contract holds hardcoded addresses and amounts of DAO token holders
 *  as of 2021-07-06.
 *
 * Info was sourced from
 * https://blockscout.com/xdai/mainnet/tokens/0xF100Ed7021D095d1eBE23710a1aE0358993a033b/token-holders
 */
contract BRIBSnapshot202107 is IBRIBSnapshot {
    mapping(address => uint256) private _amounts;
    address[] private _holders;

    /**
     * @dev Set amounts according to snapshot taken from xdai network on
     * 2021-07-06.
     */
    constructor(address treasuryAddress) {
        // Treasury funds (original xdai treasury @ 0x296da132e42005eC85F167A758f5f589EeE609d2)
        _setAmount(treasuryAddress, 1400000 * 10**18);

        // Holders
        _setAmount(0xAE0780691E217Cd23F796A58dCC1105F39A87459, 1000000 * 10**18);
        _setAmount(0x58e6884f4C0c5f8114854eF7322b4cf03086F1fb, 300000 * 10**18);
        _setAmount(0x3566725F8299CA4caD78Db7E100FD237C0B4f246, 300000 * 10**18);
        _setAmount(0x394A5Bc760F05F400662a85b62F1605CF27F5d67, 125000 * 10**18);
        _setAmount(0xe63e5B2ce27DFdd366316d5a66D71b93bab7ECd7, 100000 * 10**18);
        _setAmount(0xda43D6ECD265c6Fa422dc6f28f76EE31218de1e1, 100000 * 10**18);
        _setAmount(0x02f0e7c42DA6ae4EeA04c1dF5F83f8178d33cC0B, 100000 * 10**18);
        _setAmount(0x53ab5db1dA26c2070eE1D5a66f398a1678900a12, 100000 * 10**18);
        _setAmount(0xB5A171465F33f424ac350cB88A74BadAeca35bA7, 100000 * 10**18);
        _setAmount(0x4c51b096d9Db201E7cceA407cb69DFD786BF16a0, 100000 * 10**18);
        _setAmount(0x7968b802Da769868C89FB4dB434B95e132011CdC, 10000 * 10**18);
        _setAmount(0x825c5F8FAc034Df7a884a0Fed5d27F1f926150D4, 10000 * 10**18);
        _setAmount(0xE36f71b6ca07b5e59dCCE268567cE0494e3b5d63, 10000 * 10**18);
    }

    function _setAmount(address addr, uint256 amt) private {
        _amounts[addr] = amt;
		_holders.push(addr);
    }

	/**
	 * @dev See {IBRIBSnapshot.getHolders}
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
