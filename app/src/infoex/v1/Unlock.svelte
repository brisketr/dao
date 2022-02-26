<script lang="ts">
	let passphrase = "";

	async function unlock() {}
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
			<button id="create-links-button" on:click={() => unlock()}>
				🔓 Unlock
			</button>
		</td>
	</tr>

</table>
