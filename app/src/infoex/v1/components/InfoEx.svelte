<script lang="ts">
	import Router from "svelte-spa-router";
	import { connected } from "../../../web3/stores";
	import { connect } from "../connect.js";
	import { identity, ipfsConnected, ipfsConnecting, locked } from "../stores";
	import Dashboard from "./Dashboard.svelte";
	import Stake from "./Stake.svelte";
	import Unstake from "./Unstake.svelte";
	import Welcome from "./Welcome.svelte";

	const prefix = "/brie";
	const routes = {
		"/": Dashboard,
		"/stake": Stake,
		"/unstake": Unstake,
	};

	$: {
		if (
			!$locked &&
			$identity &&
			$ipfsConnected === false &&
			$ipfsConnecting == false
		) {
			connect();
		}
	}
</script>

<div id="ui">
	<h1>Brie</h1>

	{#if !$connected}
		<p>Please connect your wallet.</p>
	{:else if $ipfsConnecting}
		<p>Connecting to IPFS...</p>
	{:else if $locked}
		<Welcome />
	{:else if !$ipfsConnected}
		<p>IPFS is not connected.</p>
	{:else}
		<Router {routes} {prefix} />
	{/if}
</div>
