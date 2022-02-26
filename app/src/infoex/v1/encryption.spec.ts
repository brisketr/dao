import { expect } from "chai";
import { describe } from "mocha";
import { Encrypter } from "./encryption";

import { webcrypto } from 'crypto'

describe("Encrypter", async () => {
	let alicePhrase = "journey mobile kingdom concert super aim soldier gentle journey word arrive private know room palm";
	let bobPhrase = "shock inch giant ordinary upgrade category say cloth brand budget they gap banana leisure provide";

	it("should generate valid PeerId", async () => {
		const alice = await Encrypter.create(alicePhrase, webcrypto as any);
		const peerId = await alice.peerId();

		expect(peerId.toString()).to.equal('bafzbeibpbkzcjnphscaphj5ypelvcqc57wuwif2zy3vvttugtuwwfzrp2q');

	});

	it("should throw error if BIP39 phrase is invalid", async () => {
		let err = null;

		try {
			await Encrypter.create('bad phrase', webcrypto as any)
		} catch (e) {
			err = e;
		}

		expect(err).to.not.be.null;
		expect(err.message).to.equal("invalid BIP39 phrase");
	});

	it("should decrypt what it encrypts", async () => {
		const alice = await Encrypter.create(alicePhrase, webcrypto as any);
		const bob = await Encrypter.create(bobPhrase, webcrypto as any);

		// Get public key.
		const pubKey = await bob.exportPublicKey();

		// Convert pubKey to/from JSON string to make sure nothing breaks.
		const pubKeyJson = JSON.stringify(pubKey);
		const pubKey2 = JSON.parse(pubKeyJson);

		// Encrypt.
		const encrypted = await alice.encrypt("Hello World", pubKey2);

		console.log(`encrypted: ${encrypted}`);

		// Decrypt.
		const decrypted = await bob.decrypt(encrypted);

		// Verify.
		expect(decrypted).to.equal("Hello World");
	});

});
