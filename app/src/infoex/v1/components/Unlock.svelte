<script lang="ts">
	import pemJwk from "pem-jwk";
	import seededrsa from "seededrsa";
	import { onMount } from "svelte";
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

	function retry() {
		error = "";
		unlocking = false;
		signing = false;
		creatingId = false;
	}

	async function unlockSig(db: IDBDatabase, sig: string) {
		if (sig) {
			console.info(`Found signature for ${$address}`);
		} else {
			// Have user sign a login message.
			console.info("Requesting login signature...");

			const signer = $ethersProvider.getSigner();
			const message =
				"BrisketRib Brie Login\n\nONLY sign this message from the official Brie app.";

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

			// Store sig in IndexedDB keyed on $address.
			console.info("Storing login sig...");

			{
				const tx = db.transaction(["login_signatures"], "readwrite");
				const store = tx.objectStore("login_signatures");
				const req = store.put(sig, $address);

				req.onsuccess = () => {
					console.info("Stored login signature");
				};

				req.onerror = (e) => {
					console.error("Error storing login signature", e);
				};
			}
		}

		console.info("Creating Identity...");

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

		console.info(`Created identity: ${unlockedId.address}`);

		creatingId = false;
		$identity = unlockedId;
		$locked = false;
		unlocking = false;
	}

	async function unlock() {
		unlocking = true;
		creatingId = false;
		signing = true;
		error = "";

		// Create brie IndexedDB if it doesn't exist.
		let db: IDBDatabase;
		const openRequest = indexedDB.open("brie", 1);

		openRequest.onsuccess = async () => {
			db = openRequest.result;
			console.log(`Opened brie IndexedDB`);

			// Get signature for $address, if it exists.
			{
				const txn = db.transaction("login_signatures", "readonly");
				const store = txn.objectStore("login_signatures");
				const request = store.get($address);

				request.onsuccess = async () => {
					let sig = "";

					if (request.result) {
						sig = request.result;
					}

					await unlockSig(db, sig);
				};

				request.onerror = (e) => {
					console.error(`Failed to get signature for ${address}`, e);
				};
			}
		};

		openRequest.onupgradeneeded = () => {
			console.info("Initializing brie IndexedDB");
			openRequest.result.createObjectStore("login_signatures");
		};

		openRequest.onerror = () => {
			console.error("Failed to open brie IndexedDB");
		};
	}

	$: {
		if (error === "" && $locked && $connected && !unlocking && $ethersProvider) {
			unlock();
		} else {
			console.info("Not connected");
		}
	}

	onMount(async () => {
		if (error === "" && $locked && $connected && !unlocking && $ethersProvider) {
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
	<p class="error">
		{error} <a href={window.location.toString()} on:click={retry}>Retry</a>.
	</p>
{/if}
