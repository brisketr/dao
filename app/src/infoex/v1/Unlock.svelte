<script lang="ts">
	import bip39 from '../../modules/bip39/bip39.js';

	let passphrase = "";
	let generatedPhrase = "";
	let valid = false;
	let generated = false;

	async function unlock() {}

	async function generate() {
		generatedPhrase = bip39.generateMnemonic();
		generated = true;
	}
</script>

<table>
	<tr>
		<td>Passphrase</td>
		<td>
			<input type="passphrase" bind:value={passphrase} />
		</td>
	</tr>

	<tr>
		<td />
		<td>
			{#if !generated}
				<button on:click={() => generate()}>Generate</button>
			{:else}
				<p>{generatedPhrase}</p>

				<p>
					Store this phrase somewhere secure. You may use a different
					phrase to unlock, but you <strong
						>may lose access to information</strong
					>.
				</p>

				<p>
					<button on:click={() => (generated = false)}>Close</button>
				</p>
			{/if}
		</td>
	</tr>

	<tr>
		<td />
		<td>
			<button
				id="create-links-button"
				on:click={() => unlock()}
				disabled={!valid}
			>
				🔓 Unlock
			</button>
		</td>
	</tr>
</table>
