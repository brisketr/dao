import { ethers } from "ethers";
import Web3Modal from 'web3modal';
import { BRIBAirdrop202107__factory, BRIBSnapshot202107__factory, BRIBToken__factory, BrisketTreasury__factory } from '../../../core/dist/typechain';
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
		if (NETWORK_METADATA[network.chainId]["CONTRACTS"]["BrisketTreasury"]) {
			console.log(`connecting to BrisketTreasury contract at ${NETWORK_METADATA[network.chainId]["CONTRACTS"]["BrisketTreasury"]}`);
			contracts.BrisketTreasury = BrisketTreasury__factory.connect(
				NETWORK_METADATA[network.chainId]["CONTRACTS"]["BrisketTreasury"], ethersProvider.getSigner());
		}

		if (NETWORK_METADATA[network.chainId]["CONTRACTS"]["BRIBToken"]) {
			console.log(`connecting to BRIBToken contract at ${NETWORK_METADATA[network.chainId]["CONTRACTS"]["BRIBToken"]}`);
			contracts.BRIBToken = BRIBToken__factory.connect(
				NETWORK_METADATA[network.chainId]["CONTRACTS"]["BRIBToken"], ethersProvider.getSigner());

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

		if (NETWORK_METADATA[network.chainId]["CONTRACTS"]["BRIBSnapshot202107"]) {
			console.log(`connecting to BRIBSnapshot202107 contract at ${NETWORK_METADATA[network.chainId]["CONTRACTS"]["BRIBSnapshot202107"]}`);
			contracts.BRIBSnapshot202107 = BRIBSnapshot202107__factory.connect(
				NETWORK_METADATA[network.chainId]["CONTRACTS"]["BRIBSnapshot202107"], ethersProvider.getSigner());
		}

		if (NETWORK_METADATA[network.chainId]["CONTRACTS"]["BRIBAirdrop202107"]) {
			console.log(`connecting to BRIBAirdrop202107 contract at ${NETWORK_METADATA[network.chainId]["CONTRACTS"]["BRIBAirdrop202107"]}`);
			contracts.BRIBAirdrop202107 = BRIBAirdrop202107__factory.connect(
				NETWORK_METADATA[network.chainId]["CONTRACTS"]["BRIBAirdrop202107"], ethersProvider.getSigner());
		}
	}

	contractStore.set(contracts);


	// Store ethers provider.
	ethersProviderStore.set(ethersProvider);

	return ethersProvider;

}

