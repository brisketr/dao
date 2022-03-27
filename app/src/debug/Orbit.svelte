<script lang="js">
	import * as IPFS from "ipfs-core";
	import OrbitDB from "orbit-db";
import { ipfs } from "../infoex/v1/stores";

	let node = null;
	let orbitdb = null;

	let ipfsId = "";
	let ipfsPeerCount = 0;

	let myDb = null;
	let myDbAddress = "";
	let myDbValueInput = "";
	let myDbValue = "";

	let remoteDb = null;
	let remoteDbAddress = "";
	let remoteDbAddressInput = "";
	let remoteDbLoadProgress = "";
	let remoteDbValue = "";

	async function orbitTest() {
		console.log("Init Orbit");

		// https://github.com/orbitdb/orbit-db/blob/main/examples/browser/example.js
		node = await IPFS.create({
			repo: "/debug/orbit",
			start: true,
			preload: {
				enabled: false,
			},
			EXPERIMENTAL: {
				ipnsPubsub: true,
			},
			config: {
				Addresses: {
					Swarm: [
						"/dns4/webrtc-star.app.brisket.lol/tcp/443/wss/p2p-webrtc-star",
						// "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/",
						// "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star/",
						// "/dns4/webrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star/",
					],
				},
				Bootstrap: []
			},
		});

		ipfsId = (await node.id()).id;
		window.ipfs = node;

		node.libp2p.connectionManager.on("peer:connect", async (connection) => {
			console.info(
				`Connected to ${connection.remotePeer.toB58String()}!`
			);

			ipfsPeerCount = (await node.swarm.peers()).length
		});

		node.libp2p.connectionManager.on("peer:disconnect", async (connection) => {
			console.info(
				`Disconnected from ${connection.remotePeer.toB58String()}!`
			);

			ipfsPeerCount = (await node.swarm.peers()).length
		});

		orbitdb = await OrbitDB.createInstance(node);
		myDb = await orbitdb.eventlog("my.log.db");
		console.info("Loading DB my.log.db...");
		myDbAddress = myDb.address.toString();
		console.info("DB Loaded");

		myDb.events.on("ready", () => {
			console.info("My DB Ready");
			queryMyDb();
		});

		myDb.events.on("replicated", () => {
			console.info("My DB Replicated");
			queryMyDb();
		});

		myDb.events.on("write", () => {
			console.info("My DB Write");
			queryMyDb();
		});

		myDb.events.on("replicate.progress", () => {
			console.info("My DB Replicate Progress");
			queryMyDb();
		});

		await myDb.load(10);
	}

	orbitTest();

	async function queryMyDb() {
		const results = myDb
			.iterator({ limit: 1 })
			.collect()
			.map((e) => e.payload.value);

		if (results.length > 0) {
			myDbValue = results[0];
		} else {
			myDbValue = "";
		}
	}

	async function setMyDbValue() {
		const val = myDbValueInput;
		myDbValueInput = "";
		console.info(`Setting DB value to ${val}`);
		const hash = await myDb.add(val);
		console.info(`DB value set; hash: ${hash}`);
	}

	async function queryRemoteDb() {
		const results = remoteDb
			.iterator({ limit: 1 })
			.collect()
			.map((e) => e.payload.value);

		if (results.length > 0) {
			remoteDbValue = results[0];
		} else {
			remoteDbValue = "";
		}
	}

	async function loadRemoteDb() {
		if (remoteDb) {
			// Destroy existing remote db.
			console.info("Destroying existing remote DB.");
			await remoteDb.close();
			remoteDb = null;
		}

		console.info(`Initializing to remote DB ${remoteDbAddressInput}...`);
		remoteDb = await orbitdb.eventlog(remoteDbAddressInput);
		console.info("Remote DB Initialized; Loading...");
		await remoteDb.load(1);
		console.info("Remote DB Loaded");
		queryRemoteDb();
		remoteDbAddress = remoteDb.address.toString();
		remoteDbAddressInput = "";
		remoteDbLoadProgress = "Searching network...";

		// Subscribe to remote db.
		console.info("Subscribing to remote DB events.");

		remoteDb.events.on("replicated", () => {
			console.info("Remote DB Replicated");
			queryRemoteDb();
		});

		remoteDb.events.on("write", () => {
			console.info("Remote DB Write");
			queryRemoteDb();
		});

		remoteDb.events.on("replicate.progress", () => {
			console.info("Remote DB Replicate Progress");
			queryRemoteDb();
		});

		remoteDb.events.on("ready", () => {
			console.info("Remote DB Ready");
			queryRemoteDb();
		});

		let maxTotal = 0, loaded = 0;

		remoteDb.events.on(
			"replicate.progress",
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

				remoteDbLoadProgress = `${maxTotal} / ${total}`;

				console.info(
					`Remote DB Load Progress: ${maxTotal} / ${total}`
				);
			}
		);
	}
</script>

<div id="ui">
	<table class="ui">
		<tr>
			<td>IPFS ID</td>
			<td class="wrap">{ipfsId}</td>
		</tr>
		<tr>
			<td>IPFS Peers</td>
			<td class="wrap">{ipfsPeerCount}</td>
		</tr>

		<tr>
			<td>My DB Address</td>
			<td class="wrap">{myDbAddress}</td>
		</tr>

		<tr>
			<td>My DB Value</td>
			<td class="wrap">{myDbValue}</td>
		</tr>

		<tr>
			<td>Set DB Value</td>
			<td>
				<div>
					<input type="text" bind:value={myDbValueInput} />
				</div>
				<div><button on:click={setMyDbValue}>Set</button></div>
			</td>
		</tr>

		<tr>
			<td>Remote DB Address</td>
			<td class="wrap">{remoteDbAddress}</td>
		</tr>

		<tr>
			<td>Remote DB Load Progress</td>
			<td>{remoteDbLoadProgress}</td>
		</tr>

		<tr>
			<td>Remote DB Value</td>
			<td class="wrap">{remoteDbValue}</td>
		</tr>

		<tr>
			<td>Load Remote DB</td>
			<td>
				<div>
					<input type="text" bind:value={remoteDbAddressInput} />
				</div>
				<div><button on:click={loadRemoteDb}>Load</button></div>
			</td>
		</tr>
	</table>
</div>

<style>
	td button {
		margin-bottom: 0;
	}
</style>
