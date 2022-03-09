import type { InfoExchange } from "@brisket-dao/core";
import IPFS from "../../modules/ipfs-core/ipfs-core.js";
import cryptoKeys from '../../modules/libp2p-crypto-keys/keys.js';
import PeerID from '../../modules/peer-id/peer-id.js';
import type { Contracts } from "../../web3/contracts.js";
import { contract } from "../../web3/stores";
import type { RSAEncrypter } from "./encryption.js";
import { EthersExchangeContract } from "./exchange_contract_ethers.js";
import type { Identity } from "./exchange_group.js";
import { IpfsGlobalStore } from "./storage_ipfs.js";
import { LocalStorageStore } from "./storage_local.js";
import { exchangeContractGenesis, globalData, identity, ipfs, ipfsConnected, ipfsConnecting, localData } from "./stores";

let encrypter: RSAEncrypter = null;
let infoExchangeGenesis: InfoExchange = null;

identity.subscribe(async (identity: Identity) => {
	if (identity) {
		encrypter = identity.encrypter;
	}
});

contract.subscribe(async (contract: Contracts) => {
	if (contract) {
		infoExchangeGenesis = contract.InfoExchangeGenesis;
	}
});

export function resetIpfs() {
	indexedDB.deleteDatabase('ipfs');
	indexedDB.deleteDatabase('ipfs/blocks');
	indexedDB.deleteDatabase('ipfs/datastore');
	indexedDB.deleteDatabase('ipfs/pins');
}

export async function connect() {

	if (encrypter === null) {
		throw new Error("No identity set");
	}

	ipfsConnected.set(false);
	ipfsConnecting.set(true);

	// Connect to IPFS.
	console.info("Connecting to IPFS...");
	const ipfsPeerId = await encrypter.peerId(cryptoKeys, PeerID);

	// Get most recently used peer ID from local storage.
	const lastPeerID = localStorage.getItem("lastPeerID");

	let newIpfs = null;

	// Check if ipfs db exists.
	const ipfsDbExists = (await indexedDB.databases()).map(db => db.name).includes('ipfs');

	if (!ipfsDbExists || lastPeerID != ipfsPeerId.toB58String()) {
		console.log("New IPFS peer ID detected. Resetting local storage.");

		resetIpfs();

		newIpfs = await IPFS.create({
			init: {
				privateKey: ipfsPeerId
			}
		});
	} else {
		newIpfs = await IPFS.create();
	}

	ipfs.set(newIpfs);
	const ipfsId = await newIpfs.id();

	const nodeId = ipfsId.id;

	if (nodeId !== ipfsPeerId.toB58String()) {
		ipfsConnected.set(false);
		ipfsConnecting.set(false);
		console.warn(`IPFS peer ID mismatch. Expected ${ipfsPeerId.toB58String()}, got ${nodeId}.`);
		console.log('Attempting to reconnect...');

		// Shut down/clean up IPFS
		await newIpfs.stop();

		// Try to reconnect.
		resetIpfs();
		newIpfs = await IPFS.create({
			init: {
				privateKey: ipfsPeerId
			}
		});

		// Validate that the peer ID matches.
		if ((await newIpfs.id()).id !== ipfsPeerId.toB58String()) {
			throw new Error("IPFS peer ID mismatch.");
		}
	}

	console.log(`Peer IDs match: ${nodeId} === ${ipfsPeerId.toB58String()}.`);
	console.info(`Connected to IPFS as ${nodeId}`);

	localStorage.setItem("lastPeerID", ipfsPeerId.toB58String());

	globalData.set(new IpfsGlobalStore(newIpfs));
	const ls = new LocalStorageStore();
	ls.load();
	localData.set(ls)

	exchangeContractGenesis.set(new EthersExchangeContract(
		infoExchangeGenesis
	));

	ipfsConnected.set(true);
	ipfsConnecting.set(false);
}
