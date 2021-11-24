// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @dev Facilitates airdrops to those who control a private key to an address
 * listed as an airdrop address.
 *
 * Inspired by/uses code from
 * https://programtheblockchain.com/posts/2018/02/17/signing-and-verifying-messages-in-ethereum/
 */
contract Signdrop {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 private _BRIBToken;

    // Addresses which can sign to receive airdrop tokens.
    mapping(address => bool) private _airdropAddresses;

    // Addresses that have been used to claim tokens.
    mapping(address => bool) private _usedAddresses;

    // Airdrop amount.
    uint256 private _airdropAmount;

    /**
     * @dev Initialize the contract with the set of addresses to which airdrops are
     * restricted.
     */
    constructor(
        address BRIBToken,
        uint256 amount,
        address[] memory addresses
    ) {
        _BRIBToken = IERC20(BRIBToken);
        _airdropAmount = amount;

        // Record the addresses.
        for (uint256 i = 0; i < addresses.length; i++) {
            _airdropAddresses[addresses[i]] = true;
        }
    }

    /**
     * @dev Get the airdrop amount.
     */
    function getAirdropAmount() public view returns (uint256) {
        return _airdropAmount;
    }

    /**
     * @dev Determine if the given signed message qualifies for the airdrop.
     */
    function qualifies(address addr) public view returns (bool) {
        // Return false if address is not in airdrop addresses.
        return _airdropAddresses[addr];
    }

    /**
     * @dev Determine if the caller has already claimed airdrop tokens.
     */
    function alreadyClaimed(address addr) public view returns (bool) {
        return _usedAddresses[addr];
    }

    /**
     * @dev Transfer BRIBToken to the caller of this function if the
     * supplied signature belongs to one of the airdrop addresses. Only transfer tokens
     * for each address once.
     */
    function claim(address signedToAddress, bytes memory sig) public {
        // Recover signer from signature.
        address signer = recoverSigner(bytes20(signedToAddress), sig);

        console.log("Sender: %s", msg.sender);
        console.log("Signer: %s", signer);

        // Return false if signer is not in airdrop addresses.
        require(_airdropAddresses[signer], "signer must be in airdrop addresses");

        // Return false if signedToAddress is not equal to msg.sender.
        require(msg.sender == signedToAddress, "signed to address must match sender");

        // Return false if signer has already claimed.
        require(!_usedAddresses[signer], "signer must not have already claimed");

        // Require that this contract has enough BRIB to satisfy the claim.
        require(
            _BRIBToken.balanceOf(address(this)) >= _airdropAmount,
            "there must be enough BRIB in airdrop contract to satisfy claim"
        );

        // Record that the signer has claimed.
        _usedAddresses[signer] = true;

        // Transfer tokens to sender.
        _BRIBToken.safeTransfer(msg.sender, _airdropAmount);
    }

    /**
     * @dev Splits signature into r, s, v components.
     */
    function splitSignature(bytes memory sig)
        internal
        pure
        returns (
            uint8,
            bytes32,
            bytes32
        )
    {
        require(sig.length == 65);

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            // first 32 bytes, after the length prefix
            r := mload(add(sig, 32))
            // second 32 bytes
            s := mload(add(sig, 64))
            // final byte (first byte of the next 32 bytes)
            v := byte(0, mload(add(sig, 96)))
        }

        return (v, r, s);
    }

    /**
     * @dev Returns address of signer given message and signature.
     */
    function recoverSigner(bytes20 message, bytes memory sig) internal pure returns (address) {
        uint8 v;
        bytes32 r;
        bytes32 s;

        (v, r, s) = splitSignature(sig);

        bytes memory prefix = "\x19Ethereum Signed Message:\n20";
        bytes32 prefixedProof = keccak256(abi.encodePacked(prefix, message));

        return ecrecover(prefixedProof, v, r, s);
    }
}
