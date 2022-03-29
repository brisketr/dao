import { ethers } from "ethers";
import Web3Modal from 'web3modal';
import { connectContracts } from "./connect_contracts";
import { SUPPORTED_NETWORKS } from './constants';
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
	console.info('Connecting to web3');

	// Set store to connecting
	connecting.set(true);

	const provider = await web3Modal.connect();
	const ethersProvider = new ethers.providers.Web3Provider(provider);
	console.info('Connected to web3');

	// Handle network change.
	if (window.ethereum) {
		const anyProvider = new ethers.providers.Web3Provider(window.ethereum, "any");

		anyProvider.on('network', (newNetwork, oldNetwork) => {
			console.info('Network changed from', oldNetwork, 'to', newNetwork);

			// Reload window if network changed.
			if (oldNetwork) {
				// Set connected to false.
				window.location.reload();
			}
		})
	}

	// Check if the user is connected to the right network.
	const network = await ethersProvider.getNetwork();
	console.info('Network:', network);
	networkStore.set(network);

	// If network.chainId is not in SUPPORTED_NETWORKS, set wrongNetworkStore to true and return.
	if (!SUPPORTED_NETWORKS.includes(network.chainId)) {
		wrongNetwork.set(true);
		return;
	}

	const signer = ethersProvider.getSigner();
	const address = await signer.getAddress();
	console.info('Address: ', address);

	// Set address store.
	addressStore.set(address);

	// Update connected state and address if disconnected.
	ethersProvider.on('disconnect', () => {
		console.info('Disconnected from web3');

		// Set store to disconnected.
		connecting.set(false);
		connected.set(false);
		addressStore.set(null);
		contractStore.set(null);
	});

	// Handle account change.
	if (window.ethereum) {
		window.ethereum.on('accountsChanged', function (accounts) {
			console.info('Address changed: ', accounts[0]);

			// Reload window.
			window.location.reload();
		});
	}

	// Set store to connected.
	connecting.set(false);
	connected.set(true);

	// Connect to contracts.
	let contracts = await connectContracts(ethersProvider);

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

	contractStore.set(contracts);

	// Store ethers provider.
	ethersProviderStore.set(ethersProvider);

	return ethersProvider;

}

