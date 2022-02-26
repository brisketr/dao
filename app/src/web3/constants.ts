export const DEV_NETWORK_ID = 31337;
export const PRODUCTION_NETWORK_ID = 43114;

export const SUPPORTED_NETWORKS = [PRODUCTION_NETWORK_ID, DEV_NETWORK_ID];

export const NETWORK_METADATA = {
	[DEV_NETWORK_ID]: {
		NAME: "Development",
		CONTRACTS: {
			// Comment these out to test deployment.
			"BrisketTreasury": "0x5fbdb2315678afecb367f032d93f642f64180aa3",
			"BRIBToken": "0xdc64a140aa3e981100a9beca4e685f962f0cf6c9",
			"BRIBAirdrop202107": "0x5fc8d32690cc91d4c39d9d3abcbd16989f875707",
			"InfoExchangeGenesis": "0x0165878A594ca255338adfa4d48449f69242Eb8F",
		}
	},
	[PRODUCTION_NETWORK_ID]: {
		NAME: "Avalanche",
		CONTRACTS: {			// Comment these out to test deployment.
			"BRIBAirdrop202107": "0xd30d80566288b1805f952677f6a22c366dc68bbc",
			"BrisketTreasury": "0x343b65e5adC2C660dfd5889ef0597676E9AbE99F",
			"BRIBSnapshot202107": "0xb985031D5Dd51389F32Cd6f5F26dC6045365f6A1",
			"BRIBToken": "0xa1437720c93b791b72f5b8a5846227763792afd7",
			"MIMBRIBJoePair": "0xa3f50d922c094b775e6304504094b702ce025766",
		}
	}
}
