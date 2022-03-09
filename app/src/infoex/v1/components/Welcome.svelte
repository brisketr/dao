<script lang="ts">
	import { onMount } from "svelte";
	import { push } from "svelte-spa-router";
	import { locked } from "../stores";

	import Unlock from "./Unlock.svelte";

	onMount(async () => {
		if (!$locked) {
			push("/brie/dashboard");
		}
	});
</script>

<p>Welcome to the BrisketRib Info Exchange (<strong>Brie</strong>).</p>

<Unlock />
