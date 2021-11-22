<script lang="ts">
	import {
	BRIBAirdrop202107__factory,BRIBSnapshot202107__factory,BRIBToken__factory,
	BrisketTreasury__factory
	} from "@brisket-dao/core";
	import { connected,contract,ethersProvider } from "../web3/stores";

	// Define possible DEPLOY_STATES.
	const DEPLOY_STATES = {
		NOT_STARTED: 0,
		DEPLOYING: 1,
		DEPLOYED: 2,
		ERROR: 3,
	};

	let contractDeployStates = {
		BRIBToken: DEPLOY_STATES.NOT_STARTED,
		BrisketTreasury: DEPLOY_STATES.NOT_STARTED,
		BRIBSnapshot202107: DEPLOY_STATES.NOT_STARTED,
		BRIBAirdrop202107: DEPLOY_STATES.NOT_STARTED,
	};

	$: {
		// If BrisketTreasury is deployed, set state to DEPLOYED.
		if ($contract.BrisketTreasury) {
			contractDeployStates.BrisketTreasury = DEPLOY_STATES.DEPLOYED;
		}

		// If BRIBToken is deployed, set state to DEPLOYED.
		if ($contract.BRIBToken) {
			contractDeployStates.BRIBToken = DEPLOY_STATES.DEPLOYED;
		}

		// If BRIBSnapshot202107 is deployed, set state to DEPLOYED.
		if ($contract.BRIBSnapshot202107) {
			contractDeployStates.BRIBSnapshot202107 = DEPLOY_STATES.DEPLOYED;
		}
	}

	/**
	 * Deploys the BrisketTreasury contract.
	 */
	async function deployTreasuryContract() {
		// Initialize contract factory.
		const factory = new BrisketTreasury__factory(
			$ethersProvider.getSigner()
		);

		// Deploy the contract.
		console.log("deploying BrisketTreasury contract");
		contractDeployStates["BrisketTreasury"] = DEPLOY_STATES.DEPLOYING;

		try {
			const treasury = await factory.deploy();

			// Wait for the transaction to be mined.
			await treasury.deployed();
			console.log(
				"BrisketTreasury contract deployed at",
				treasury.address
			);

			// Update the contract store.
			$contract.BrisketTreasury = treasury;
			contractDeployStates["BrisketTreasury"] = DEPLOY_STATES.DEPLOYED;
		} catch (e) {
			contractDeployStates["BrisketTreasury"] = DEPLOY_STATES.ERROR;
			console.error("Error deploying BrisketTreasury contract:", e);
		}
	}

	/**
	 * Deploys the BRIBSnapshot202107 contract.
	 */
	async function deploySnapshotContract() {
		// Get the treasury contract address. Return if not deployed.
		const treasury = $contract.BrisketTreasury;

		if (!treasury) {
			console.log("BrisketTreasury contract not deployed");
			return;
		}

		// Initialize contract factory.
		const factory = new BRIBSnapshot202107__factory(
			$ethersProvider.getSigner()
		);

		// Deploy the contract.
		console.log("deploying BRIBSnapshot202107 contract");
		contractDeployStates["BRIBSnapshot202107"] = DEPLOY_STATES.DEPLOYING;

		try {
			const snapshot = await factory.deploy(treasury.address);

			// Wait for the transaction to be mined.
			await snapshot.deployed();
			console.log(
				"BRIBSnapshot202107 contract deployed at",
				snapshot.address
			);

			// Update the contract store.
			$contract.BRIBSnapshot202107 = snapshot;
			contractDeployStates["BRIBSnapshot202107"] = DEPLOY_STATES.DEPLOYED;
		} catch (e) {
			contractDeployStates["BRIBSnapshot202107"] = DEPLOY_STATES.ERROR;
			console.error("Error deploying BRIBSnapshot202107 contract:", e);
		}
	}

	/**
	 * Deploys the BRIBToken contract.
	 */
	async function deployTokenContract() {
		// Get the snapshot contract address. Return if not deployed.
		const snapshot = $contract.BRIBSnapshot202107;

		if (!snapshot) {
			console.log("BRIBSnapshot202107 contract not deployed");
			return;
		}

		// Initialize contract factory.
		const factory = new BRIBToken__factory($ethersProvider.getSigner());

		// Deploy the contract.
		console.log("deploying BRIBToken contract");
		contractDeployStates["BRIBToken"] = DEPLOY_STATES.DEPLOYING;

		try {
			const token = await factory.deploy(snapshot.address);

			// Wait for the transaction to be mined.
			await token.deployed();
			console.log("BRIBToken contract deployed at", token.address);

			// Update the contract store.
			$contract["BRIBToken"] = token;
			contractDeployStates["BRIBToken"] = DEPLOY_STATES.DEPLOYED;
		} catch (e) {
			contractDeployStates["BRIBToken"] = DEPLOY_STATES.ERROR;
			console.error("Error deploying BRIBToken contract:", e);
		}
	}

	/**
	 * Deploys the BRIBAirdrop202107 contract.
	 */
	async function deployAirdropContract() {
		// Get the token contract address. Return if not deployed.
		const token = $contract.BRIBToken;

		if (!token) {
			console.log("BRIBToken contract not deployed");
			return;
		}

		// Get the snapshot contract address. Return if not deployed.
		const snapshot = $contract.BRIBSnapshot202107;

		if (!snapshot) {
			console.log("BRIBSnapshot202107 contract not deployed");
			return;
		}

		// Initialize contract factory.
		const factory = new BRIBAirdrop202107__factory(
			$ethersProvider.getSigner()
		);

		// Deploy the contract.
		console.log("deploying BRIBAirdrop202107 contract");
		contractDeployStates["BRIBAirdrop202107"] = DEPLOY_STATES.DEPLOYING;

		try {
			const airdrop = await factory.deploy(
				token.address,
				snapshot.address
			);

			// Wait for the transaction to be mined.
			await airdrop.deployed();
			console.log(
				"BRIBAirdrop202107 contract deployed at",
				airdrop.address
			);

			// Update the contract store.
			$contract["BRIBAirdrop202107"] = airdrop;
			contractDeployStates["BRIBAirdrop202107"] = DEPLOY_STATES.DEPLOYED;
		} catch (e) {
			contractDeployStates["BRIBAirdrop202107"] = DEPLOY_STATES.ERROR;
			console.error("Error deploying BRIBAirdrop202107 contract:", e);
		}
	}
</script>

<div id="ui">
	<h1>Dev Console</h1>
	<h2>Contract Deployment</h2>
	{#if $connected}
		<table id="contracts_deployment">
			<tr>
				<td>BrisketTreasury</td>
				<td>
					<button on:click={deployTreasuryContract}>
						{#if contractDeployStates.BrisketTreasury === DEPLOY_STATES.NOT_STARTED}
							&#x2191; Deploy
						{:else if contractDeployStates.BrisketTreasury === DEPLOY_STATES.DEPLOYING}
							🕘 Deploying...
						{:else if contractDeployStates.BrisketTreasury === DEPLOY_STATES.DEPLOYED}
							💥 Deployed
						{:else if contractDeployStates.BrisketTreasury === DEPLOY_STATES.ERROR}
							🛑 Error
						{/if}
					</button>
				</td>
			</tr>
			<tr>
				<td>BRIBSnapshot202107</td>
				<td>
					<!-- BRIBSnapshot202107 deploy button disabled if BrisketTreasury is not yet deployed -->
					<button
						on:click={deploySnapshotContract}
						disabled={contractDeployStates.BrisketTreasury !==
							DEPLOY_STATES.DEPLOYED}
					>
						{#if contractDeployStates.BRIBSnapshot202107 === DEPLOY_STATES.NOT_STARTED}
							&#x2191; Deploy
						{:else if contractDeployStates.BRIBSnapshot202107 === DEPLOY_STATES.DEPLOYING}
							🕘 Deploying...
						{:else if contractDeployStates.BRIBSnapshot202107 === DEPLOY_STATES.DEPLOYED}
							💥 Deployed
						{:else if contractDeployStates.BRIBSnapshot202107 === DEPLOY_STATES.ERROR}
							🛑 Error
						{/if}
					</button>
				</td>
			</tr>
			<tr>
				<td>BRIBToken</td>
				<td>
					<!-- BRIBToken deploy button disabled if BRIBSnapshot202107 is not yet deployed -->
					<button
						on:click={deployTokenContract}
						disabled={contractDeployStates.BRIBSnapshot202107 !==
							DEPLOY_STATES.DEPLOYED}
					>
						{#if contractDeployStates.BRIBToken === DEPLOY_STATES.NOT_STARTED}
							&#x2191; Deploy
						{:else if contractDeployStates.BRIBToken === DEPLOY_STATES.DEPLOYING}
							🕘 Deploying...
						{:else if contractDeployStates.BRIBToken === DEPLOY_STATES.DEPLOYED}
							💥 Deployed
						{:else if contractDeployStates.BRIBToken === DEPLOY_STATES.ERROR}
							🛑 Error
						{/if}
					</button>
				</td>
			</tr>
			<tr>
				<td>BRIBAirdrop202107</td>
				<td>
					<!-- BRIBAirdrop202107 deploy button disabled if BRIBToken and BRIBSnapshot202107 are not yet deployed -->
					<button
						on:click={deployAirdropContract}
						disabled={contractDeployStates.BRIBToken !==
							DEPLOY_STATES.DEPLOYED ||
							contractDeployStates.BRIBSnapshot202107 !==
								DEPLOY_STATES.DEPLOYED}
					>
						{#if contractDeployStates.BRIBAirdrop202107 === DEPLOY_STATES.NOT_STARTED}
							&#x2191; Deploy
						{:else if contractDeployStates.BRIBAirdrop202107 === DEPLOY_STATES.DEPLOYING}
							🕘 Deploying...
						{:else if contractDeployStates.BRIBAirdrop202107 === DEPLOY_STATES.DEPLOYED}
							💥 Deployed
						{:else if contractDeployStates.BRIBAirdrop202107 === DEPLOY_STATES.ERROR}
							🛑 Error
						{/if}
					</button>
				</td>
		</table>
	{:else}
		<p>Must be connected to deploy contracts.</p>
	{/if}
</div>

<style>
	table#contracts_deployment td:nth-child(2) {
		padding: 0;
	}

	table#contracts_deployment td:nth-child(2) button {
		width: 100%;
		height: 100%;
		margin: 0;
		border: none;
	}

	table#contracts_deployment {
		width: 100%;
		border-collapse: collapse;
		border: 1px solid white;
	}

	table#contracts_deployment td {
		padding: 0.5em;
		border: 1px solid white;
	}
</style>
