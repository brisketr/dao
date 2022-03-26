<script lang="ts">
	import type { BRIBToken } from "@brisket-dao/core";
	import { BigNumber, ethers } from "ethers";
	import { onMount } from "svelte";
	import { push } from "svelte-spa-router";
	import { address, connected, contract } from "../../../web3/stores";
	import { formatBigNumber } from "../../../web3/util/format";
	import type { EthersExchangeContract } from "../exchange_contract_ethers";
	import { exchangeContractGenesis } from "../stores";

	let minStakeFormatted = "";
	let amount = 0;
	let amountError = "";
	let stakeAmtEl = null;
	let stakeState:
		| "ready"
		| "approval-request"
		| "approval-waiting"
		| "stake-request"
		| "stake-waiting"
		| "staked"
		| "error" = "ready";
	let stakeError = "";
	let approved = false;

	$: infoEx = $exchangeContractGenesis as EthersExchangeContract;
	$: brib = $contract.BRIBToken as BRIBToken;

	$: {
		(async () => {
			if (!$connected || $exchangeContractGenesis == null) {
				return;
			}

			const minStake = await infoEx.minStake();
			minStakeFormatted = formatBigNumber(minStake, 0, 0);

			const stakeAmt: BigNumber = ethers.utils.parseUnits(
				amount.toString(),
				18
			);

			approved =
				(await brib.allowance($address, infoEx.contract().address)) >=
				stakeAmt;
		})();
	}

	$: {
		if (amount < parseFloat(minStakeFormatted)) {
			amountError = `Minimum stake is ${minStakeFormatted}.`;
		} else if (amount == 0 || !amount) {
			amountError = "Amount must be greater than 0.";
		} else {
			amountError = "";
		}
	}

	function retry() {
		stakeState = "ready";
		stakeError = "";
	}

	async function stake() {
		const stakeAmt: BigNumber = ethers.utils.parseUnits(
			amount.toString(),
			18
		);

		if (!approved) {
			stakeState = "approval-request";

			try {
				const approveTx = await brib.approve(
					infoEx.contract().address,
					stakeAmt
				);

				stakeState = "approval-waiting";

				try {
					approveTx.wait();
				} catch (e) {
					stakeState = "error";
					stakeError = "Error waiting for approve tx.";
					console.error(stakeError, e);
				}
			} catch (e) {
				stakeState = "error";
				stakeError = "Error requesting approval.";
				console.error(stakeError, e);
			}
		}

		try {
			stakeState = "stake-request";
			const stakeTx = await infoEx.contract().stake($address, stakeAmt);
			stakeState = "stake-waiting";

			try {
				stakeTx.wait();
				stakeState = "staked";

				push("/brie");
			} catch (e) {
				stakeState = "error";
				stakeError = "Error waiting for stake tx.";
				console.error(stakeError, e);
			}
		} catch (e) {
			stakeState = "error";
			stakeError = "Error requesting stake.";
			console.error(stakeError, e);
		}
	}

	onMount(() => {
		// Select the amount to stake.
		stakeAmtEl.focus();
		stakeAmtEl.select();
	});
</script>

<h2>Genesis Exchange - Stake</h2>

<table class="ui">
	<tr>
		<td>Minimum to Stake (BRIB)</td>
		<td class="number">{minStakeFormatted}</td>
	</tr>

	<tr>
		<td>Amount (BRIB)</td>
		<td class="input number">
			<input
				type="number"
				bind:value={amount}
				min="0"
				inputmode="numeric"
				bind:this={stakeAmtEl}
				disabled={stakeState != "ready"}
			/>
			{#if amountError}
				<div class="error">{amountError}</div>
			{/if}
		</td>
	</tr>

	{#if stakeError}
		<tr>
			<td />
			<td class="error">
				<p class="error">{stakeError}</p>
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
					on:click={stake}
					disabled={stakeState != "ready" || !!amountError}
				>
					{#if stakeState == "ready"}
						{#if approved}
							Stake
						{:else}
							Request Approval
						{/if}
					{:else if stakeState == "approval-request"}
						Requesting Approval...
					{:else if stakeState == "approval-waiting"}
						Waiting for Approval Transaction...
					{:else if stakeState == "stake-request"}
						Staking...
					{:else if stakeState == "stake-waiting"}
						Waiting for Stake Transaction...
					{:else if stakeState == "staked"}
						Staked
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
