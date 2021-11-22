// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/presets/ERC20PresetMinterPauser.sol";

import "./interfaces/IBRIBSnapshot.sol";

contract BRIBToken is ERC20PresetMinterPauser {
    IBRIBSnapshot private _snapshot;

    /**
     * @dev Constructs the BRIB token and mints balances according to the
     * snapshot.
     */
    constructor(address snapshot) ERC20PresetMinterPauser("BrisketRib DAO Token", "BRIB") {
        _snapshot = IBRIBSnapshot(snapshot);
        address[] memory addresses = _snapshot.getHolders();

        for (uint256 i = 0; i < addresses.length; i++) {
            _mint(addresses[i], _snapshot.amount(addresses[i]));
        }
    }
}
