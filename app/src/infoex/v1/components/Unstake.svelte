<script lang="ts">
	import type { BRIBToken } from "@brisket-dao/core";
	import { BigNumber, ethers } from "ethers";
	import { onMount } from "svelte";
	import { push } from "svelte-spa-router";
	import { address, connected, contract } from "../../../web3/stores";
	import { formatBigNumber } from "../../../web3/util/format";
	import type { EthersExchangeContract } from "../exchange_contract_ethers";
	import { exchangeContractGenesis } from "../stores";

	let maxUnstakeFormatted = "";
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
	$: brib = $contract.BRIBToken as BRIBToken;

	$: {
		(async () => {
			if (!$connected || $exchangeContractGenesis == null) {
				return;
			}

			const maxUnstake = await infoEx.contract().stakedBalance($address);
			maxUnstakeFormatted = formatBigNumber(maxUnstake, 0, 0);
		})();
	}

	$: {
		if (amount > parseFloat(maxUnstakeFormatted)) {
			amountError = `Maximum that can be unstaked is ${maxUnstakeFormatted}.`;
		} else if (amount == 0 || !amount) {
			amountError = "Amount must be greater than 0.";
		} else {
			amountError = "";
		}
	}

	function retry() {
		unstakeState = "ready";
		unstakeError = "";
	}

	function setMax() {
		amount = parseFloat(maxUnstakeFormatted);
	}

	async function unstake() {
		const stakeAmt: BigNumber = ethers.utils.parseUnits(
			amount.toString(),
			18
		);

		try {
			unstakeState = "unstake-request";
			const stakeTx = await infoEx.contract().unstake(stakeAmt);
			unstakeState = "unstake-waiting";

			try {
				stakeTx.wait();
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

<h2>Genesis Exchange - Unstake</h2>

<table class="ui">
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
		<td class="input number">
			<input
				type="number"
				bind:value={amount}
				min="0"
				inputmode="numeric"
				bind:this={unstakeAmtEl}
				disabled={unstakeState != "ready"}
			/>
			{#if amountError}
				<div class="error">{amountError}</div>
			{/if}
		</td>
	</tr>

	{#if unstakeError}
		<tr>
			<td />
			<td class="error">
				<p class="error">{unstakeError}</p>
				<p>
					<a href={window.location.toString()} on:click={retry}
						>Retry</a
					>
				</p>
			</td>
		</tr>
	{:else}
		<tr>
			<td />
			<td class="input">
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
			</td>
		</tr>
	{/if}
</table>

<style>
	td.error {
		text-align: center;
	}

	td.error .error {
		margin: 0;
	}

	td.input .error {
		padding: 1em;
		padding-top: 0;
	}
</style>
