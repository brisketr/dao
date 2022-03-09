<script lang="ts">
import { push } from "svelte-spa-router";

	import bip39 from "../../../modules/bip39/bip39.js";

	let generatedPhrase = "";
	let generated = false;

	async function generate() {
		generatedPhrase = bip39.generateMnemonic();
		generated = true;
	}

	async function close() {
		generated = false;
		push("/brie");
	}
</script>

<h2>Generate Passphrase</h2>

{#if !generated}
	<button on:click={() => generate()}>Generate</button>
{:else}
	<p>Your phrase:</p>

	<p id="generated-phrase">{generatedPhrase}</p>

	<p>
		Store this phrase somewhere secure. You may use a different phrase to
		unlock, but you <strong>may lose access to information</strong>.
	</p>

	<p>
		<button on:click={close}>Close</button>
	</p>
{/if}

<p>After you have generated your Brie unlock phrase, you may use it to <a href="#/brie">unlock</a> the app.</p>

<style>

#generated-phrase {
	font-size: 1.5em;
	font-weight: bold;
	padding: 1em;
}

</style>
