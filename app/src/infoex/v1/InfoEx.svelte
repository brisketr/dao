<script lang="ts">
import { locked } from "./stores";
import Unlock from "./Unlock.svelte";


	$: {

	}

</script>

<div id="ui">

	<h1>BRIE</h1>


	{#if $locked}

		<p>Welcome to the BrisketRib Info Exchange (<strong>BRIE</strong>).</p>

		<p>Please unlock your account to continue:</p>

		<Unlock />
	{:else}
	{/if}

</div>
