<script lang="ts">
	import { onMount } from "svelte";
import { push } from "svelte-spa-router";
	import { connected, contract } from "../../../web3/stores.js";
	import type { InfoDoc } from "../cipher_doc.js";
	import { connect } from "../connect.js";
	import { EthersExchangeContract } from "../exchange_contract_ethers.js";
	import { infoDocs } from "../exchange_group";
	import {
		globalData,
		identity,
		ipfs,
		ipfsConneced as ipfsConnected,
		ipfsConnecting,
locked,
	} from "../stores";

	let nodeId = "";
	let docs: Map<string, InfoDoc> = new Map();

	$: exchangeContract = new EthersExchangeContract(
		$contract.InfoExchangeGenesis
	);

	$: {
		if ($ipfsConnected) {
			$ipfs.id().then((id: any) => (nodeId = id.id));
		}
	}

	$: {
		if ($connected && $ipfsConnected && !$locked) {
			infoDocs(crypto, $globalData, exchangeContract, $identity).then(
				(d) => (docs = d)
			);
		}
	}

	onMount(async () => {
		if (!$connected || $locked) {
			push('/brie/welcome');
			return;
		}

		if ($ipfsConnected === false && $ipfsConnecting == false) {
			await connect();
		}
	});
</script>

<p>Dashboard</p>

<p>Node ID: {nodeId}</p>
