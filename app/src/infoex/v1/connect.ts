import type { InfoExchange } from "@brisket-dao/core";
import { NOISE } from "@chainsafe/libp2p-noise";
import { BigNumber, ethers } from "ethers";
import * as IPFS from "ipfs-core";
import Libp2p from "libp2p";
import cryptoKeys from 'libp2p-crypto/src/keys';
import GossipSub from "libp2p-gossipsub";
import MPLEX from "libp2p-mplex";
import WebRTCStar from "libp2p-webrtc-star";
import Websockets from "libp2p-websockets";
import filters from "libp2p-websockets/src/filters";
import OrbitDB from "orbit-db";
import PeerID from 'peer-id';
import { PRODUCTION_NETWORK_ID } from "../../web3/constants.js";
import type { Contracts } from "../../web3/contracts.js";
import { address, contract, ethersProvider } from "../../web3/stores";
import type { RSAEncrypter } from "./encryption.js";
import { EthersExchangeContract } from "./exchange_contract_ethers.js";
import type { Identity } from "./exchange_group.js";
import { IpfsOrbitGlobalStore } from "./storage_ipfs_orbit.js";
import { LocalStorageStore } from "./storage_local.js";
import { eventCount, exchangeContractGenesis, globalData, identity, ipfs, ipfsConnected, ipfsConnecting, ipfsPeerCount, localData, orbit } from "./stores";
import { refreshCountdownInterval } from "./unlock_countdown.js";

let production = false;
let encrypter: RSAEncrypter = null;
let infoExchangeGenesis: InfoExchange = null;
let eventCountLocal: number = 0;
let addressLocal: string = "";
let nameSub = null;
let ethersProviderLocal = null;

eventCount.subscribe(async (e: number) => {
	eventCountLocal = e;
});

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

address.subscribe(async (address: string) => {
	if (address) {
		addressLocal = address;
	}
});

ethersProvider.subscribe(async (ethersProvider) => {
	if (ethersProvider) {
		ethersProviderLocal = ethersProvider;
	}
});

const transportKey = Websockets.prototype[Symbol.toStringTag];

/**
 * Increases event count, but debounces it to prevent excessive calls.
 */
let eventUpdateInterval = null;

function incEventCount() {
	// // Clear the interval to prevent multiple calls
	if (eventUpdateInterval) {
		clearTimeout(eventUpdateInterval);
	}

	// Set the interval to update the event count
	eventUpdateInterval = setTimeout(() => {
		eventCount.update(e => e + 1);
	}, 5000);
}

const libp2pBundle = (opts) => {
	// Set convenience variables to clearly showcase some of the useful things that are available
	const peerId = opts.peerId;
	const bootstrapList = opts.config.Bootstrap;

	// Build and return our libp2p node
	// n.b. for full configuration options, see https://github.com/libp2p/js-libp2p/blob/master/doc/CONFIGURATION.md
	const p2pconfig: any = {
		peerId,
		connectionManager: {
			// minConnections: 25,
			maxConnections: 100,
			pollInterval: 5000,
		},
		addresses: {
			listen: [
				"/dns4/webrtc-star.app.brisket.lol/tcp/443/wss/p2p-webrtc-star",
				// "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
				// "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
			],
		},
		modules: {
			// transport: [WebRTCStar, WebRTCDirect, Websockets],
			transport: [WebRTCStar, Websockets],
			// transport: [Websockets],
			streamMuxer: [MPLEX],
			connEncryption: [NOISE],
			pubsub: GossipSub,
		},
		config: {
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
	}

	if (!production) {
		p2pconfig.config.transport = {
			// This is added for local demo!
			// In a production environment the default filter should be used
			// where only DNS + WSS addresses will be dialed by websockets in the browser.
			[transportKey]: {
				filter: filters.all,
			},
		};
	}

	return Libp2p.create(p2pconfig);
};

async function createIpfs(repo: string, peerId: any) {
	console.info("Creating IPFS node...");
	const node: any = await IPFS.create({
		repo: repo,
		start: true,
		preload: {
			enabled: false,
		},
		config: {
			Bootstrap: [],
		},
		libp2p: libp2pBundle,
		// init: {
		// 	privateKey: peerId
		// }
	});

	node.libp2p.connectionManager.on("peer:connect", async (connection) => {
		console.info(
			`Connected to ${connection.remotePeer.toB58String()}!`
		);

		const peerCount = (await node.swarm.peers()).length;
		ipfsPeerCount.set(peerCount);
		console.log(`IPFS node peer count: ${(await node.swarm.peers()).length}`);

		if (peerCount > 0) {
			if (peerCount === 1) {
				// Asynchronously wait on first peer to increase reliability.
				await new Promise((resolve) => setTimeout(resolve, 2000));
			}

			ipfsConnected.set(true);
			ipfsConnecting.set(false);
		} else {
			ipfsConnected.set(false);
			ipfsConnecting.set(true);
		}
	});

	node.libp2p.connectionManager.on(
		"peer:disconnect",
		async (connection) => {
			console.info(
				`Disconnected from ${connection.remotePeer.toB58String()}!`
			);

			const peerCount = (await node.swarm.peers()).length;
			ipfsPeerCount.set(peerCount);
			console.log(`IPFS node peer count: ${(await node.swarm.peers()).length}`);

			if (peerCount > 0) {
				ipfsConnected.set(true);
				ipfsConnecting.set(false);
			} else {
				ipfsConnected.set(false);
				ipfsConnecting.set(true);
			}
		}
	);

	const ipfsId = (await node.id()).id;
	console.log(`IPFS node created with ID: ${ipfsId}`);

	try {
		let nodeAddr = "";

		if (!production) {
			console.info("Connecting to dev full node...");
			nodeAddr = "/ip4/127.0.0.1/tcp/4003/ws/p2p/12D3KooWAQRb7ewTnmRNWmafDmQ4pkgAAJ5bVEb1B31WFADtp8x6";
		} else {
			console.info("Connecting to production full node...");
			nodeAddr = "/dns4/dao-node.app.brisket.lol/tcp/443/wss/p2p/12D3KooWAQqx5zM2RrBGQQ9aYGtJJ9KRimqjFgi7YDbyCCiYUxjC";
		}

		await node.swarm.connect(nodeAddr);
	} catch (e) {
		console.error(`Failed to connect to full node`, e);
	}

	return node;
}

export async function connect() {

	if (encrypter === null) {
		throw new Error("No identity set");
	}

	// Check if address is not set or empty.
	if (addressLocal === "" || addressLocal === null) {
		throw new Error("No address set");
	}

	if (ethersProviderLocal === null) {
		throw new Error("No ethers provider set");
	}

	const network = await ethersProviderLocal.getNetwork();
	production = network.chainId === PRODUCTION_NETWORK_ID;

	// Connect to IPFS.
	console.info("Connecting to IPFS...");
	const ipfsPeerId = await encrypter.peerId(cryptoKeys, PeerID);

	// Repo is /brie/<address>
	const repo = `/brie/${addressLocal}`;
	console.info(`IPFS repo: ${repo}`);

	const newIpfs = await createIpfs(
		repo,
		ipfsPeerId
	);

	const ipfsId = await newIpfs.id();
	const nodeId = ipfsId.id;

	console.info(`Connected to IPFS as ${nodeId}`);

	const newOrbit = await OrbitDB.createInstance(newIpfs);
	const newGlobalData = await IpfsOrbitGlobalStore.create(newIpfs, newOrbit)
	const ls = new LocalStorageStore();
	ls.load();

	subscribeWeb3Events(infoExchangeGenesis);

	exchangeContractGenesis.set(new EthersExchangeContract(
		infoExchangeGenesis
	));

	if (nameSub) {
		nameSub.cancel();
	}

	nameSub = newGlobalData.onNameEvent(async (nameDbAddr) => {
		incEventCount();
	});

	orbit.set(newOrbit);
	globalData.set(newGlobalData);
	localData.set(ls)
	ipfs.set(newIpfs);
	ipfsConnected.set(false);
	ipfsConnecting.set(true);
}

function subscribeWeb3Events(infoExchangeGenesis: InfoExchange) {
	infoExchangeGenesis.on('CidRegistered', (staker, newCid) => {
		console.log(`CID registered for staker ${staker}: ${newCid}`);
		incEventCount();
		refreshCountdownInterval();
	});


	infoExchangeGenesis.on('Staked', (staker: string, amount: BigNumber) => {
		console.info(`Event: Staked ${ethers.utils.formatUnits(amount, 18)} tokens from ${staker}`);
		incEventCount();
		refreshCountdownInterval();
	});

	infoExchangeGenesis.on('Unstaked', (staker: string, amount: BigNumber) => {
		console.info(`Event: Unstaked ${ethers.utils.formatUnits(amount, 18)} tokens from ${staker}`);
		incEventCount();
		refreshCountdownInterval();
	});

	infoExchangeGenesis.on('EvictStaker', (staker: string) => {
		console.info(`Event: EvictStaker ${staker}`);
		incEventCount();
		refreshCountdownInterval();
	});
}

