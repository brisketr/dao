<script lang="ts">
	import { ethers } from "ethers";
	import { address, connected, contract, ethersProvider } from "../web3/stores";

	// Enum of possible mint states.
	enum MintState {
		Pending,
		Submitted,
		Minted,
		Error,
	}

	// Track mint state.
	let mintState = MintState.Pending;

	// Init mint input values.
	let amount = "";
	let recipient = "";

	let inputsValid = false;

	$: {
		// Validate amount is a decimal number, recipient is not empty, and
		// recipient is a vaid Ethereum address.
		inputsValid =
			amount !== "" &&
			amount.match(/^\d+(\.\d+)?$/) &&
			recipient !== "" &&
			ethers.utils.isAddress(recipient);
	}

	/**
	 * Mint BRIB tokens to the given address.
	 */
	async function mint() {
		// Get token address.
		console.log(`minting ${amount} BRIB to ${recipient}`);
		let tokenAddress = $contract.BRIBToken.address;

		try {
			// Update mint state.
			mintState = MintState.Submitted;

			// Submit mint transaction.
			let tx = await $contract.BRIBToken.mint(
				recipient,
				ethers.utils.parseUnits(amount, 18)
			);

			// Wait for transaction to be mined, then update mint state.
			await tx.wait();
			mintState = MintState.Minted;
		} catch (error) {
			console.log(
				`Error minting ${amount} ${tokenAddress} to ${recipient}:`,
				error
			);
			mintState = MintState.Error;
		}
	}

	/**
	 * Allow user to acknowledge mint, which resets mint state.
	 */
	function acknowledgeMint() {
		mintState = MintState.Pending;
	}

	let hasMinterRole = false;

	async function updateRoles() {
		hasMinterRole = await $contract.BRIBToken.hasRole(
			await $contract.BRIBToken.MINTER_ROLE(),
			$address
		);
	}

	$: {
		if ($connected && $contract && $ethersProvider && $contract.BrisketTreasury) {
			updateRoles();
		}
	}
</script>

<div id="ui">
	<h1>Mint</h1>
	{#if !hasMinterRole}
		<p>You do not have the MINTER role.</p>
	{:else}
		<div id="mint-funds">
			<h2>Mint BRIB</h2>
			<table>
				<tr>
					<td>Recipient</td>
					<td>
						<input
							type="text"
							id="address"
							placeholder="0x..."
							bind:value={recipient}
						/>
					</td>
				</tr>
				<tr>
					<td>Amount</td>
					<td>
						<input
							type="text"
							id="amount"
							placeholder="0.00"
							bind:value={amount}
						/>
					</td>
				</tr>
				<tr>
					<td />
					<td>
						<button
							id="mint-funds-button"
							on:click={() => mint()}
							disabled={!inputsValid ||
								mintState !== MintState.Pending}
						>
							💰 Mint BRIB
						</button>
					</td>
				</tr>
				{#if mintState !== MintState.Pending}
					<tr>
						<td />
						<td>
							<p>
								{#if mintState === MintState.Submitted}
									🕐 Waiting for transaction to be mined...
								{:else if mintState === MintState.Minted}
									🎉 BRIB minted!
								{:else if mintState === MintState.Error}
									🚫 Error minting tokens.
								{/if}
							</p>
						</td>
					</tr>
				{/if}
				{#if mintState === MintState.Minted || mintState === MintState.Error}
					<tr>
						<td />
						<td>
							<button
								id="acknowledge-mint-button"
								on:click={() => acknowledgeMint()}
							>
								✅ Acknowledge Mint
							</button>
						</td>
					</tr>
				{/if}
			</table>
		</div>
	{/if}
</div>

<style>
	/* Amount input text is right-aligned. */
	#mint-funds input#amount {
		text-align: right;
	}

	#acknowledge-mint-button {
		margin-top: 1em;
	}
</style>
