<script lang="ts">
	import { onMount } from "svelte";
	import { push } from "svelte-spa-router";
	import { locked } from "../stores";

	onMount(async () => {
		if ($locked) {
			push("/brie/welcome");
		} else {
			push("/brie/dashboard");
		}
	});
</script>
