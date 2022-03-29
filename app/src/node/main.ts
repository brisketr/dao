import { ethers } from "ethers";
import * as IPFS from "ipfs-core"
import { connectContracts } from "../web3/connect_contracts";

async function main() {
	console.info("Hello World 2!");
	const ipfs = (await IPFS.create()) as any;
	const { cid } = await ipfs.add("Hello world 4");
	console.info(`Published to IPFS: ${cid}`);

	ipfs.libp2p.connectionManager.on("peer:connect", async (connection) => {
		console.info(
			`Connected to ${connection.remotePeer.toB58String()}; Peer count: ${(await ipfs.swarm.peers()).length}`
		);
	});

	ipfs.libp2p.connectionManager.on("peer:disconnect", async (connection) => {
		console.info(
			`Disconnected from ${connection.remotePeer.toB58String()}; Peer count: ${(await ipfs.swarm.peers()).length}`
		);
	});

	// Connect to web3.
	const ethersProvider = new ethers.providers.JsonRpcProvider();
	const network = await ethersProvider.getNetwork();
	console.info("Connected to web3 network:", network);

	ethersProvider.on("disconnect", () => {
		console.info("Disconnected from web3");
	});

	// Connect contracts.
	const contracts = connectContracts(ethersProvider);

	// Subscribe to contract events

    // event CidRegistered(address staker, string newCid);
    // event EvictStaker(address staker);
    // event Staked(address indexed staker, uint256 amount);
    // event Unstaked(address indexed staker, uint256 amount);

	// Iterate stakers & get initial CID values.

	// Pin CIDs as they become available
	// Replicate DBs as they become available
}

main();
