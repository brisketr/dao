<script lang="ts">
	import { ethers } from "ethers";

	import { contract, ethersProvider } from "../web3/stores";

	let address = "";
	let totalSupply = new Promise<string>(() => "");

	$: {
		if ($contract && $contract.BRIBToken) {
			address = $contract.BRIBToken.address;

			totalSupply = $contract.BRIBToken.totalSupply().then(
				(totalSupply) =>
					ethers.utils.commify(
						ethers.utils.formatUnits(totalSupply, 18)
					)
			);
		}
	}

	let hasMetamask = window.ethereum ? true : false;

	function addTokenToMetamask() {
		if (hasMetamask) {
			window.ethereum.request({
				method: "wallet_watchAsset",
				params: {
					type: "ERC20",
					options: {
						address: $contract.BRIBToken.address,
						symbol: "BRIB",
						decimals: 18,
						// image: tokenImage,
					},
				},
			});
		} else {
			console.warn("cannot add token because no metamask");
		}
		
	}
</script>

<div id="ui">
	<h1>BRIB Token</h1>
	<table>
		<tr>
			<td>Contract Address</td>
			<td class="number">{address}</td>
		</tr>
		<tr>
			<td>Total Supply</td>
			<td class="number">
				{#await totalSupply then value}
					{value}
				{/await}
			</td>
		</tr>
		{#if hasMetamask}
			<tr>
				<td>Add to MetaMask</td>
				<td class="number">
					<button on:click={addTokenToMetamask}> Add </button>
				</td>
			</tr>
		{/if}
		<tr>
			<td>Trade</td>
			<td class="number">
				<a href="#">Trader Joe</a>
			</td>
		</tr>
	</table>
</div>

<style>
	table td {
		border-collapse: collapse;
		border: 1px solid white;
		padding: 1em;
	}

	button {
		margin: 0;
		width: 50%;
	}
</style>
