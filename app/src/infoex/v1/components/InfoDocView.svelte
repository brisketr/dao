<script lang="ts">
	import { address } from "../../../web3/stores";
	import type { InfoDoc, InfoDocAccount } from "../cipher_doc";
	import { needsOnChainCidUpdate, publishGlobal } from "../exchange_group";
	import {
		exchangeContractGenesis,
		globalData,
		identity,
		latestCid,
		latestCipherDoc,
		latestDoc,
		needsOnChainPublish,
	} from "../stores";
	import type { ExchangeStaker } from "./types";

	export let doc: InfoDoc;
	export let staker: ExchangeStaker;
	export let editing = false;
	export let minAccounts = 0;

	let editable = false;
	let publishing = false;
	let publishingError = "";
	let newAccount = "";
	let newAccountError = "";
	let newAccountValid = false;

	$: {
		editable = $identity.address === staker.address;
		editing = editable && editing;

		const newAccountIsValidEthAddress = !!newAccount.match(
			/^(0x)?[0-9a-fA-F]{40}$/
		);

		if (newAccount !== "" && !newAccountIsValidEthAddress) {
			newAccountError = "Invalid Ethereum address";
		} else {
			newAccountError = "";
		}

		newAccountValid = newAccountIsValidEthAddress;
	}

	function edit() {
		editing = true;
	}

	async function save() {
		publishing = true;
		console.info("Saving...");
		console.info("Publishing to global data store...");

		try {
			const cipherDoc = await publishGlobal(
				crypto,
				$globalData,
				$identity,
				$exchangeContractGenesis,
				doc,
				$latestCipherDoc
			);

			editing = false;
			publishing = false;
			$latestDoc = doc;
			$latestCipherDoc = cipherDoc;
			$latestCid = cipherDoc.cid;

			console.info(
				"Published to global data store; Checking if on-chain data needs updated."
			);

			$needsOnChainPublish = false;

			try {
				$needsOnChainPublish = await needsOnChainCidUpdate(
					$globalData,
					$exchangeContractGenesis,
					$identity,
					cipherDoc
				);
			} catch (e) {
				console.error(
					`Error checking if on-chain data needs updated: ${e}; assuming it does need updated.`
				);
				$needsOnChainPublish = true;
			}

			console.info("Saved!");
		} catch (e) {
			console.error("Error saving:", e);
			publishingError = "Failed to publish data.";
		}
	}

	function moveUp(account: InfoDocAccount) {
		let accounts = doc.accounts;
		let index = accounts.indexOf(account);

		if (index > 0) {
			accounts.splice(index, 1);
			accounts.splice(index - 1, 0, account);
		}

		doc.accounts = accounts;
	}

	function moveDown(account: InfoDocAccount) {
		let accounts = doc.accounts;
		let index = accounts.indexOf(account);

		if (index < accounts.length - 1) {
			accounts.splice(index, 1);
			accounts.splice(index + 1, 0, account);
		}

		doc.accounts = accounts;
	}

	function add() {
		console.info(`Adding account \"${newAccount}\"...`);
		let newDoc = doc;

		if (newAccount && !newDoc.accounts.find(a => a.address === newAccount)) {
			newDoc.accounts.push({
				address: newAccount,
			});
			newAccount = "";
		}

		doc = newDoc;
	}

	function remove(account: InfoDocAccount) {
		console.info(`Removing account ${account.address}...`);

		let accounts = doc.accounts;
		let index = accounts.indexOf(account);

		if (index >= 0) {
			accounts.splice(index, 1);
		}

		doc.accounts = accounts;
	}

	function retry() {
		publishing = false;
		publishingError = "";
	}
</script>

{#if doc.accounts && doc.accounts.length > 0}
	<ol>
		{#each doc.accounts as account}
			<li>
				<strong>{account.address}</strong>
				<div>
					[ View: <a
						href="https://debank.com/profile/{account.address}"
						target="_blank">DeBank</a
					>
					<a
						href="https://zapper.fi/account/{account.address}"
						target="_blank">Zapper</a
					>
					]
				</div>
				{#if editing}
					<div>
						[
						{#if doc.accounts.indexOf(account) > 0}
							<a
								href={window.location.toString()}
								on:click={() => moveUp(account)}>Up</a
							>
						{/if}

						{#if doc.accounts.indexOf(account) < doc.accounts.length - 1}
							<a
								href={window.location.toString()}
								on:click={() => moveDown(account)}>Down</a
							>
						{/if}
						<a
							href={window.location.toString()}
							on:click={() => remove(account)}>Delete</a
						>
						]
					</div>
				{/if}
			</li>
		{/each}
	</ol>
{/if}

{#if editable}
	{#if editing}
		{#if doc.accounts.length < 20}
			<input type="text" bind:value={newAccount} />

			{#if newAccountError}
				<div class="error">{newAccountError}</div>
			{/if}

			<button on:click={add} disabled={!newAccountValid}>Add</button>
		{:else}
			<p>You have reached the maximum of 20 accounts.</p>
		{/if}

		{#if publishingError}
			<p class="error">{publishingError}</p>
			<p>
				<a href={window.location.toString()} on:click={retry}>
					Acknowledge
				</a>
			</p>
		{/if}

		{#if doc.accounts.length >= minAccounts}
			<button on:click={save} disabled={publishing}>
				{#if publishing}
					Publishing...
				{:else}
					Done
				{/if}
			</button>
		{/if}
	{:else}
		<button on:click={edit} id="edit_button">Edit</button>
	{/if}
{/if}

<style>
	#edit_button {
		margin: 0;
	}

	li {
		margin-bottom: 1em;
	}
</style>
