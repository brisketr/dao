<script type="ts">
	import { Signdrop__factory } from "@brisket-dao/core";

	import { ethers } from "ethers";
	import { contract, ethersProvider } from "../../web3/stores";

	let numLinks = "";
	let airdropAmount = "";
	let createInputsValid = false;
	let links = [];
	let contractAddress = "";

	// Enum of possible create states
	enum CreateState {
		Pending,
		Submitted,
		Error,
		Created,
	}

	let createState = CreateState.Pending;

	// Validate that numLinks is an integer and airdropAmount is a decimal or integer.
	$: {
		createInputsValid =
			/^\d+$/.test(numLinks) &&
			(/^\d+$/.test(airdropAmount) || /^\d+\.\d+$/.test(airdropAmount));
	}

	/**
	 * Creates the airdrop contract with the given airdrop amount and a
	 * generated wallet/private key for the given number of links.
	 */
	async function createLinks() {
		console.log(`creating ${numLinks} links with ${airdropAmount} BRIB.`);

		// Update state to indicate that the contract is being created.
		createState = CreateState.Submitted;

		// Exit early & log if inputs are invalid.
		if (!createInputsValid) {
			console.log("cannot create links: invalid inputs");
			return;
		}

		// Create wallets with random wallets
		let wallets = [];

		for (let i = 0; i < parseInt(numLinks); i++) {
			wallets.push(ethers.Wallet.createRandom());
		}

		// Initialize contract factory.
		const factory = new Signdrop__factory($ethersProvider.getSigner());

		// Derive BigNumber from airdropAmount.
		const airdropAmountBN = ethers.utils.parseUnits(airdropAmount, 18);

		// Derive list of addresses from wallets.
		const walletAddresses = wallets.map((wallet) => wallet.address);

		// Deploy the contract.
		console.log("deploying a new Signdrop contract");
		const signdrop = await factory.deploy(
			$contract.BRIBToken.address,
			airdropAmountBN,
			walletAddresses
		);

		// Wait for the transaction to be mined.
		await signdrop.deployed();

		// Set the contract address.
		contractAddress = signdrop.address;

		console.log(`created contract at ${contractAddress}`);

		// Create links in the form of "https://<current base url>/#/airdrop/signdrop/claim/<contract address>/<base64 encoded private key of wallet>"
		links = wallets.map(
			(wallet) =>
				`https://${
					window.location.host
				}/#/airdrop/signdrop/claim/${contractAddress}/${wallet.privateKey}`
		);

		links.forEach((link) => {
			console.log(`created link: ${link}`);
		});

		// Set create state to created
		createState = CreateState.Created;
	}

	/**
	 * Resets the create state.
	 */
	function acknowledgeLinks() {
		createState = CreateState.Pending;
	}
</script>

<div id="ui">
	<h1>Create Airdrop Links</h1>

	<p>
		This will create single-use links which can be used to claim airdop
		tokens.
	</p>

	<table>
		<tr>
			<td>Number of Links</td>
			<td>
				<input type="text" placeholder="0" bind:value={numLinks} />
			</td>
		</tr>

		<tr>
			<td>Amount</td>
			<td>
				<input
					type="text"
					id="amount"
					placeholder="0.00"
					bind:value={airdropAmount}
				/>
			</td>
		</tr>
		<tr>
			<td />
			<td>
				<button
					id="create-links-button"
					on:click={() => createLinks()}
					disabled={!createInputsValid ||
						createState !== CreateState.Pending}
				>
					🔗 Create Links
				</button>
			</td>
		</tr>
	</table>
	{#if createState !== CreateState.Pending}
		<p>
			{#if createState === CreateState.Submitted}
				🕐 Waiting for transaction to be mined...
			{:else if createState === CreateState.Created}
				🎉 Links created!
			{:else if createState === CreateState.Error}
				🚫 Error creating links.
			{/if}
		</p>
	{/if}
	{#if createState === CreateState.Created}
		<p>
			Make sure to store these links somewhere safe as they cannot be
			recovered:
		</p>
		<ul>
			{#each links as link}
				<li class="link">{link}</li>
			{/each}
		</ul>

		<p>
			Remember to mint the airdrop tokens to the contract address
			<strong>after you have saved the links</strong>.
		</p>

		<p>
			💰
			<a
				href={`/#/mint/${contractAddress}/${
					parseFloat(airdropAmount) * parseFloat(numLinks)
				}`}

				target="_blank"
			>
				Mint Airdrop Tokens
			</a>
		</p>

		<p>
			<button
				id="acknowledge-links-button"
				on:click={() => acknowledgeLinks()}
			>
				✅ Acknowledge Links
			</button>
		</p>
	{/if}
	{#if createState === CreateState.Error}
		<p>
			<button
				id="acknowledge-links-button"
				on:click={() => acknowledgeLinks()}
			>
				✅ Acknoledge Error
			</button>
		</p>
	{/if}
</div>

<style>
	.link {
		overflow-wrap: break-word;
	}
</style>
