<script lang="ts">
	import Router from "svelte-spa-router";
	import Airdrop202107 from "./airdrop/Airdrop202107.svelte";
	import Claim from "./airdrop/signdrop/Claim.svelte";
	import Create from "./airdrop/signdrop/Create.svelte";
	import Suggested from "./contributions/Suggested.svelte";
	import DevConsole from "./dev/DevConsole.svelte";
	import Home from "./Home.svelte";
	import Nav from "./Nav.svelte";
	import Ipfs from "./debug/Ipfs.svelte";
	import Description from "./token/Description.svelte";
	import Token from "./token/Token.svelte";
	import Mint from "./treasury/Mint.svelte";
	import Treasury from "./treasury/Treasury.svelte";
	import { contract } from "./web3/stores";
	import InfoEx from "./infoex/v1/components/InfoEx.svelte";

	const routes = {
		"/": Home,
		"/dev": DevConsole,
		"/treasury": Treasury,
		"/mint/:recipient?/:amount?": Mint,

		"/token": Token,
		"/token/description": Description,

		"/brie": InfoEx,
		"/brie/*": InfoEx,

		"/airdrop/202107": Airdrop202107,
		"/airdrop/signdrop/create": Create,
		"/airdrop/signdrop/claim/:contractAddress/:airdropPrivateKey": Claim,

		"/contributions/suggested": Suggested,

		"/debug/ipfs": Ipfs,
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
