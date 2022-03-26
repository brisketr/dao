<script lang="js">
	// import * as IPFS from "js-ipfs/packages/ipfs-core";
	import * as IPFS from "ipfs-core";

	let connectPeerAddress = "";
	let pubsubMsg = "";
	let nameToResolve = "";
	let node = null;

	async function ipfsTest() {
		console.log("Init IPFS");
		console.log("Connecting to weepinbell webrtc-star.");

		node = await IPFS.create({
			repo: "debug",
			EXPERIMENTAL: { ipnsPubsub: true },
			config: {
				Addresses: {
					Swarm: [
						"/dns4/webrtc-star.app.brisket.lol/tcp/443/wss/p2p-webrtc-star",
					],
				},
				// If you want to connect to the public bootstrap nodes, remove the next line
				Bootstrap: [],
			},
			libp2p: {
				config: {
					dht: {
						enabled: false,
					},
				},
			},
		});

		window.ipfs = node;

		// node = IPFS.create("https://dweb.link:5001");

		console.log(node);
		console.info("getting identity");
		const identity = await node.id();
		const nodeId = identity.id;
		console.info("nodeId", nodeId);

		node.pubsub.subscribe('test-topic', (msg) => {
			console.log(`got message on test-topic from ${msg.from}: ${msg.data}`, msg);
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
			ttl: "24h"
		});
		console.info(`published name at ${n.name}.`, n);

	}

	async function resolve() {
		console.log(`resolving ${nameToResolve}`);
		for await (const path of node.name.resolve(nameToResolve, {stream: false})) {
			console.log(`resolved name ${nameToResolve}: ${path}`);
		}

		nameToResolve = "";
	}

	async function sendMessage() {
		node.pubsub.publish('test-topic', pubsubMsg);
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
