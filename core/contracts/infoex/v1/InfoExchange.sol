// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract InfoExchange {
    using SafeERC20 for IERC20;

    IERC20 private _token;

    uint8 public constant TOP_STAKER_COUNT = 20;

    mapping(address => uint256) private _stakedBalance;
    mapping(address => uint256) private _stakedTimestamps;
    mapping(address => string) private _cids;
    address[TOP_STAKER_COUNT] private _topStakers;

    constructor(address Token) {
        _token = IERC20(Token);
    }

    /**
     * @dev Stake tokens. Transfer Token from the staker to the contract and
     * update balances.
     */
    function stake(address staker, uint256 amount) public {
        console.log("staking %s tokens from %s", amount, staker);
        require(staker != address(0), "staker address cannot be 0");
        require(amount > 0, "amount must be greater than 0");
        require(amount <= _token.balanceOf(staker), "staker does not have enough of the staking token");

        // Verify amount has been approved to transfer.
        require(_token.allowance(staker, address(this)) >= amount, "allowance not enough");

        console.log("transferring %s token to %s", amount, address(this));
        _token.safeTransferFrom(staker, address(this), amount);
        _stakedBalance[staker] += amount;

        // Update top stakers.
        console.log("updating top stakers");
        updateTopStakers(staker);

        // Update staked timestamp.
        _stakedTimestamps[staker] = block.timestamp;

        // Emit stake event.
        emit Staked(staker, amount);
    }

    /**
     * @dev Unstake tokens. Transfer Token from the contract to the staker and
     * update balances.
     */
    function unstake(address staker, uint256 amount) public {
        require(staker != address(0), "staker address cannot be the zero address");
        require(amount > 0, "amount must be greater than 0");
        require(amount <= _stakedBalance[staker], "amount must be less than or equal to the staked balance");

        // Require that a week has passed since staking.
        require(block.timestamp - _stakedTimestamps[staker] >= 3600 * 24 * 7, "must stake for at least a week");

        _token.safeTransfer(staker, amount);
        _stakedBalance[staker] -= amount;

        if (_stakedBalance[staker] == 0) {
            // Remove staker from top stakers.
            for (uint8 i = 0; i < TOP_STAKER_COUNT; i++) {
                if (_topStakers[i] == staker) {
                    _topStakers[i] = address(0);

                    for (uint8 j = i; j > 0; j--) {
                        _topStakers[j] = _topStakers[j - 1];
                        _topStakers[j - 1] = address(0);
                    }
                }
            }
        } else {
            updateTopStakers(staker);
        }

        // Emit unstake event.
        emit Unstaked(staker, amount);
    }

    /**
     * @dev Get the staked balance of a staker.
     */
    function stakedBalance(address staker) public view returns (uint256) {
        return _stakedBalance[staker];
    }

    /**
     * @dev Get the top N stakers.
     */
    function topStakers() public view returns (address[TOP_STAKER_COUNT] memory) {
        return _topStakers;
    }

    /**
     * @dev Returns minimum amount required to enter top stakers.
     */
    function minStake() public view returns (uint256) {
        // If any top staker is address(0), then the minimum stake is 1.
        for (uint8 i = 0; i < TOP_STAKER_COUNT; i++) {
            if (_topStakers[i] == address(0)) {
                return 1;
            }
        }

        // Otherwise, the minimum stake is one more than the staked balance of
        // the lowest staker.
        uint256 min = _stakedBalance[_topStakers[TOP_STAKER_COUNT - 1]];

        for (uint8 i = 0; i < TOP_STAKER_COUNT; i++) {
            if (_topStakers[i] == address(0)) {
                continue;
            }

            min = _stakedBalance[_topStakers[i]] + 1;
            break;
        }

        return min;
    }

    /**
     * @dev Returns true if the exchange is full.
     */
    function isFull() public view returns (bool) {
        for (uint8 i = 0; i < TOP_STAKER_COUNT; i++) {
            if (_topStakers[i] == address(0)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @dev Returns the amount of time left until the lowest staker can be
     * evicted.
     */
    function timeUntilEvict() public view returns (uint256) {
        uint8 lowestStakerIndex = 0;

        // Find index of lowest staked balance.
        for (uint8 i = 0; i < TOP_STAKER_COUNT; i++) {
            if (_topStakers[i] == address(0)) {
                continue;
            }

            lowestStakerIndex = i;
            break;
        }
        
        uint evictTime = (_stakedTimestamps[_topStakers[lowestStakerIndex]] + 60 * 60 * 24 * 7);

        if (evictTime > block.timestamp) {
            return evictTime - block.timestamp;
        } else {
            return 0;
        }
    }

    /**
     * @dev Updates the top stakers based on new staking address and amount. If
     * a staker is evicted from the top stakers, then unstake the old
     * staker. Only evict the lowest staker if any need to be evicted.
     *
     * _topStakers must always be sorted by staked balance from lowest to
     * highest.
     */
    function updateTopStakers(address staker) internal {
        uint8 lowestStakerIndex = 0;

        // If _topStakers is full then unstake the lowest staker.
        if (_topStakers[0] != address(0)) {
            require(
                _stakedBalance[staker] > _stakedBalance[_topStakers[0]],
                "staker must have higher staked balance than the lowest staker"
            );

            console.log("unstaking lowest staker: %s", _topStakers[0]);
            emit EvictStaker(_topStakers[0]);
            unstake(_topStakers[0], _stakedBalance[_topStakers[0]]);
        } else {
            // Find index of lowest staked balance.
            for (uint8 i = 0; i < TOP_STAKER_COUNT; i++) {
                if (_topStakers[i] == address(0)) {
                    continue;
                }

                lowestStakerIndex = i;
                break;
            }
        }

        // If staker is already in top stakers, then remove it.
        for (uint8 i = 0; i < TOP_STAKER_COUNT; i++) {
            if (_topStakers[i] == staker) {
                _topStakers[i] = address(0);

                for (uint8 j = i; j > 0; j--) {
                    _topStakers[j] = _topStakers[j - 1];
                    _topStakers[j - 1] = address(0);
                }
            }
        }

        // Insert staker into top stakers.
        bool stakerInserted = false;

        if (_topStakers[TOP_STAKER_COUNT - 1] == address(0)) {
            _topStakers[TOP_STAKER_COUNT - 1] = staker;
            stakerInserted = true;
        } else {
            for (uint8 i = TOP_STAKER_COUNT - 1; i > 0; i--) {
                if (_stakedBalance[staker] > _stakedBalance[_topStakers[i]]) {
                    for (uint8 j = 0; j < i; j++) {
                        _topStakers[j] = _topStakers[j + 1];
                        _topStakers[j + 1] = address(0);
                    }

                    _topStakers[i] = staker;
                    stakerInserted = true;
                    break;
                }
            }
        }

        // Verify that staker was inserted.
        require(stakerInserted, "staker was not inserted into top stakers");
    }

    /**
     * @dev Get the CID of a staker.
     */
    function cid(address staker) public view returns (string memory) {
        return _cids[staker];
    }

    /**
     * @dev Register the CID of a staker.
     */
    function registerCid(string memory newCid) public {
        _cids[msg.sender] = newCid;
    }

    /**
     * @dev Emitted when the lowest staker is evicted.
     */
    event EvictStaker(address staker);

    /**
     * @dev Emitted when Token is staked.
     */
    event Staked(address indexed staker, uint256 amount);

    /**
     * @dev Emitted when Token is unstaked.
     */
    event Unstaked(address indexed staker, uint256 amount);
}
