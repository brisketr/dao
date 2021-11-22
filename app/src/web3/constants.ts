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
		}
	},
	[PRODUCTION_NETWORK_ID]: {
		NAME: "Avalanche",
		CONTRACTS: {}
	}
}
