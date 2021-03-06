<script lang="ts">
	import { BigNumber, ethers } from "ethers";
	import { onMount } from "svelte";
	import { push } from "svelte-spa-router";
	import { address, connected } from "../../../web3/stores";
	import { formatBigNumber } from "../../../web3/util/format";
	import type { EthersExchangeContract } from "../exchange_contract_ethers";
	import { exchangeContractGenesis } from "../stores";
	import {
		formattedTimeUntilUnlock,
		timeUntilUnlock,
	} from "../unlock_countdown";

	let maxUnstakeFormatted = "";
	let maxUnstake = BigNumber.from(0);
	let amount = 0;
	let amountError = "";
	let unstakeAmtEl = null;
	let unstakeState:
		| "ready"
		| "unstake-request"
		| "unstake-waiting"
		| "unstaked"
		| "error" = "ready";
	let unstakeError = "";

	$: infoEx = $exchangeContractGenesis as EthersExchangeContract;

	/**
	 * Update on chain data.
	 */
	$: {
		(async () => {
			if (!$connected || $exchangeContractGenesis == null) {
				return;
			}

			maxUnstake = await infoEx.contract().stakedBalance($address);
			maxUnstakeFormatted = formatBigNumber(maxUnstake, 0, 0);
		})();
	}

	/**
	 * Validate form values.
	 */
	$: {
		if (
			amount !== null &&
			ethers.utils.parseUnits(amount.toString(), 18).gt(maxUnstake)
		) {
			amountError = `Maximum that can be unstaked is ${maxUnstakeFormatted}.`;
		} else if (amount == 0 || !amount) {
			amountError = "Amount must be greater than 0.";
		} else if ($timeUntilUnlock > 0) {
			amountError = `Cannot unstake until ${$formattedTimeUntilUnlock} from now.`;
		} else {
			amountError = "";
		}
	}

	function retry() {
		unstakeState = "ready";
		unstakeError = "";
	}

	function setMax() {
		amount = parseFloat(ethers.utils.formatUnits(maxUnstake, 18))
	}

	async function unstake() {
		const stakeAmt: BigNumber = ethers.utils.parseUnits(
			amount.toString(),
			18
		);

		try {
			unstakeState = "unstake-request";
			const unstakeTx = await infoEx.contract().unstake(stakeAmt);
			unstakeState = "unstake-waiting";

			try {
				unstakeTx.wait();
				unstakeState = "unstaked";

				push("/brie");
			} catch (e) {
				unstakeState = "error";
				unstakeError = "Error waiting for stake tx.";
				console.error(unstakeError, e);
			}
		} catch (e) {
			unstakeState = "error";
			unstakeError = "Error requesting stake.";
			console.error(unstakeError, e);
		}
	}

	onMount(() => {
		// Select the amount to unstake.
		unstakeAmtEl.focus();
		unstakeAmtEl.select();
	});
</script>

<h2>👋 Genesis Exchange - Unstake</h2>

<p>
	[ 🖩 <a href="/#/brie">Dashboard</a> ]
</p>

<table class="ui">
	<tr>
		<td>Time Until Unlock</td>
		<td class="number">{$formattedTimeUntilUnlock}</td>
	</tr>

	<tr>
		<td>Maximum Unstakable (BRIB)</td>
		<td class="number">
			<a href={window.location.toString()} on:click={setMax}
				>{maxUnstakeFormatted}</a
			>
		</td>
	</tr>

	<tr>
		<td>Amount (BRIB)</td>
		<td>
			<input
				type="number"
				bind:value={amount}
				min="0"
				inputmode="numeric"
				bind:this={unstakeAmtEl}
				disabled={unstakeState != "ready"}
			/>
			{#if amountError}
				<p class="error">{amountError}</p>
			{/if}

			{#if unstakeError}
				<p class="error">
					{unstakeError}
					<a href={window.location.toString()} on:click={retry}
						>Acknowledge</a
					>
				</p>
			{:else}
				<button
					on:click={unstake}
					disabled={unstakeState != "ready" || !!amountError}
				>
					{#if unstakeState == "ready"}
						Unstake
					{:else if unstakeState == "unstake-request"}
						Staking...
					{:else if unstakeState == "unstake-waiting"}
						Waiting for Unstake Transaction...
					{:else if unstakeState == "unstaked"}
						Unstaked
					{:else}
						Error
					{/if}
				</button>
			{/if}
		</td>
	</tr>
</table>
