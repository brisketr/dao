import { BRIBAirdrop202107__factory, BRIBSnapshot202107__factory, BRIBToken__factory, BrisketTreasury__factory, IJoePair__factory, InfoExchange__factory } from "@brisket-dao/core";
import { NETWORK_METADATA } from "./constants";
import { Contracts } from "./contracts";

export async function connectContracts(provider): Promise<Contracts> {
	console.info('Connecting to contracts');
	let contracts = new Contracts();
	const network = await provider.getNetwork();

	if (NETWORK_METADATA[network.chainId]) {

		/**
		 * Connect to the given contract.
		 */
		function connectToContract(contractFactory, contractName) {
			if (NETWORK_METADATA[network.chainId]["CONTRACTS"][contractName]) {
				console.info(`Connecting to ${contractName} contract at ${NETWORK_METADATA[network.chainId]["CONTRACTS"][contractName]}`);
				contracts[contractName] = contractFactory.connect(
					NETWORK_METADATA[network.chainId]["CONTRACTS"][contractName], provider.getSigner());
			}
		}

		// Define a constant structure with all contract factories and names
		const contractFactories = {
			BRIBAirdrop202107: BRIBAirdrop202107__factory,
			BRIBSnapshot202107: BRIBSnapshot202107__factory,
			BRIBToken: BRIBToken__factory,
			BrisketTreasury: BrisketTreasury__factory,
			InfoExchangeGenesis: InfoExchange__factory,
			MIMBRIBJoePair: IJoePair__factory
		};

		// Connect to all contracts.
		for (let contractName in contractFactories) {
			connectToContract(contractFactories[contractName], contractName);
		}
	}
	return contracts;
}
