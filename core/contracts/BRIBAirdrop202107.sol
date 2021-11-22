// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./interfaces/IBRIBSnapshot.sol";

/**
 * @dev 2021-07 Airdrop of BRIB tokens to encourage DAO participation.
 */
contract BRIBAirdrop202107 {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    uint256 public constant AIRDROP_AMOUNT = 1000 * 10**18;

    IERC20 private _BRIBToken;
    IBRIBSnapshot private _snapshot;

    mapping(address => bool) public _claims;

    constructor(address BRIBToken, address snapshot) {
        _BRIBToken = IERC20(BRIBToken);
		_snapshot = IBRIBSnapshot(snapshot);
    }

    /**
     * @dev Claim the airdrop. Transfers 100 BRIB tokens to msg.sender, only if:
     * - they qualify for the airdrop
     * - they have not yet been sent tokens
     */
    function claim() public {
        require(qualifies(), "sender qualifies for the airdrop");
        require(!alreadyClaimed(), "sender has not already claimed airdrop");
        require(
            _BRIBToken.balanceOf(address(this)) >= AIRDROP_AMOUNT,
            "airdrop contract holds sufficient BRIB token balance"
        );

        _recordClaim();
        _BRIBToken.safeTransfer(msg.sender, AIRDROP_AMOUNT);
    }

    /**
     * @dev Determine whether the sender qualifies for the airdrop.
     */
    function qualifies() public view returns (bool) {
        return _snapshot.isHolder(msg.sender);
    }

    /**
     * @dev Record that the sender has claimed the airdrop.
     */
    function _recordClaim() private {
        _claims[msg.sender] = true;
    }

    /**
     * @dev Check if tokens were already claimed by the given address.
     */
    function alreadyClaimed() public view returns (bool) {
        return _claims[msg.sender];
    }
}
