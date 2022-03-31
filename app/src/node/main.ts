import { NOISE } from "@chainsafe/libp2p-noise";
import filters from "libp2p-websockets/src/filters";
import GossipSub from "libp2p-gossipsub";
import { ethers } from "ethers";
import * as IPFS from "ipfs-core";
import Libp2p from "libp2p";
import MPLEX from "libp2p-mplex";
import Websockets from "libp2p-websockets";
import OrbitDB from "orbit-db";
import { deserializeInfoCipherDoc } from "../infoex/v1/cipher_doc";
import { EthersExchangeContract } from "../infoex/v1/exchange_contract_ethers";
import { connectContracts } from "../web3/connect_contracts";
import type { Contracts } from "../web3/contracts";

const nameDbs = {};

async function pinNames(ipfs, db) {
	try {
		const namesLog = db.iterator({ limit: 1 })
			.collect()
			.map((e) => e.payload.value);

		if (namesLog.length === 0) {
			console.info(`Names not set for ${db.address}.`);
		}

		const names = namesLog[0];

		// Pin all names in the database concurrently.
		const promises = Object.entries(names).map(async ([name, cid]) => {
			console.info(`Pinning ${cid} for name ${db.address}/${name}...`);

			try {
				await ipfs.pin.add(cid, { timeout: 60000 });
			} catch (error) {
				console.error(`Error pinning ${cid} for name ${db.address}/${name}: ${error}`);
				console.error(error.stack);
			}
		});

		await Promise.all(promises);

	} catch (error) {
		console.error(`Error pinning names for ${db.address}: ${error}`);
		console.error(error.stack);
	}
}

async function subDbEvents(ipfs, orbit, db) {
	db.events.on("replicated", async () => {
		console.info(`Replicated: ${db.address.toString()}`);
		pinNames(ipfs, db);
	});

	db.events.on("ready", async () => {
		console.info(`Ready: ${db.address.toString()}`);
		pinNames(ipfs, db);
	});

	db.events.on("write", async () => {
		console.info(`Write: ${db.address.toString()}`);
		pinNames(ipfs, db);
	});

	let maxTotal = 0,
		loaded = 0;

	db.events.on("replicate.progress",
		(address, hash, entry, progress, total) => {
			loaded++;
			maxTotal = Math.max.apply(null, [maxTotal, progress, 0]);

			total = Math.max.apply(null, [
				progress,
				maxTotal,
				total,
				entry.clock.time,
				0,
			]);

			console.info(`Names db ${db.address.toString()} DB Replicate Progress: ${maxTotal} / ${total}`);
		}
	);
}

async function replicateDb(ipfs, orbit, stakerAddress, infoCipherDocCid) {
	try {
		console.info(`Looking up DB for CID ${infoCipherDocCid}...`);
		const infoCipherDocJsonStream = await ipfs.cat(infoCipherDocCid, {
			timeout: 30 * 1000
		});

		let infoCipherDocJson = "";

		for await (const chunk of infoCipherDocJsonStream) {
			console.info(`Retrieved chunk of size ${chunk.length} for key ${infoCipherDocCid}.`);
			infoCipherDocJson += chunk.toString();
		}

		const infoCipherDoc = await deserializeInfoCipherDoc(infoCipherDocJson);
		const nameDbAddr = infoCipherDoc.nameDb;

		if (nameDbAddr === "") {
			console.warn(`Empty/no name db for ${infoCipherDocCid}.`);
			return;
		}

		if (!(stakerAddress in nameDbs)) {
			console.info(`Replicating DB for staker ${stakerAddress}/CID ${infoCipherDocCid}: ${nameDbAddr}...`);
			nameDbs[stakerAddress] = await orbit.eventlog(nameDbAddr);
			subDbEvents(ipfs, orbit, nameDbs[stakerAddress]);
		} else {
			if (nameDbs[stakerAddress].address.toString() !== nameDbAddr) {
				console.info(`Closing/dropping old DB for CID ${infoCipherDocCid}: ${nameDbs[stakerAddress].address}...`);
				await nameDbs[stakerAddress].close();
				await nameDbs[stakerAddress].drop();
				console.info(`Replicating DB for CID ${infoCipherDocCid}: ${nameDbAddr}...`);
				nameDbs[stakerAddress] = await orbit.eventlog(nameDbAddr);
				subDbEvents(ipfs, orbit, nameDbs[stakerAddress]);
			}
		}
	} catch (error) {
		console.error(`Error replicating db for ${stakerAddress} infoCipherDoc@${infoCipherDocCid}: ${error}`);
		console.error(error.stack);
	}

}

async function pinContent(ipfs, orbit, contracts: Contracts) {
	console.log("Pinning latest content...");

	const infoEx = new EthersExchangeContract(contracts.InfoExchangeGenesis);

	// Iterate stakers & get CID values.
	console.info("Getting top stakers...");
	const topStakers = await infoEx.topStakers();

	// Close/delete any existing DBs that are not in the top stakers.
	const oldDbs = Object.keys(nameDbs).filter((stakerAddress) => !topStakers.find((s) => s.address === stakerAddress));

	for (const oldDb of oldDbs) {
		console.info(`Closing/dropping old DB for ex-staker ${oldDb}...`);
		await nameDbs[oldDb].close();
		await nameDbs[oldDb].drop();
		delete nameDbs[oldDb];
	}

	// Process all topStakers concurrently.
	const promises = topStakers.map(async (staker) => {
		try {
			console.log(`Looking up CID for staker ${staker.address}...`);

			const cid = await infoEx.cid(staker.address);

			if (cid !== null && cid !== "") {
				console.log(`Pinning CID for staker ${staker.address}: ${cid}...`);
				await ipfs.pin.add(cid, {
					timeout: 30 * 1000
				});
				console.log(`Pinned CID for staker ${staker.address}: ${cid}`);

				replicateDb(ipfs, orbit, staker.address, cid);
			}
		} catch (error) {
			console.log(`Error pinning CID for staker ${staker.address}`, error);
			console.error(error.stack);
		}
	});

	await Promise.all(promises);

	// Close any existing databases that are no longer associated with top stakers.
	for (const [stakerAddress, db] of Object.entries(nameDbs)) {
		if (!topStakers.find((e) => e.address.toString() === stakerAddress)) {
			console.info(`Closing/dropping DB for staker ${stakerAddress}...`);
			await (db as any).close();
			await (db as any).drop();
			delete nameDbs[stakerAddress];
		}
	}
}

const transportKey = Websockets.prototype[Symbol.toStringTag];

const libp2pBundle = (opts) => {
	// Set convenience variables to clearly showcase some of the useful things that are available
	const peerId = opts.peerId;
	const bootstrapList = opts.config.Bootstrap;

	// Build and return our libp2p node
	// n.b. for full configuration options, see https://github.com/libp2p/js-libp2p/blob/master/doc/CONFIGURATION.md
	return Libp2p.create({
		peerId,
		connectionManager: {
			minConnections: 25,
			maxConnections: 100,
			pollInterval: 5000,
		},
		addresses: {
			listen: [
				"/ip4/0.0.0.0/tcp/4003/ws",
				// "/ip4/0.0.0.0/tcp/4002",
				// "/dns4/webrtc-star.app.brisket.lol/tcp/443/wss/p2p-webrtc-star",
				// "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
				// "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
			],
		},
		modules: {
			// transport: [WebRTCStar, WebRTCDirect, Websockets],
			// transport: [WebRTCStar, Websockets],
			transport: [Websockets],
			streamMuxer: [MPLEX],
			connEncryption: [NOISE],
			pubsub: GossipSub,
		},
		config: {
			transport: {
				// This is added for local demo!
				// In a production environment the default filter should be used
				// where only DNS + WSS addresses will be dialed by websockets in the browser.
				[transportKey]: {
					filter: filters.all,
				},
			},
			peerDiscovery: {
				autoDial: true,
				bootstrap: {
					interval: 30e3,
					enabled: true,
					list: bootstrapList,
				},
			},
			pubsub: {
				enabled: true,
			},
		},
	});
};

async function main() {
	console.info("Starting Brie node...");
	const ipfs = (await IPFS.create({
		libp2p: libp2pBundle
	})) as any;
	const ipfsId = (await ipfs.id()).id;
	const orbit = await OrbitDB.createInstance(ipfs);
	console.log(`IPFS node created with ID: ${ipfsId}`);

	// ipfs.libp2p.connectionManager.on("peer:connect", async (connection) => {
	// 	console.info(
	// 		`Connected to ${connection.remotePeer.toB58String()}; Peer count: ${(await ipfs.swarm.peers()).length}`
	// 	);
	// });

	// ipfs.libp2p.connectionManager.on("peer:disconnect", async (connection) => {
	// 	console.info(
	// 		`Disconnected from ${connection.remotePeer.toB58String()}; Peer count: ${(await ipfs.swarm.peers()).length}`
	// 	);
	// });

	// Log peer count every minute.
	console.info(`Peer count: ${(await ipfs.swarm.peers()).length}`);

	setInterval(async () => {
		console.info(`Peer count: ${(await ipfs.swarm.peers()).length}`);
	}, 60 * 1000);

	// Connect to web3.
	const ethersProvider = new ethers.providers.JsonRpcProvider();
	const network = await ethersProvider.getNetwork();
	console.info("Connected to web3 network:", network);

	ethersProvider.on("disconnect", () => {
		console.info("Disconnected from web3");
	});

	// Connect contracts.
	const contracts = await connectContracts(ethersProvider);

	// Subscribe to contract events
	for (const evt of ['CidRegistered', 'EvictStaker', 'Staked', 'Unstaked']) {
		contracts.InfoExchangeGenesis.on(evt, async () => {
			console.info(`Contract event received: ${evt}`);
			pinContent(ipfs, orbit, contracts);
		});
	}

	pinContent(ipfs, orbit, contracts);
}

main();
