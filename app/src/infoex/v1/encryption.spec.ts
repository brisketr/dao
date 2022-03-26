import { expect } from "chai";
import { webcrypto } from 'crypto';
import cryptoKeys from 'libp2p-crypto/src/keys';
import { describe } from "mocha";
import PeerId from 'peer-id';
import { pem2jwk } from 'pem-jwk';
import RSAKey from 'seededrsa';
import { AESEncrypter, RSAEncrypter, sha256 } from "./encryption";

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
		const alice = await RSAEncrypter.create(webcrypto as any, RSAKey, pem2jwk, alicePhrase);
		const peerId = await alice.peerId(cryptoKeys, PeerId);

		expect(peerId.toString()).to.equal('bafzbeibpbkzcjnphscaphj5ypelvcqc57wuwif2zy3vvttugtuwwfzrp2q');

	});

	it("should decrypt what it encrypts", async () => {
		const alice = await RSAEncrypter.create(webcrypto as any, RSAKey, pem2jwk, alicePhrase);
		const bob = await RSAEncrypter.create(webcrypto as any, RSAKey, pem2jwk, bobPhrase);

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

describe("Hash", async () => {
	it("should hash", async () => {
		const data = "Hello, world!";
		const digest = await sha256(webcrypto as any, data);
		console.log(`digest: ${digest}`);
		expect(digest).to.equal("315f5bdb76d078c43b8ac0064e4a0164612b1fce77c869345bfc94c75894edd3");
	});
});
