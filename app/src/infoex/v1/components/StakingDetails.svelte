<script lang="ts">
	import { ethers } from "ethers";
	import { push } from "svelte-spa-router";
	import { address, connected } from "../../../web3/stores";
	import type { Staker } from "../exchange_contract";
	import { exchangeContractGenesis } from "../stores";

	export let nodeId = "";

	let numStakers = 0;
	let minStake = "";
	let userStake = "";

	$: {
		(async () => {
			if (!$connected || $exchangeContractGenesis == null) {
				return;
			}

			const topStakers: Staker[] =
				await $exchangeContractGenesis.topStakers();
			numStakers = topStakers.length;

			minStake = parseFloat(
				ethers.utils.formatUnits(
					await $exchangeContractGenesis.minStake(),
					18
				)
			).toLocaleString("en-US", {
				maximumFractionDigits: 0,
				minimumFractionDigits: 0,
			});

			const userStaker = topStakers.find((s) => s.address === $address);

			if (userStaker) {
				userStake = parseFloat(
					ethers.utils.formatUnits(userStaker.staked, 18)
				).toLocaleString("en-US", {
					maximumFractionDigits: 0,
					minimumFractionDigits: 0,
				});
			} else {
				userStake = "0";
			}
		})();
	}

	function stake() {
		push("/brie/stake");
	}
</script>

<table>
	<tr>
		<td>Node ID</td>
		<td class="number wrap">{nodeId}</td>
	</tr>

	<tr>
		<td># of Stakers</td>
		<td class="number">{numStakers}/10</td>
	</tr>

	<tr>
		<td>Minimum to Stake (BRIB)</td>
		<td class="number">{minStake}</td>
	</tr>

	<tr>
		<td>Your Stake (BRIB)</td>
		<td class="number">{userStake}</td>
	</tr>

	<tr>
		<td />
		<td class="number">
			<button on:click={stake}>Stake</button>
		</td>
	</tr>
</table>

<style>
	table {
		table-layout: fixed;
	}

	table td {
		border-collapse: collapse;
		border: 1px solid white;
		padding: 1em;
	}

	td.number {
		text-align: right;
	}

	td.wrap {
		overflow-wrap: break-word;
	}
</style>
