<script lang="ts">
	import { ethers } from "ethers";
	import { connectWeb3 } from "./web3/connect";
	import { NETWORK_METADATA } from "./web3/constants";
	import {
		address,
		connected,
		connecting,
		network,
		tokenBalanceBRIB,
		wrongNetwork,
	} from "./web3/stores";

	let networkName = "Unknown";
	let formattedAddress = "";
	let formattedTokenBalanceBRIB = "";

	$: {
		if ($network) {
			// If network metadata exists for this network, use it.
			if (NETWORK_METADATA[$network.chainId]) {
				networkName = NETWORK_METADATA[$network.chainId].NAME;
			} else {
				console.warn(
					`No network metadata found for network "${$network.chainId}". Using "Unknown".`
				);
			}
		}

		// Format address like "0xAbC0...ZyXz".
		if ($address) {
			formattedAddress = $address.toLowerCase();
			formattedAddress =
				formattedAddress.substring(0, 6) +
				"..." +
				formattedAddress.substring(38);
		}

		formattedTokenBalanceBRIB = parseFloat(
			ethers.utils.formatUnits($tokenBalanceBRIB, 18)
		).toLocaleString("en-US", {
			maximumFractionDigits: 2,
			minimumFractionDigits: 2,
		});
	}

	let hasMetamask = window.ethereum ? true : false;

	async function switchMetamaskNetwork() {
		if (hasMetamask) {
			await window.ethereum.request({
				method: "wallet_switchEthereumChain",
				params: [{ chainId: "0xA86A" }],
			});

			localStorage.setItem("connected", "true");
		} else {
			console.warn("cannot switch network: no metamask");
		}
	}
</script>

<div id="nav">
	<a href="#/">
		<img id="logo" src="brisket-black-br.png" alt="logo" />
	</a>

	{#if $wrongNetwork}
		<div class="nav-item">
			Wrong Network

			{#if hasMetamask}
				(<span id="switch-network" on:click={switchMetamaskNetwork}
					>Switch</span
				>)
			{/if}
		</div>
	{:else if !$connected && !$connecting}
		{#if hasMetamask}
			<button on:click={connectWeb3}>Connect</button>
		{:else}
			<div class="nav-item">
				<a href="https://metamask.io/">MetaMask Required to Connect</a>
			</div>
		{/if}
	{:else if !$connected && $connecting}
		<button disabled>Connecting...</button>
	{:else}
		<div id="account" class="nav-item">
			<div id="account-address">{formattedAddress}</div>
		</div>
		<div class="nav-item">
			{formattedTokenBalanceBRIB} <a href="#/token">BRIB</a>
		</div>
		<div class="nav-item">
			{networkName}
		</div>
	{/if}
</div>

<style>
	/* Nav bar is at top of screen regardless of scroll position. */
	#nav {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 50px;
		background-color: black;
		border-bottom: 1px solid #fff;
		text-align: right;
		z-index: 1;
	}

	#logo {
		height: 30px;
		margin-left: 10px;
		margin-top: 10px;
		float: left;
	}

	#nav button {
		margin: 0;
		width: auto;
		padding: 0;
		padding-left: 1em;
		padding-right: 1em;
		height: 100%;
		border-top: none;
		border-right: none;
		border-bottom: none;
	}

	div.nav-item {
		border-left: 1px solid #fff;
		height: 100%;
		line-height: 50px;
		float: right;
		padding-left: 1em;
		padding-right: 1em;
	}

	#account-address {
		height: 100%;
		display: inline-block;
		vertical-align: middle;
	}

	/* switch network styled like a link */
	#switch-network {
		text-decoration: underline;
		cursor: pointer;
	}
</style>
