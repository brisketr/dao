<script lang="ts">
	import { connected, contract } from "../web3/stores";

	let qualifiesPromise = new Promise<boolean>(() => false);
	let claimedPromise = new Promise<boolean>(() => false);
	let claimingPromise = Promise.resolve(null);

	$: {
		if ($contract && $contract.BRIBAirdrop202107) {
			qualifiesPromise = $contract.BRIBAirdrop202107.qualifies();
			claimedPromise = $contract.BRIBAirdrop202107.alreadyClaimed();
		}
	}

	async function claimAirdrop() {
		console.log("claiming airdrop...");
		claimingPromise = new Promise<void>(() => {});
		const tx = await $contract.BRIBAirdrop202107.claim();
		console.log(`waiting for tx ${tx.hash} to be mined...`);
		claimingPromise = tx.wait().then(() => {
			claimedPromise = Promise.resolve(true);
		});
	}
</script>

<div id="ui">
	<h1>2021-07 Airdrop</h1>

	<p>
		The 2021-07 Airdrop was awarded to all BRIB holders at the time of the
		2021-07 snapshot.
	</p>

	<h2>Qualification</h2>

	{#if !$connected}
		<p>Connect your wallet first (top-right of the screen).</p>
	{:else}
		{#await qualifiesPromise}
			<p>🤔 Checking...</p>
		{:then qualifies}
			{#if qualifies}
				<p>🎉 You qualify for the airdrop!</p>

				<h2>Claim</h2>

				{#await claimedPromise}
					<p>🤔 Checking...</p>
				{:then claimed}
					{#if claimed}
						<p>✅ You have claimed the airdrop.</p>
					{:else}
						<p>🎉 You have not yet claimed the airdrop.</p>
						<p>
							{#await claimingPromise}
								<button disabled>
									🕐 Waiting for transaction to be mined...
								</button>
							{:then claiming}
								<button on:click={claimAirdrop}>
									💰 Claim 1000 BRIB
								</button>
							{:catch error}
								<p>🛑 Something went wrong.</p>
							{/await}
						</p>
					{/if}
				{:catch error}
					<p>🛑 Something went wrong.</p>
				{/await}
			{:else}
				<p>🙁 You do not qualify for the airdrop.</p>
			{/if}
		{:catch error}
			<p>🛑 Something went wrong.</p>
		{/await}
	{/if}
</div>

<style>
	button {
		margin: 0;
	}
</style>
