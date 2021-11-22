<script lang="ts">
	import { ERC20__factory } from "@brisket-dao/core";
	import { ethers } from "ethers";
	import {
		address,
		connected,
		contract,
		ethersProvider,
	} from "../web3/stores";

	// Define viewable treasury tokens.
	let tokens = {};
	let tokenSymbols = [];
	let tokenBalances = {};

	$: {
		tokens = {};

		if ($contract.BRIBToken) {
			tokens["BRIB"] = {
				symbol: "BRIB",
				address: $contract.BRIBToken.address,
				decimals: 18,
			};
		}

		tokenSymbols = Object.keys(tokens);

		// Init tokenBalances to 0 for each token.
		tokenSymbols.forEach((tokenSymbol) => {
			tokenBalances[tokenSymbol] = "0.0";
		});
	}

	// Enum of possible disbursement states.
	enum DisbursementState {
		Pending,
		Submitted,
		Disbursed,
		Error,
	}

	// Track disbursement state.
	let disbursementState = DisbursementState.Pending;

	// Init disbursement input values.
	let token = "";
	let amount = "";
	let recipient = "";

	let inputsValid = false;

	$: {
		// Validate token is not empty, amount is a decimal number, recipient is not
		// empty, and recipient is a vaid Ethereum address.

		inputsValid =
			token !== "" &&
			amount !== "" &&
			amount.match(/^\d+(\.\d+)?$/) &&
			recipient !== "" &&
			ethers.utils.isAddress(recipient);
	}

	/**
	 * Disburse treasury tokens to the given address.
	 */
	async function disburse() {
		// Get token address.
		console.log(`disbursing ${amount} ${token} to ${recipient}`);
		let tokenAddress = tokens[token].address;

		try {
			// Update disbursement state.
			disbursementState = DisbursementState.Submitted;

			// Submit disbursement transaction.
			let tx = await $contract.BrisketTreasury.disburse(
				tokenAddress,
				recipient,
				ethers.utils.parseUnits(amount, tokens[token].decimals)
			);

			// Wait for transaction to be mined, then update disbursement state.
			await tx.wait();
			disbursementState = DisbursementState.Disbursed;
			updateTokenBalances();
		} catch (error) {
			console.log(
				`Error disbursing ${amount} ${tokenAddress} to ${recipient}:`,
				error
			);
			disbursementState = DisbursementState.Error;
		}
	}

	/**
	 * Allow user to acknowledge disbursement, which resets disbursement state.
	 */
	function acknowledgeDisbursement() {
		disbursementState = DisbursementState.Pending;
	}

	/**
	 * Update token balances.
	 */
	async function updateTokenBalances() {
		console.log("updating token balances...");

		// Log & exit early if treasury contract is not deployed.
		if (!$contract.BrisketTreasury) {
			console.log(
				"cannot update token balances because Treasury contract is not deployed"
			);
			return;
		}

		// Update balances concurrently.
		await Promise.all(
			tokenSymbols.map(async (tokenSymbol) => {
				// Get token address.
				let tokenAddress = tokens[tokenSymbol].address;

				// Get token balance.
				let tokenContract = ERC20__factory.connect(
					tokenAddress,
					$ethersProvider
				);
				let balance = await tokenContract.balanceOf(
					$contract.BrisketTreasury.address
				);

				// Update token balance.
				tokenBalances[tokenSymbol] = ethers.utils.commify(
					ethers.utils.formatUnits(
						balance,
						tokens[tokenSymbol].decimals
					)
				);
			})
		);
	}

	let hasTreasurerRole = false;

	async function updateRoles() {
		hasTreasurerRole = await $contract.BrisketTreasury.hasRole(
			await $contract.BrisketTreasury.TREASURER_ROLE(),
			$address
		);
	}

	$: {
		if ($connected && $contract && $ethersProvider) {
			updateTokenBalances();
			if ($contract.BrisketTreasury) {
				updateRoles();
			}
		}
	}
</script>

<div id="ui">
	<h1>Treasury</h1>
	{#if !hasTreasurerRole}
		<p>You do not have the TREASURER role.</p>
	{:else}
		<div id="balances">
			<h2>Token Balances</h2>
			<table id="balances-table">
				{#each tokenSymbols as tokenSymbol}
					<tr>
						<td>{tokenSymbol}</td>
						<td>{tokenBalances[tokenSymbol]}</td>
					</tr>
				{/each}
			</table>
		</div>
		<div id="disburse-funds">
			<h2>Disburse Assets</h2>
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
					<td>Token</td>
					<td>
						<select id="token" bind:value={token}>
							{#each tokenSymbols as tokenSymbol}
								<option value={tokenSymbol}
									>{tokenSymbol}</option
								>
							{/each}
						</select>
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
							id="disburse-funds-button"
							on:click={() => disburse()}
							disabled={!inputsValid ||
								disbursementState !== DisbursementState.Pending}
						>
							💰 Disburse Assets
						</button>
					</td>
				</tr>
				{#if disbursementState !== DisbursementState.Pending}
					<tr>
						<td />
						<td>
							<p>
								{#if disbursementState === DisbursementState.Submitted}
									🕐 Waiting for transaction to be mined...
								{:else if disbursementState === DisbursementState.Disbursed}
									🎉 Assets disbursed!
								{:else if disbursementState === DisbursementState.Error}
									🚫 Error disbursing funds.
								{/if}
							</p>
						</td>
					</tr>
				{/if}
				{#if disbursementState === DisbursementState.Disbursed || disbursementState === DisbursementState.Error}
					<tr>
						<td />
						<td>
							<button
								id="acknowledge-disbursement-button"
								on:click={() => acknowledgeDisbursement()}
							>
								✅ Acknowledge Disbursement
							</button>
						</td>
					</tr>
				{/if}
			</table>
		</div>
	{/if}
</div>

<style>
	/* Columns with numbers in balances table are right-aligned. */
	#balances-table td:nth-child(2) {
		text-align: right;
	}

	/* Amount input text is right-aligned. */
	#disburse-funds input#amount {
		text-align: right;
	}

	#acknowledge-disbursement-button {
		margin-top: 1em;
	}
</style>
