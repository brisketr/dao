<script lang="ts">
	import { BigNumber } from "ethers";
	import { push } from "svelte-spa-router";
	import { address, connected } from "../../../web3/stores";
	import { formatBigNumber } from "../../../web3/util/format";
	import type { Staker } from "../exchange_contract";
	import type { EthersExchangeContract } from "../exchange_contract_ethers";
	import { eventCount, exchangeContractGenesis, ipfs } from "../stores";
	import { formattedTimeUntilUnlock } from "../unlock_countdown";

	let numStakers = 0;
	let maxStakers = 0;
	let tvl = "";
	let position = 0;
	let minStake = "";
	let userStake = "";

	async function updateOnChainInfo(
		address: string,
		ipfs: any,
		infoEx: EthersExchangeContract
	) {
		const topStakers: Staker[] = await infoEx.topStakers();
		numStakers = topStakers.length;
		maxStakers = await infoEx.contract().TOP_STAKER_COUNT();
		minStake = formatBigNumber(await infoEx.minStake(), 0, 0);

		const userStaker = topStakers.find((s) => s.address === address);

		/**
		 * Compute TVL: sum of BRIB staked for all top stakers.
		 */
		tvl = formatBigNumber(
			topStakers.reduce((acc, s) => acc.add(s.staked), BigNumber.from(0)),
			0,
			0
		);

		if (userStaker) {
			userStake = formatBigNumber(userStaker.staked, 0, 0);

			/**
			 * Compute position as index of user staker in topStakers sorted by
			 * staked amount.
			 */
			position =
				topStakers.length -
				topStakers.findIndex((s) => s.address === address);
		} else {
			userStake = "0";
			position = 0;
		}
	}

	$: {
		if ($connected && $exchangeContractGenesis != null) {
			console.log(
				`Updating on-chain info; Event count is ${$eventCount}`
			);

			updateOnChainInfo($address, $ipfs, $exchangeContractGenesis);
		}
	}

	function stake() {
		push("/brie/stake");
	}

	function unstake() {
		push("/brie/unstake");
	}

	function access() {
		push("/brie/exchange");
	}
</script>

<table class="ui">
	<tr>
		<td># of Stakers</td>
		<td class="number">{numStakers}/{maxStakers}</td>
	</tr>

	<tr>
		<td>TVL (BRIB)</td>
		<td class="number">{tvl}</td>
	</tr>

	<tr>
		<td>Minimum to Stake (BRIB)</td>
		<td class="number">{minStake}</td>
	</tr>

	{#if parseInt(userStake) > 0}
		<tr>
			<td>Your Stake (BRIB)</td>
			<td class="number">{userStake}</td>
		</tr>

		<tr>
			<td>Your Stake Position</td>
			<td class="number">{position}/{maxStakers}</td>
		</tr>

		<tr>
			<td>Time Until Unlock</td>
			<td class="number">{$formattedTimeUntilUnlock}</td>
		</tr>
	{/if}
</table>

{#if parseInt(userStake) > 0}
	<p><button on:click={unstake}>👋 Unstake</button></p>
{/if}

<p><button on:click={stake}>🥩 Stake</button></p>
<p><button on:click={access}>📒 Access Exchange</button></p>

<style>
	button {
		margin: 0;
	}
</style>
