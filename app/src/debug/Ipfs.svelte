<script lang="js">
	import * as IPFS from "ipfs-core";

	async function ipfsTest() {
		// console.log("connecting to ipfs...");
		// const node = await create();
		// console.log("adding data to ipfs...");
		// const results = node.add(data)

		// // for await (const { cid } of results) {
		// // 	console.log(`data added to ipfs: ${cid}`)
		// // }
		console.log("Init IPFS");
		// const IpfsModule = await import("../modules/ipfs-core/ipfs-core.js");
		// const IpfsModule = await import("ipfs-core");
		// const IPFS = IpfsModule.default;
		console.log(IPFS);
		const node = await IPFS.create();
		console.log(node);
		const identity = await node.id();
		const nodeId = identity.id;
		console.info("nodeId", nodeId);

		console.log("adding data to ipfs...");
		const data = "Hello, BrisketRib!";
		const { cid } = await node.add(data);
		console.log(`data added to ipfs: ${cid}`);
	}

	ipfsTest();
</script>

<div id="ui">
	<p>Hello</p>
</div>
