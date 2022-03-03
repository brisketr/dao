import { AESEncrypter, RSAEncrypter } from "./encryption";

/**
 * Represents an interesting on-chain account.
 */
export interface InfoDocAccount {
	/**
	 * Ethereum address of the account.
	 */
	address: string;
}

/**
 * Document.
 */
export interface InfoDoc {
	/**
	 * List of interesting accounts.
	 */
	accounts: InfoDocAccount[];
}

/**
 * Version of the InfoDoc that is encrypted. The cipher doc includes an AES
 * encryption/decryption key.
 */
export interface InfoCipherDoc {
	/**
	 * IPNS to get latest version of the document.
	 */
	ipns: string;

	/**
	 * CID that the doc is stored at. Only set after retrieval. Not stored.
	 */
	cid?: string;

	/**
	 * RSA public key of the document owner.
	 */
	ownerRSAPubKey: JsonWebKey;

	/**
	 * RSA public keys allowed to access the document.
	 */
	allowedRSAPublicKeys: JsonWebKey[];

	/**
	 * AES encryption/decryption key. The key is encrypted for each allowed
	 * public key.
	 */
	encryptedDocAESKeys: string[];

	/**
	 * Encrypted document.
	 */
	encryptedDoc: string;
}

/**
 * Serialize the given cipher document.
 * 
 * @param {InfoCipherDoc} cipherDoc The cipher document to serialize.
 * @returns {Promise<string>} The serialized cipher document.
 */
export async function serializeInfoCipherDoc(cipherDoc: InfoCipherDoc): Promise<string> {
	// Return doc serialized as JSON.
	// Clear cid before serialization.
	cipherDoc.cid = undefined;
	return JSON.stringify(cipherDoc);
}

/**
 * Deserialize the given cipher document.
 * 
 * @param {string} cipherDocJson The cipher document to deserialize.
 * @returns {Promise<InfoCipherDoc>} The deserialized cipher document.
 */
export async function deserializeInfoCipherDoc(cipherDocJson: string): Promise<InfoCipherDoc> {
	// Return doc deserialized from JSON.
	return JSON.parse(cipherDocJson);
}

/**
 * Serialize the given document.
 *
 * @param {InfoDoc} doc The document to serialize.
 * @returns {Promise<string>} The serialized document.
 */
export async function serializeInfoDoc(doc: InfoDoc): Promise<string> {
	// Return doc serialized as JSON.
	return JSON.stringify(doc);
}

/**
 * Deserialize the given document.
 * 
 * @param {string} docJson The document to deserialize.
 * @returns {Promise<InfoDoc>} The deserialized document.
 */
export async function deserializeInfoDoc(docJson: string): Promise<InfoDoc> {
	// Return doc deserialized from JSON.
	return JSON.parse(docJson);
}

/**
 * Serializes & encrypts the given document.
 * 
 * @param {Crypto} crypto The crypto object to use.
 * @param {JsonWebKey[]} allowedRSAPublicKeys The public keys allowed to access the document.
 * @param {RSAEncrypter} rsaEncrypter The owner RSA encrypter to use.
 * @param {InfoDoc} doc The document to encrypt.
 * @returns {Promise<InfoCipherDoc>} The encrypted document.
 */
export async function encryptInfoDoc(
	crypto: Crypto,
	allowedRSAPublicKeys: JsonWebKey[],
	rsaEncrypter: RSAEncrypter,
	doc: InfoDoc
): Promise<InfoCipherDoc> {

	const result = {
		ipns: '',
		ownerRSAPubKey: await rsaEncrypter.exportPublicKey(),
		allowedRSAPublicKeys: allowedRSAPublicKeys,
		encryptedDocAESKeys: [],
		encryptedDoc: ''
	};

	// Generate the AES encrypter.
	const aesEncrypter = await AESEncrypter.create(crypto);

	// Get the serialized JWK key of the AES encrypter.
	const aesJwk = await aesEncrypter.exportKey();
	const aesJskJson = JSON.stringify(aesJwk);

	// Encrypt the AES key for each allowed public key.
	for (const allowedRSAPublicKey of allowedRSAPublicKeys) {
		const encryptedAesJskJson = await rsaEncrypter.encrypt(aesJskJson, allowedRSAPublicKey);
		result.encryptedDocAESKeys.push(encryptedAesJskJson);
	}

	// Serialize the document.
	const docJson = await serializeInfoDoc(doc);

	// Encrypt the document.
	result.encryptedDoc = await aesEncrypter.encrypt(docJson);

	return result;
}

/**
 * Error type for when no key is found when trying to decrypt the document.
 */
export class NoKeyFoundError extends Error {
}

/**
 * Decrypts the given cipher document.
 * 
 * @param {Crypto} crypto The crypto object to use.
 * @param {RSAEncrypter} rsaEncrypter The owner RSA encrypter to use.
 * @param {InfoCipherDoc} cipherDoc The cipher document to decrypt.
 * @returns {Promise<InfoDoc>} The decrypted document.
 * @throws {NoKeyFoundError} If no decryptable key is found.
 */
export async function decryptInfoCipherDoc(
	crypto: Crypto,
	rsaEncrypter: RSAEncrypter,
	cipherDoc: InfoCipherDoc
): Promise<InfoDoc> {

	// Attempt to decrypt each AES key, stopping when one succeeds. If none
	// succeed, throw an error.
	let aesJsk: JsonWebKey;

	if (cipherDoc.encryptedDocAESKeys === undefined
		|| cipherDoc.encryptedDocAESKeys === null
		|| cipherDoc.encryptedDocAESKeys.length === 0) {
		throw new NoKeyFoundError();
	}

	for (const encryptedAesJskJson of cipherDoc.encryptedDocAESKeys) {
		try {
			const aesJskJson = await rsaEncrypter.decrypt(encryptedAesJskJson);
			aesJsk = JSON.parse(aesJskJson);
		} catch (e) {
			continue;
		}
	}

	if (!aesJsk) {
		throw new NoKeyFoundError();
	}

	// Create the AES encrypter.
	const aesEncrypter = await AESEncrypter.createFromJwk(crypto, aesJsk);

	// Decrypt the document.
	const serializedDoc = await aesEncrypter.decrypt(cipherDoc.encryptedDoc);

	// Deserialize the document.
	const doc = await deserializeInfoDoc(serializedDoc);

	return doc;
}




