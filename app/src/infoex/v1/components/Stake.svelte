<script lang="ts">
	import type { BRIBToken } from "@brisket-dao/core";
	import { BigNumber, ethers } from "ethers";
	import { onMount } from "svelte";
	import { push } from "svelte-spa-router";
	import {
		address,
		connected,
		contract,
		tokenBalanceBRIB,
	} from "../../../web3/stores";
	import { formatBigNumber } from "../../../web3/util/format";
	import type { EthersExchangeContract } from "../exchange_contract_ethers";
	import { exchangeContractGenesis } from "../stores";

	let minStake = BigNumber.from(0);
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

			minStake = await infoEx.minStake();
			minStakeFormatted = formatBigNumber(minStake, 0, 0);

			if (amount !== null) {
				const stakeAmt: BigNumber = ethers.utils.parseUnits(
					amount.toString(),
					18
				);

				approved =
					(await brib.allowance(
						$address,
						infoEx.contract().address
					)) >= stakeAmt;
			}
		})();
	}

	$: {
		if (
			amount !== null &&
			ethers.utils.parseUnits(amount.toString(), 18).lt(minStake)
		) {
			amountError = `Minimum stake is ${minStakeFormatted}.`;
		} else if (amount == 0 || !amount) {
			amountError = "Amount must be greater than 0.";
		} else if (
			ethers.utils.parseUnits(amount.toString(), 18).gt($tokenBalanceBRIB)
		) {
			amountError = `Insufficient BRIB balance.`;
		} else {
			amountError = "";
		}
	}

	function retry() {
		stakeState = "ready";
		stakeError = "";
	}

	async function requestApproval() {
		const stakeAmt: BigNumber = ethers.utils.parseUnits(
			amount.toString(),
			18
		);

		stakeState = "approval-request";

		try {
			const approveTx = await brib.approve(
				infoEx.contract().address,
				stakeAmt
			);

			stakeState = "approval-waiting";

			try {
				await approveTx.wait();
				approved = true;
				stakeState = "ready";
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

	async function stake() {
		const stakeAmt: BigNumber = ethers.utils.parseUnits(
			amount.toString(),
			18
		);

		try {
			stakeState = "stake-request";
			const stakeTx = await infoEx.contract().stake($address, stakeAmt);
			stakeState = "stake-waiting";

			try {
				await stakeTx.wait();
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

	async function stakeOrApprove() {
		if (approved) {
			stake();
		} else {
			requestApproval();
		}
	}

	onMount(() => {
		// Select the amount to stake.
		stakeAmtEl.focus();
		stakeAmtEl.select();
	});
</script>

<h2>🥩 Genesis Exchange - Stake</h2>

<p>
	[ 🖩 <a href="/#/brie">Dashboard</a> ]
</p>

<p>
	Please note that when you stake BRIB, you will be <strong>locking</strong>
	your <strong>BRIB</strong> for <strong>one week</strong>.
</p>

<table class="ui">
	<tr>
		<td>Minimum to Stake (BRIB)</td>
		<td class="number">{minStakeFormatted}</td>
	</tr>

	<tr>
		<td>Amount (BRIB)</td>
		<td>
			<input
				type="number"
				bind:value={amount}
				min="0"
				inputmode="numeric"
				bind:this={stakeAmtEl}
				disabled={stakeState != "ready"}
			/>
			{#if amountError}
				<p class="error">{amountError}</p>
			{/if}
			{#if stakeError}
				<p class="error">
					{stakeError}
					<a href={window.location.toString()} on:click={retry}
						>Acknowledge</a
					>
				</p>
			{:else}
				<button
					on:click={stakeOrApprove}
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
			{/if}
		</td>
	</tr>
</table>
