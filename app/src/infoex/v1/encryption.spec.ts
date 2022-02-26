import { expect } from "chai";
import { describe } from "mocha";
import { Encrypter } from "./encryption";

import { webcrypto } from 'crypto'

describe("Encrypter", async () => {
	let passphrase = "passphrase";
	let salt = "salt";

	it("should decrypt what it encrypts", async () => {
		const encrypter = await Encrypter.create(passphrase, salt, webcrypto as any);

		const pubKey = await encrypter.exportPublicKey();

		// Encrypt.
		const encrypted = await encrypter.encrypt("Hello World", pubKey);

		// Decrypt.
		const decrypted = await encrypter.decrypt(encrypted);

		// Verify.
		expect(decrypted).to.equal("Hello World");
	});

});
