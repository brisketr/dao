import IPFS from "../../modules/ipfs-core/ipfs-core.js";
import PeerID from '../../modules/peer-id/peer-id.js';
import { IpfsGlobalStore } from "./storage_ipfs.js";
import { LocalStorageStore } from "./storage_local.js";
import { identity, globalData, ipfs, ipfsConneced, ipfsConnecting, localData } from "./stores";
import cryptoKeys from '../../modules/libp2p-crypto-keys/keys.js';
import type { RSAEncrypter } from "./encryption.js";
import type { Identity } from "./exchange_group.js";

let encrypter: RSAEncrypter = null;

identity.subscribe(async (identity: Identity) => {
	if (identity) {
		encrypter = identity.encrypter;
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

	ipfsConneced.set(false);
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
		ipfsConneced.set(false);
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

	ipfsConneced.set(true);
	ipfsConnecting.set(false);
}
