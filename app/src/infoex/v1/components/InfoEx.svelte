<script lang="ts">
	import Router from "svelte-spa-router";
	import Dashboard from "./Dashboard.svelte";
	import GeneratePhrase from "./GeneratePhrase.svelte";
	import LoginCheck from "./LoginCheck.svelte";
	import Welcome from "./Welcome.svelte";

	const prefix = "/brie";
	const routes = {
		"/": LoginCheck,
		"/welcome": Welcome,
		"/generate-phrase": GeneratePhrase,
		"/dashboard": Dashboard,
	};
</script>

<div id="ui">
	<h1>Brie</h1>

	<Router {routes} {prefix} />
</div>
