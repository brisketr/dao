<script lang="ts">
	import { onMount } from "svelte";
	import { push } from "svelte-spa-router";
	import pemJwk from "../../../modules/pem-jwk/pem-jwk.js";
	import seededrsa from "../../../modules/seededrsa/seededrsa.js";
	import {
		address,
		connected,
		ethersProvider,
	} from "../../../web3/stores.js";
	import { RSAEncrypter } from "../encryption.js";
	import type { Identity } from "../exchange_group";
	import { identity, locked } from "../stores.js";

	let unlocking = false;
	let signing = false;
	let creatingId = false;
	let error = "";

	function retry () {
		error = "";
		unlocking = false;
		signing = false;
		creatingId = false;
	}

	async function unlock() {
		unlocking = true;
		creatingId = false;
		signing = true;
		error = "";

		console.log("Requesting login signature...");

		const signer = $ethersProvider.getSigner();
		const message = "BrisketRib Brie Login\n\nONLY sign this message from the official Brie app.";

		let sig = "";

		try {
			sig = (await signer.signMessage(message)).toString();
		} catch (e) {
			console.error("Error signing message", e);
			error = "Login signature failed.";
			signing = false;
			unlocking = false;
			creatingId = false;
			return;
		}

		console.log("Creating Identity...");

		signing = false;
		creatingId = true;
		const unlockedId: Identity = {
			address: $address,
			encrypter: await RSAEncrypter.create(
				crypto,
				seededrsa,
				pemJwk.pem2jwk,
				sig
			),
		};
		creatingId = false;

		console.log(`Created Identity: ${unlockedId.address}`);

		creatingId = false;
		$identity = unlockedId;
		$locked = false;
		unlocking = false;

		push("/brie/dashboard");
	}

	$: {
		if (error === "" && $locked && $connected && !unlocking) {
			unlock();
		} else {
			console.log("Not connected");
		}
	}

	onMount(async () => {
		if (error === "" && $locked && $connected && !unlocking) {
			unlock();
		}
	});
</script>

<h2>Unlock</h2>

<p>Please sign the message to unlock your Brie account.</p>

{#if signing}
	<p>Waiting for signature...</p>
{/if}

{#if creatingId}
	<p>Creating Identity...</p>
{/if}

{#if error}
	<p class="error">{error} <a href="{window.location.toString()}" on:click={retry}>Retry</a>.</p>
{/if}

<style>
	.error {
		color: red;
		font-size: 0.8em;
		padding: 0.5em;
		padding-top: 0em;
	}
</style>
