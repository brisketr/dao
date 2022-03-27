<script lang="js">
	// import * as IPFS from "js-ipfs/packages/ipfs-core";
	import Libp2p from "libp2p";
	import * as IPFS from "ipfs-core";
	import KadDHT from "libp2p-kad-dht";
	import Websockets from "libp2p-websockets";
	import WebRTCStar from "libp2p-webrtc-star";
	// import WebRTCDirect from "libp2p-webrtc-direct";
	const transportKey = WebRTCStar.prototype[Symbol.toStringTag];
	import filters from "libp2p-websockets/src/filters";
	import Bootstrap from "libp2p-bootstrap";
	import MPLEX from "libp2p-mplex";
	import { NOISE } from "@chainsafe/libp2p-noise";
	import GossipSub from "libp2p-gossipsub";

	// import MPLEX from "libp2p-mplex";
	// import SECIO from "libp2p-secio";

	let connectPeerAddress = "";
	let pubsubMsg = "";
	let nameToResolve = "";
	let node = null;

	const libp2pBundle = (opts) => {
		// Set convenience variables to clearly showcase some of the useful things that are available
		const peerId = opts.peerId;
		const bootstrapList = opts.config.Bootstrap;

		// Build and return our libp2p node
		// n.b. for full configuration options, see https://github.com/libp2p/js-libp2p/blob/master/doc/CONFIGURATION.md
		return Libp2p.create({
			peerId,
			// addresses: {
			// 	listen: [
			// 		"/dns4/webrtc-star.app.brisket.lol/tcp/443/wss/p2p-webrtc-star",
			// 		// "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
			// 		// "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
			// 	],
			// },
			// Lets limit the connection managers peers and have it check peer health less frequently
			connectionManager: {
				minPeers: 25,
				maxPeers: 100,
				pollInterval: 5000,
			},
			modules: {
				// transport: [WebRTCStar, WebRTCDirect, Websockets],
				// transport: [WebRTCStar, Websockets],
				transport: [Websockets],
				streamMuxer: [MPLEX],
				connEncryption: [NOISE],
				peerDiscovery: [Bootstrap],
				// peerDiscovery: [WebRTCStar],
				dht: KadDHT,
				pubsub: GossipSub,
			},
			config: {
				peerDiscovery: {
					autoDial: true, // auto dial to peers we find when we have less peers than `connectionManager.minPeers`
					// mdns: {
					// 	interval: 10000,
					// 	enabled: true,
					// },
					bootstrap: {
						interval: 30e3,
						enabled: true,
						list: bootstrapList,
					},
					// webRTCStar: {
					// 	// <- note the lower-case w - see https://github.com/libp2p/js-libp2p/issues/576
					// 	enabled: true,
					// },
				},
				// Turn on relay with hop active so we can connect to more peers
				relay: {
					enabled: true,
					hop: {
						enabled: true,
						active: true,
					},
				},
				dht: {
					// enabled: true,
					enabled: true,
					clientMode: false,
					kBucketSize: 20,
					randomWalk: {
						enabled: true,
						interval: 10e3, // This is set low intentionally, so more peers are discovered quickly. Higher intervals are recommended
						timeout: 2e3, // End the query quickly since we're running so frequently
					},
				},
				pubsub: {
					enabled: true,
				},
				transport: {
					// This is added for local demo!
					// In a production environment the default filter should be used
					// where only DNS + WSS addresses will be dialed by websockets in the browser.
					[transportKey]: {
						filter: filters.all,
					},
				},
			},
			// metrics: {
			// 	enabled: true,
			// 	computeThrottleMaxQueueSize: 1000, // How many messages a stat will queue before processing
			// 	computeThrottleTimeout: 2000, // Time in milliseconds a stat will wait, after the last item was added, before processing
			// 	movingAverageIntervals: [
			// 		// The moving averages that will be computed
			// 		60 * 1000, // 1 minute
			// 		5 * 60 * 1000, // 5 minutes
			// 		15 * 60 * 1000, // 15 minutes
			// 	],
			// 	maxOldPeersRetention: 50, // How many disconnected peers we will retain stats for
			// },
		});
	};

	async function ipfsTest() {
		console.log("Init IPFS");
		console.log("Connecting to weepinbell webrtc-star.");

		// https://github.com/ipfs-examples/js-ipfs-custom-libp2p/blob/main/index.js

		node = await IPFS.create({
			repo: "debug",
			// EXPERIMENTAL: { ipnsPubsub: true },
			config: {
				Addresses: {
					Swarm: [
						// "/dns4/webrtc-star.app.brisket.lol/tcp/443/wss/p2p-webrtc-star",
						"/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
					],
				},
				// 	// If you want to connect to the public bootstrap nodes, remove the next line
				Bootstrap: [
					// "/ip4/127.0.0.1/tcp/9090/http/p2p-webrtc-direct/p2p/12D3KooWG6tJnS3X2KAJ3vv8qXvi9PpwnVWURTMLgDz1CcBMjunH",
					// "/dns6/localhost/tcp/4003/ws/p2p/12D3KooWJnZNfN8J6NGYWZ2AwR5qkYHJqyG8RpAehUdUKzjg1xWc",
					// "/ip4/127.0.0.1/tcp/9999/ws/12D3KooWDAdAMJMXq383LNu7QHmH3Y8SWhrVT9BRr3b3BzoMtXez"
				],
				// 	Routing: "dhtserver",
			},
			// libp2p: libp2pBundle,
		});

		window.ipfs = node;

		// node = IPFS.create("https://dweb.link:5001");

		console.log(node);
		console.info("getting identity");
		const identity = await node.id();
		const nodeId = identity.id;
		console.info("nodeId", nodeId);

		node.pubsub.subscribe("test-topic", (msg) => {
			console.log(
				`got message on test-topic from ${msg.from}: ${msg.data}`,
				msg
			);
		});

		// node.pubsub.subscribe('/record/L2lwbnMvACQIARIgGgGB7UO80oBdbKVIy_6u-A0cDMtDv4Yl5FgJDGjYc8g', (msg) => {
		// 	console.log(`got message on /record/L2lwbnMvACQIARIgGgGB7UO80oBdbKVIy_6u-A0cDMtDv4Yl5FgJDGjYc8g from ${msg.from}: ${msg.data}`, msg);
		// });

		// console.info("publishing IPNS");
		// const { n } = await node.name.publish(cid);
		// console.info(`published name at ${n}.`);

		// // Log peers every 5 seconds.
		// setInterval(async () => {
		// 	console.log("Peers:", await node.swarm.peers());
		// }, 5000);

		node.libp2p.connectionManager.on("peer:connect", (connection) => {
			console.info(
				`Connected to ${connection.remotePeer.toB58String()}!`
			);
		});

		// try {
		// 	console.log("connecting to go-ipfs node...");
		// 	await node.swarm.connect(
		// 		"/ip4/127.0.0.1/tcp/9999/ws/p2p/12D3KooWDAdAMJMXq383LNu7QHmH3Y8SWhrVT9BRr3b3BzoMtXez"
		// 	);
		// } catch (e) {
		// 	console.error(`failed to connect to go-ipfs node`, e);
		// }
	}

	async function connectPeer() {
		console.log(`connecting to ${connectPeerAddress}`);
		await node.swarm.connect(connectPeerAddress);
		connectPeerAddress = "";
	}

	async function publish() {
		console.log("adding data to ipfs...");
		const data = "Hello, BrisketRib!";
		const { cid } = await node.add(data);
		console.log(`data added to ipfs: ${cid}`);

		console.info("publishing IPNS");
		const n = await node.name.publish(cid, {
			ttl: "24h",
		});
		console.info(`published name at ${n.name}.`, n);
	}

	async function resolve() {
		console.log(`resolving ${nameToResolve}`);
		for await (const path of node.name.resolve(nameToResolve, {
			stream: false,
		})) {
			console.log(`resolved name ${nameToResolve}: ${path}`);
		}

		nameToResolve = "";
	}

	async function sendMessage() {
		node.pubsub.publish("test-topic", pubsubMsg);
		pubsubMsg = "";
	}

	ipfsTest();
</script>

<div id="ui">
	<p>Hello</p>
	<div>
		<input type="text" bind:value={connectPeerAddress} />
		<button on:click={connectPeer}>Connect</button>
	</div>
	<div>
		<input type="text" bind:value={pubsubMsg} />
		<button on:click={sendMessage}>Send message</button>
	</div>
	<div>
		<input type="text" bind:value={nameToResolve} />
		<button on:click={resolve}>Resolve</button>
	</div>
	<div>
		<button on:click={publish}>Publish</button>
	</div>
</div>
