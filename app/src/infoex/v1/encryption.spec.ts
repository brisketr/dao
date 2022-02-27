import { expect } from "chai";
import { describe } from "mocha";
import { AESEncrypter, RSAEncrypter } from "./encryption";

import { webcrypto } from 'crypto'

describe("AESEncrypter", async () => {
	it("should decrypt what it encrypts", async () => {
		const aes1 = await AESEncrypter.create(webcrypto as any);

		// Export key, serialize & deserilize it to verify it works.
		const jwk1 = await aes1.exportKey();
		const jwkJson1 = JSON.stringify(jwk1);
		const jwk2 = JSON.parse(jwkJson1);

		const aes2 = await AESEncrypter.createFromJwk(webcrypto as any, jwk2);

		// Encrypt with aes2 and decrypt with aes1.
		const data = "Hello, world!";
		const encrypted = await aes2.encrypt(data);
		console.log(`encrypted: ${encrypted}`);
		const decrypted = await aes1.decrypt(encrypted);

		expect(decrypted).to.equal(data);
	});
});

describe("RSAEncrypter", async () => {
	let alicePhrase = "journey mobile kingdom concert super aim soldier gentle journey word arrive private know room palm";
	let bobPhrase = "shock inch giant ordinary upgrade category say cloth brand budget they gap banana leisure provide";

	it("should generate valid PeerId", async () => {
		const alice = await RSAEncrypter.create(webcrypto as any, alicePhrase);
		const peerId = await alice.peerId();

		expect(peerId.toString()).to.equal('bafzbeibpbkzcjnphscaphj5ypelvcqc57wuwif2zy3vvttugtuwwfzrp2q');

	});

	it("should throw error if BIP39 phrase is invalid", async () => {
		let err = null;

		try {
			await RSAEncrypter.create(webcrypto as any, 'bad phrase');
		} catch (e) {
			err = e;
		}

		expect(err).to.not.be.null;
		expect(err.message).to.equal("Invalid BIP39 phrase.");
	});

	it("should decrypt what it encrypts", async () => {
		const alice = await RSAEncrypter.create(webcrypto as any, alicePhrase);
		const bob = await RSAEncrypter.create(webcrypto as any, bobPhrase);

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
