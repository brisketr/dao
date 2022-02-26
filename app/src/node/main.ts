import {
	BRIBAirdrop202107__factory,
	BRIBSnapshot202107__factory,
	BRIBToken__factory,
	BrisketTreasury__factory,
	InfoExchange__factory,
} from "@brisket-dao/core";

import * as IPFS from 'ipfs-core'

async function main() {
	console.log("Hello World 2!");
	const ipfs = await IPFS.create();
	const { cid } = await ipfs.add('Hello world 4');
	console.info(`Published to IPFS: ${cid}`);
}

main();
