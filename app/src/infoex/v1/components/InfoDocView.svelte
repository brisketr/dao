<script lang="ts">
	import { add_attribute } from "svelte/internal";
	import type { InfoDoc, InfoDocAccount } from "../cipher_doc";
	import type { Staker } from "../exchange_contract";
	import {
		needsOnChainCidUpdate,
		publishGlobal,
		updateOnChainCid,
	} from "../exchange_group";
	import { exchangeContractGenesis, globalData, identity } from "../stores";

	export let doc: InfoDoc;
	export let staker: Staker;

	let editable = false;
	let editing = false;
	let newAccount = "";

	$: {
		editable = $identity.address === staker.address;
		editing = editable && editing;
	}

	function edit() {
		editing = true;
	}

	async function save() {
		console.info("Saving...");
		const cid = await publishGlobal(
			crypto,
			$globalData,
			$identity,
			$exchangeContractGenesis,
			doc
		);

		if (
			await needsOnChainCidUpdate(
				$globalData,
				$exchangeContractGenesis,
				$identity
			)
		) {
			console.info("Updating on-chain CID...");
			await updateOnChainCid($exchangeContractGenesis, cid);
		}

		console.info("Saved!");
	}

	function cancelEdit() {
		editing = false;
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

		if (newAccount) {
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
</script>

{#if doc.accounts && doc.accounts.length > 0}
	<ol>
		{#each doc.accounts as account}
			<li>
				{account.address}
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

{#if editing}
	<table id="add_form">
		<tr>
			<td class="input">
				<input type="text" bind:value={newAccount} />
			</td>
			<td class="input">
				<button on:click={add} id="add_button"> + </button>
			</td>
		</tr>
	</table>
{/if}

{#if editable}
	{#if editing}
		<button on:click={save}>Publish</button>
		<button on:click={cancelEdit}>Cancel</button>
	{:else}
		<button on:click={edit} id="edit_button">Edit</button>
	{/if}
{/if}

<style>
	#add_form {
		margin-bottom: 1em;
	}

	#add_button {
		border: none;
	}

	#edit_button {
		margin: 0;
	}

	li {
		margin-bottom: 1em;
	}
</style>
