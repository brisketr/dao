<script lang="ts">
	import type { InfoDoc } from "../cipher_doc";
	import type { ExchangeContract, Staker } from "../exchange_contract";
	import { Identity, infoDocs } from "../exchange_group";
	import type { GlobalDataStore } from "../storage";
	import {
		eventCount,
		exchangeContractGenesis,
		globalData,
		identity,
		ipfs,
	} from "../stores";
	import InfoDocView from "./InfoDocView.svelte";

	let docs: Map<String, InfoDoc> = new Map();
	let topStakers: Staker[] = [];

	/**
	 * Update latest info docs.
	 */
	async function updateDocs(
		globalData: GlobalDataStore,
		identity: Identity,
		infoEx: ExchangeContract
	) {
		console.info("Updating docs...");
		docs = await infoDocs(crypto, globalData, infoEx, identity);
		topStakers = await infoEx.topStakers();
	}

	$: {
		if ($ipfs && $globalData && $exchangeContractGenesis) {
			console.log(`Updating docs; Event count is ${$eventCount}`);
			updateDocs($globalData, $identity, $exchangeContractGenesis);
		}
	}
</script>

<table class="ui">
	<thead>
		<tr>
			<th>Staker</th>
			<th>Info</th>
		</tr>
	</thead>

	<tbody>
		{#each topStakers as staker}
			<tr>
				<td class="wrap">{staker.address}</td>
				<td class="wrap">
					{#if docs.has(staker.address)}
						<InfoDocView {staker} doc={docs.get(staker.address)} />
					{:else}
						{#if staker.address === $identity.address}
							<InfoDocView {staker} doc={{
								accounts: []
							}} />
						{:else}
							No info published.
						{/if}
					{/if}
				</td>
			</tr>
		{/each}
	</tbody>
</table>
