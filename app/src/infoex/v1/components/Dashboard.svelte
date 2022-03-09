<script lang="ts">
	import { onMount } from "svelte";
	import { push } from "svelte-spa-router";
	import { connected, contract } from "../../../web3/stores.js";
	import type { InfoDoc } from "../cipher_doc.js";
	import { connect } from "../connect.js";
	import { EthersExchangeContract } from "../exchange_contract_ethers.js";
	import { infoDocs } from "../exchange_group";
	import {
exchangeContractGenesis,
		globalData,
		identity,
		ipfs,
		ipfsConnected,
		ipfsConnecting,
		locked,
	} from "../stores";
	import StakingDetails from "./StakingDetails.svelte";

	let nodeId = "";
	let docs: Map<string, InfoDoc> = new Map();

	$: {
		if ($ipfsConnected) {
			$ipfs.id().then((id: any) => (nodeId = id.id));
		}
	}

	$: {
		if ($connected && $ipfsConnected && !$locked && $exchangeContractGenesis) {
			infoDocs(crypto, $globalData, $exchangeContractGenesis, $identity).then(
				(d) => (docs = d)
			);
		}
	}

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

	onMount(async () => {
		if (!$connected || $locked) {
			push("/brie/welcome");
			return;
		}
	});
</script>

<h2>Genesis Exchange - Dashboard</h2>

<StakingDetails {nodeId} />
