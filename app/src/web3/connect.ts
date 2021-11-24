import { ethers } from "ethers";
import Web3Modal from 'web3modal';
import {
	BRIBAirdrop202107__factory,
	BRIBSnapshot202107__factory,
	BRIBToken__factory,
	BrisketTreasury__factory,
	IJoePair__factory
} from '@brisket-dao/core';
import { NETWORK_METADATA, SUPPORTED_NETWORKS } from './constants';
import { Contracts } from './contracts';
import { address as addressStore, connected, connecting, contract as contractStore, ethersProvider as ethersProviderStore, network as networkStore, tokenBalanceBRIB, wrongNetwork } from './stores';

/**
 * A function to connect to web3.
 */
export async function connectWeb3() {
	const providerOptions = {
		/* See Provider Options Section */
	};

	const web3Modal = new Web3Modal({ providerOptions });

	// Connect web3 to the user's ethereum provider.
	console.log('connecting to web3');

	// Set store to connecting
	connecting.set(true);

	const provider = await web3Modal.connect();
	const ethersProvider = new ethers.providers.Web3Provider(provider);
	console.log('connected to web3');

	// Handle network change.
	if (window.ethereum) {
		const anyProvider = new ethers.providers.Web3Provider(window.ethereum, "any");

		anyProvider.on('network', (newNetwork, oldNetwork) => {
			console.log('network changed from', oldNetwork, 'to', newNetwork);

			// Reload window if network changed.
			if (oldNetwork) {
				// Set connected to false.
				window.location.reload();
			}
		})
	}

	// Check if the user is connected to the right network.
	const network = await ethersProvider.getNetwork();
	console.log('network:', network);
	networkStore.set(network);

	// If network.chainId is not in SUPPORTED_NETWORKS, set wrongNetworkStore to true and return.
	if (!SUPPORTED_NETWORKS.includes(network.chainId)) {
		wrongNetwork.set(true);
		return;
	}

	const signer = ethersProvider.getSigner();
	const address = await signer.getAddress();
	console.log('address: ', address);

	// Set address store.
	addressStore.set(address);

	// Update connected state and address if disconnected.
	ethersProvider.on('disconnect', () => {
		console.log('disconnected from web3');

		// Set store to disconnected.
		connecting.set(false);
		connected.set(false);
		addressStore.set(null);
		contractStore.set(null);
	});

	// Handle account change.
	if (window.ethereum) {
		window.ethereum.on('accountsChanged', function (accounts) {
			console.log('address changed: ', accounts[0]);

			// Reload window.
			window.location.reload();
		});
	}

	// Set store to connected.
	connecting.set(false);
	connected.set(true);

	// Connect to contracts.
	let contracts = new Contracts();

	if (NETWORK_METADATA[network.chainId]) {

		/**
		 * Connect to the given contract.
		 */
		function connectToContract(contractFactory, contractName) {
			if (NETWORK_METADATA[network.chainId]["CONTRACTS"][contractName]) {
				console.log(`connecting to ${contractName} contract at ${NETWORK_METADATA[network.chainId]["CONTRACTS"][contractName]}`);
				contracts[contractName] = contractFactory.connect(
					NETWORK_METADATA[network.chainId]["CONTRACTS"][contractName], ethersProvider.getSigner());
			}
		}

		// Define a constant structure with all contract factories and names
		const contractFactories = {
			BRIBAirdrop202107: BRIBAirdrop202107__factory,
			BRIBSnapshot202107: BRIBSnapshot202107__factory,
			BRIBToken: BRIBToken__factory,
			BrisketTreasury: BrisketTreasury__factory,
			MIMBRIBJoePair: IJoePair__factory
		};

		// Connect to all contracts.
		for (let contractName in contractFactories) {
			connectToContract(contractFactories[contractName], contractName);
		}

		if (contracts.BRIBToken) {
			// Use ethers to subscribe to BRIBToken events and update tokenBalanceBRIB when balance changes.
			contracts.BRIBToken.on('Transfer', (from, to, value) => {
				contracts.BRIBToken.balanceOf(address).then(balance => {
					tokenBalanceBRIB.set(balance);
				});
			});

			// Get initial token balance.
			contracts.BRIBToken.balanceOf(address).then(balance => {
				tokenBalanceBRIB.set(balance);
			});
		}
	}

	contractStore.set(contracts);

	// Store ethers provider.
	ethersProviderStore.set(ethersProvider);

	return ethersProvider;

}

