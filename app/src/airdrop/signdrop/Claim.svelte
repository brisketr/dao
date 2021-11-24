<script lang="ts">
	import { Signdrop__factory } from "@brisket-dao/core";
	import { ethers } from "ethers";

	import { connected, contract, ethersProvider } from "../../web3/stores";

	export let params = {} as any;

	const contractAddress = params.contractAddress;
	const airdropPrivateKey = params.airdropPrivateKey;
	const airdropWallet = new ethers.Wallet(airdropPrivateKey);

	let qualifiesPromise = new Promise<boolean>(() => false);
	let claimedPromise = new Promise<boolean>(() => false);
	let claimingPromise = Promise.resolve(null);
	let amount = "...";

	$: {
		if ($connected) {
			const signdrop = Signdrop__factory.connect(
				contractAddress,
				$ethersProvider.getSigner()
			);
			qualifiesPromise = signdrop.qualifies(airdropWallet.address);
			claimedPromise = signdrop.alreadyClaimed(airdropWallet.address);
			signdrop.getAirdropAmount().then((a) => {
				amount = ethers.utils.formatUnits(a, 18);
			});
		}
	}

	async function claimAirdrop() {
		console.log("claiming airdrop...");
		const claimingAddress = await $ethersProvider.getSigner().getAddress();
		const signdrop = Signdrop__factory.connect(
			contractAddress,
			$ethersProvider.getSigner()
		);
		claimingPromise = new Promise<void>(() => {});
		const signature = await airdropWallet.signMessage(
			ethers.utils.arrayify(claimingAddress)
		);
		const tx = await signdrop.claim(
			claimingAddress,
			signature
		);
		console.log(`waiting for tx ${tx.hash} to be mined...`);
		claimingPromise = tx.wait().then(() => {
			claimedPromise = Promise.resolve(true);
		});
	}
</script>

<div id="ui">
	<h1>Claim Airdrop Link</h1>

	<p>This is a one-time use link to claim your BRIB.</p>

	<h2>Qualification</h2>

	{#if !$connected}
		<p>Connect your wallet first (top-right of the screen).</p>
	{:else}
		{#await qualifiesPromise}
			<p>🤔 Checking...</p>
		{:then qualifies}
			{#if qualifies}
				<p>🎉 You qualify for an {amount} BRIB airdrop!</p>

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
									💰 Claim {amount} BRIB
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
