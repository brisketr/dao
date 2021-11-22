<script lang="ts">
	import Router from "svelte-spa-router";
	import Airdrop202107 from "./airdrop/Airdrop202107.svelte";
	import Suggested from "./contributions/Suggested.svelte";
	import DevConsole from "./dev/DevConsole.svelte";
	import Home from "./Home.svelte";
	import Nav from "./Nav.svelte";
	import Description from "./token/Description.svelte";
	import Token from "./token/Token.svelte";
	import Mint from "./treasury/Mint.svelte";
	import Treasury from "./treasury/Treasury.svelte";
	import { contract } from "./web3/stores";

	const routes = {
		"/": Home,
		"/dev": DevConsole,
		"/treasury": Treasury,
		"/mint": Mint,
		"/token": Token,
		"/token/description": Description,
		"/airdrop/202107": Airdrop202107,
		"/contributions/suggested": Suggested,
	};

	$: {
		if ($contract && $contract.BRIBAirdrop202107) {
			$contract.BRIBAirdrop202107;
		}
	}
</script>

<Nav />

<main>
	<Router {routes} />
	<p>&nbsp;</p>
</main>
