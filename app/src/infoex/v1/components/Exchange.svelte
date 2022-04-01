<script lang="ts">
	import { push } from "svelte-spa-router";
	import { address } from "../../../web3/stores";
	import { formatBigNumber } from "../../../web3/util/format";
	import type { InfoDoc } from "../cipher_doc";
	import type { ExchangeContract } from "../exchange_contract";
	import {
		Identity,
		infoDocs,
		needsCipherDocUpdate,
		needsOnChainCidUpdate,
		publishGlobal,
		updateOnChainCid,
	} from "../exchange_group";
	import type { GlobalDataStore } from "../storage";
	import {
		eventCount,
		exchangeContractGenesis,
		globalData,
		identity,
		ipfs,
		latestCid,
		latestCipherDoc,
		latestDoc,
		needsOnChainPublish,
	} from "../stores";
	import InfoDocView from "./InfoDocView.svelte";
	import type { ExchangeStaker } from "./types";

	let docs: Map<String, InfoDoc> = new Map();
	let topStakers: ExchangeStaker[] = [];
	let firstPublish = false;
	let userStaker: ExchangeStaker;
	let loading = false;

	let onChainPublishState: "ready" | "publish-waiting" | "error" = "ready";
	let onChainPublishError = "";

	/**
	 * Update latest info docs.
	 */
	async function updateDocs(
		globalData: GlobalDataStore,
		identity: Identity,
		infoEx: ExchangeContract
	) {
		console.info("Updating docs...");
		loading = true;
		docs = await infoDocs(crypto, globalData, infoEx, identity);
		const top = await infoEx.topStakers();
		topStakers = top.map((staker, index) => ({
			...staker,
			position: index + 1,
			total: top.length,
		}));

		// Set firstPublish to true if no doc exists for $idenity.address.
		firstPublish = !docs.has(identity.address);

		if (!firstPublish && !$latestDoc) {
			$latestDoc = docs.get(identity.address);
			$latestCipherDoc = $latestDoc.cipherDoc;
		}

		userStaker = topStakers.find(
			(staker) => staker.address === identity.address
		);

		loading = false;

		if (userStaker) {
			// Check if cipher doc needs to be updated.
			console.info("Checking if cipher doc needs to be updated...");
			const needsUpdate = await needsCipherDocUpdate(
				globalData,
				infoEx,
				identity,
				$latestCipherDoc
			);

			if (needsUpdate) {
				console.info(
					`Need to republish doc (allowed keys changed?); publishing...`
				);

				const cipherDoc = await publishGlobal(
					crypto,
					globalData,
					identity,
					infoEx,
					$latestDoc,
					$latestCipherDoc
				);

				$latestCipherDoc = cipherDoc;
				$latestCid = cipherDoc.cid;
				console.info(`Published updated doc to global data store.`);

				try {
					$needsOnChainPublish = await needsOnChainCidUpdate(
						globalData,
						infoEx,
						identity,
						cipherDoc.cid
					);
				} catch (e) {
					console.error(
						`Error checking if on-chain data needs updated: ${e}; assuming it does need updated.`
					);
					$needsOnChainPublish = true;
				}
			} else {
				console.info(`No need to republish doc.`);
			}
		}
	}

	$: {
		if ($ipfs && $globalData && $exchangeContractGenesis) {
			console.log(`Updating docs; Event count is ${$eventCount}`);
			updateDocs($globalData, $identity, $exchangeContractGenesis);
		} else {
			console.info(`Waiting for ipfs and global data to be ready...`);
		}
	}

	async function publishOnChain() {
		console.info("Updating on-chain CID...");
		onChainPublishState = "publish-waiting";

		try {
			await updateOnChainCid($exchangeContractGenesis, $latestCid);
			onChainPublishState = "ready";
			firstPublish = false;
			$needsOnChainPublish = false;
		} catch (e) {
			console.error(`Error updating on-chain CID`, e);
			onChainPublishState = "error";
			onChainPublishError = "On-chain update failed.";
		}

		console.info("Updated on-chain data.");
	}

	function resetOnChainPublish() {
		onChainPublishState = "ready";
		onChainPublishError = "";
	}

	function stake() {
		push("/brie/stake");
	}
</script>

<h2>📒 Genesis Exchange</h2>

<p>
	<strong>See information</strong> published by other stakers below. You can
	also <strong>edit/publish your own information</strong> here.
</p>

<p>
	[ 🖩 <a href="/#/brie">Dashboard</a> ]
</p>

<!-- Show loading if loading && docs has no values -->
{#if loading && docs.size === 0}
	<p>Loading...</p>
{:else if !userStaker}
	<p>You must be a staker to view this exchange.</p>
	<p><button on:click={stake}>🥩 Stake</button></p>
{:else if $needsOnChainPublish}
	<div class="content-card wrap">
		<h3>📡 On-Chain Publish Required</h3>

		<p>
			Thank you for publishing information to the decentralized 🧀 Brie
			Genesis Exchange! Your contribution makes the exchange more
			valuable.
		</p>

		<p>
			On-chain information for your account <em>{$address}</em> is
			<strong>outdated</strong>. To rectify this, you need to
			<strong>publish your information on-chain</strong>.
		</p>

		<p>
			This action is typically only required the first time you publish or
			when you change devices.
		</p>

		{#if onChainPublishError}
			<p class="error">
				{onChainPublishError}

				<a
					href={window.location.toString()}
					on:click={resetOnChainPublish}>Acknowledge</a
				>
			</p>
		{/if}

		<p>
			<button
				on:click={publishOnChain}
				disabled={!(onChainPublishState === "ready")}
			>
				{#if onChainPublishState === "ready"}
					⬆️ Publish On-Chain
				{:else if onChainPublishState === "publish-waiting"}
					⬆️ Waiting for confirmation...
				{:else if onChainPublishState === "error"}
					⚠️ Error
				{/if}
			</button>
		</p>
	</div>
{:else if firstPublish}
	<div class="content-card wrap">
		<h3>🎉 Your First Publish</h3>

		<p>You have not yet published any information to this exchange.</p>

		<p>
			In order to access the information in this exchange, <strong
				>please share the top most interesting on-chain accounts you
				have found</strong
			>:
		</p>

		<!-- <p>
			Need ideas on <a href="#"
				>how to find interesting on-chain accounts</a
			>?
		</p> -->

		<p>
			Remember, the <strong>better the information</strong> you can
			find/publish, the
			<strong>more valuable this information exchange becomes</strong>.
		</p>

		<InfoDocView
			staker={userStaker}
			editing={true}
			minAccounts={1}
			doc={{
				accounts: [],
			}}
		/>
	</div>
{:else}
	{#each topStakers as staker}
		<div class="content-card wrap">
			<h3>
				{staker.address}

				{#if staker.address === $identity.address}
					(You)
				{/if}
			</h3>

			<p>
				Staker <strong>{staker.position}</strong> of
				<strong>{staker.total}</strong>
				with <strong>{formatBigNumber(staker.staked)} BRIB</strong> staked.
			</p>

			<p>Staker's top most interesting on-chain accounts to follow:</p>

			{#if docs.has(staker.address)}
				<InfoDocView {staker} doc={docs.get(staker.address)} />
			{:else}
				<p>No info published.</p>
			{/if}
		</div>
	{/each}
{/if}
