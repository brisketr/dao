<script lang="ts">
	import { ethers } from "ethers";

	import {
		connected,
		contract,
		ethersProvider,
		tokenBalanceBRIB,
	} from "../web3/stores";

	let address = "";
	let totalSupply = "";
	let bribPrice = "";
	let marketCap = "";
	let bribValue = "";
	let formattedTokenBalanceBRIB = "";

	$: {
		if ($contract && $contract.BRIBToken && $contract.MIMBRIBJoePair) {
			address = $contract.BRIBToken.address;

			(async () => {
				const totalSupplyFloat = parseFloat(
					ethers.utils.formatUnits(
						await $contract.BRIBToken.totalSupply(),
						18
					)
				);

				//  Set supply promise formatted with commas and four decimal places.
				totalSupply = totalSupplyFloat.toLocaleString("en-US", {
					maximumFractionDigits: 4,
					minimumFractionDigits: 4,
				});

				const pair = $contract.MIMBRIBJoePair;

				// MIM is token0
				// BRIB is token1

				// Log token addresses
				const token0address = await pair.token0();
				console.log(`token0address: ${token0address}`);

				const token1address = await pair.token1();
				console.log(`token1address: ${token1address}`);

				// Get reserves for each token
				const reserves = await pair.getReserves();

				const reserve0 = ethers.utils.formatUnits(
					reserves.reserve0,
					18
				);

				const reserve1 = ethers.utils.formatUnits(
					reserves.reserve1,
					18
				);

				// Log reserves for each token.
				console.log(`reserve0: ${reserve0}`);
				console.log(`reserve1: ${reserve1}`);

				// Price is (float)reserve0 / (float)reserve1. A simple
				// point-in-time calculation is fine for our purposes.

				// Convert reserves to float.
				const reserve0Float = parseFloat(reserve0);
				const reserve1Float = parseFloat(reserve1);

				// Calculate the price.
				const priceFloat = reserve0Float / reserve1Float;

				console.log(`price: ${priceFloat}`);

				// Set the price promise formatted with commas and 4 decimal places.
				bribPrice = priceFloat.toLocaleString("en-US", {
					maximumFractionDigits: 4,
					minimumFractionDigits: 4,
				});

				const bribBalanceFloat = parseFloat(
					ethers.utils.formatUnits($tokenBalanceBRIB, 18)
				);

				// User's value is their BRIB balance times the price.
				const bribValueFloat = bribBalanceFloat * priceFloat;

				// Set the value promise formatted with commas and 4 decimal places.
				bribValue = bribValueFloat.toLocaleString("en-US", {
					maximumFractionDigits: 4,
					minimumFractionDigits: 4,
				});

				formattedTokenBalanceBRIB = parseFloat(
					ethers.utils.formatUnits($tokenBalanceBRIB, 18)
				).toLocaleString("en-US", {
					maximumFractionDigits: 4,
					minimumFractionDigits: 4,
				});

				// Market cap is total supply * price.
				const marketCapFloat = totalSupplyFloat * priceFloat;

				// Set the market cap promise formatted with commas and 4 decimal places.
				marketCap = marketCapFloat.toLocaleString("en-US", {
					maximumFractionDigits: 4,
					minimumFractionDigits: 4,
				});
			})();
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
	{#if !$connected}
		<p>You must be connected to web3 to view token information.</p>
	{:else}
		<table>
			{#if hasMetamask}
				<tr>
					<td>Add to MetaMask</td>
					<td class="number">
						<button on:click={addTokenToMetamask}> Add </button>
					</td>
				</tr>
			{/if}
			<tr>
				<td>Buy/Sell BRIB</td>
				<td class="number">
					<a
						href="https://traderjoexyz.com/#/trade?inputCurrency=0x130966628846bfd36ff31a822705796e8cb8c18d&outputCurrency=0xa1437720c93b791b72f5b8a5846227763792afd7"
						>Trader Joe</a
					>
				</td>
			</tr>
			<tr>
				<td>Contract Address</td>
				<td class="number" id="contact-address">{address}</td>
			</tr>
			<tr>
				<td>Total Supply</td>
				<td class="number">
					{#await totalSupply then value}
						{value}
					{/await}
				</td>
			</tr>
			<tr>
				<td>BRIB Price (MIM)</td>
				<td class="number">
					{#await bribPrice then value}
						{value}
					{/await}
				</td>
			</tr>
			<tr>
				<td>Market Cap (MIM)</td>
				<td class="number">
					{#await marketCap then value}
						{value}
					{/await}
				</td>
			</tr>
			<tr>
				<td>Your BRIB Balance</td>
				<td class="number">
					{formattedTokenBalanceBRIB}
				</td>
			</tr>
			<tr>
				<td>Your BRIB Value (MIM)</td>
				<td class="number">
					{#await bribValue then value}
						{value}
					{/await}
				</td>
			</tr>
		</table>
	{/if}
</div>

<style>
	table {
		table-layout: fixed;
	}

	table td {
		border-collapse: collapse;
		border: 1px solid white;
		padding: 1em;
	}

	/* Make first column in table 150px wide */
	table td:first-child {
		width: 200px;
	}

	button {
		margin: 0;
		width: 50%;
	}

	#contact-address {
		overflow-wrap: break-word;
	}
</style>
