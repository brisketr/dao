<script lang="ts">
	import { push } from "svelte-spa-router";
	import { address, connected } from "../../../web3/stores";
	import { formatBigNumber } from "../../../web3/util/format";
	import type { Staker } from "../exchange_contract";
	import type { EthersExchangeContract } from "../exchange_contract_ethers";
	import { exchangeContractGenesis, ipfs } from "../stores";

	let nodeId = "";
	let numStakers = 0;
	let maxStakers = 0;
	let minStake = "";
	let userStake = "";

	$: {
		(async () => {
			if (!$connected || $exchangeContractGenesis == null) {
				return;
			}

			nodeId = (await $ipfs.id()).id;

			const infoEx: EthersExchangeContract = $exchangeContractGenesis;

			const topStakers: Staker[] = await infoEx.topStakers();
			numStakers = topStakers.length;
			maxStakers = await infoEx.contract().TOP_STAKER_COUNT();
			minStake = formatBigNumber(await infoEx.minStake(), 0, 0);

			const userStaker = topStakers.find((s) => s.address === $address);

			if (userStaker) {
				userStake = formatBigNumber(userStaker.staked, 0, 0);
			} else {
				userStake = "0";
			}
		})();
	}

	function stake() {
		push("/brie/stake");
	}
</script>

<table class="ui">
	<tr>
		<td>Node ID</td>
		<td class="number wrap">{nodeId}</td>
	</tr>

	<tr>
		<td># of Stakers</td>
		<td class="number">{numStakers}/{maxStakers}</td>
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
		<td class="input">
			<button on:click={stake}>Stake</button>
		</td>
	</tr>
</table>
