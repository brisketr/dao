import { validateMnemonic } from 'bip39';
import cryptoKeys from 'libp2p-crypto/src/keys';
import PeerId from 'peer-id';
import { pem2jwk } from 'pem-jwk';
import RSAKey from 'seededrsa';
const fromJwk = cryptoKeys.supportedKeys.rsa.fromJwk;

function arrayBufferToBase64(buffer) {
	var binary = '';
	var bytes = new Uint8Array(buffer);
	var len = bytes.byteLength;
	for (var i = 0; i < len; i++) {
		binary += String.fromCharCode(bytes[i]);
	}
	return btoa(binary);
}

function base64ToArrayBuffer(base64) {
	var binary_string = atob(base64);
	var len = binary_string.length;
	var bytes = new Uint8Array(len);
	for (var i = 0; i < len; i++) {
		bytes[i] = binary_string.charCodeAt(i);
	}
	return bytes.buffer;
}

function arrayBufferToHex(buffer) {
	return Array.prototype.map.call(
		new Uint8Array(buffer),
		x => ('00' + x.toString(16)).slice(-2)
	).join('');
}

/**
 * @param {JsonWebKey} a The public key.
 * @param {JsonWebKey} b The public key to compare to.
 * @returns {Promise<boolean>} true if given key matches our public key.
 */
export async function keysAreEqual(a: JsonWebKey, b: JsonWebKey): Promise<boolean> {
	return a.kty === b.kty && a.n === b.n && a.e === b.e;
}

export class RSAEncrypter {
	private privKey: CryptoKey;
	private pubKey: CryptoKey;

	private privKeyJwk: JsonWebKey;
	private pubKeyJwk: JsonWebKey;

	private privKeyPem: string;
	private pubKeyPem: string;

	private crypto: Crypto;

	private constructor() { }

	/**
	 * Encrypter factory method.
	 * 
	 * @param {Crypto} crypto The crypto object to use.
	 * @param {string} passphrase The passphrase used to generate the keys.
	 */
	public static async create(crypto: Crypto, bip39Phrase: string) {

		// Validate that the bip39 phrase is valid.
		if (!validateMnemonic(bip39Phrase)) {
			throw new Error("Invalid BIP39 phrase.");
		}

		const result = new RSAEncrypter();
		const rsa = new RSAKey(bip39Phrase);
		const kp = await rsa.generateNew(2048);

		// Import private key.
		result.privKeyPem = kp.privateKey;
		result.privKeyJwk = pem2jwk(kp.privateKey);
		result.privKey = await crypto.subtle.importKey(
			'jwk',
			result.privKeyJwk,
			{
				name: 'RSA-OAEP',
				hash: { name: 'SHA-256' }
			},
			false,
			['decrypt']
		);

		// Import public key.
		result.pubKeyPem = kp.publicKey;
		result.pubKeyJwk = pem2jwk(kp.publicKey);
		result.pubKey = await crypto.subtle.importKey(
			'jwk',
			result.pubKeyJwk,
			{
				name: 'RSA-OAEP',
				hash: { name: 'SHA-256' }
			},
			true,
			['encrypt']
		);

		result.crypto = crypto;
		return result;
	}

	/**
	 * Export the public key.
	 * 
	 * @returns {Promise<JsonWebKey>} The public key.
	 */
	public async exportPublicKey(): Promise<JsonWebKey> {
		return this.crypto.subtle.exportKey('jwk', this.pubKey);
	}

	/**
	 * Encrypt the given data for the given public key.
	 * 
	 * @param {string} data The data to encrypt.
	 * @param {JsonWebKey} publicKey The public key to use for encryption
	 * 
	 * @returns {Promise<string>} The encrypted data.
	 */
	public async encrypt(data: string, publicKey: JsonWebKey): Promise<string> {
		const key = await this.crypto.subtle.importKey(
			'jwk',
			publicKey,
			{
				name: 'RSA-OAEP',
				hash: { name: 'SHA-256' }
			},
			false,
			['encrypt']
		);

		const encrypted = await this.crypto.subtle.encrypt(
			{
				name: 'RSA-OAEP'
			},
			key,
			new TextEncoder().encode(data)
		);

		return arrayBufferToBase64(encrypted);
	}

	/**
	 * Decrypt the given data.
	 * 
	 * @param {string} encryptedData The encrypted data.
	 * @returns {Promise<string>} The decrypted data.
	 */
	public async decrypt(encryptedData: string): Promise<string> {
		// Get IV and ciphertext.
		const ciphertext = base64ToArrayBuffer(encryptedData);

		const decrypted = await this.crypto.subtle.decrypt(
			{
				name: 'RSA-OAEP'
			},
			this.privKey,
			ciphertext
		);

		return new TextDecoder().decode(decrypted);
	}

	/**
	 * Get the PeerId for this encrypter.
	 * 
	 * See Also: https://discuss.ipfs.io/t/js-ipfs-restoring-rsa-keys/5002/3
	 * 
	 * @returns {Promise<PeerId>} The PeerId.
	 */
	public async peerId(): Promise<PeerId> {
		const priv = await fromJwk(this.privKeyJwk);
		return PeerId.createFromPrivKey(cryptoKeys.marshalPrivateKey(priv));
	}
}

export class AESEncrypter {
	private crypto: Crypto;

	private key: CryptoKey;

	private constructor() { }

	/**
	 * Create an AESEncrypter with a generated key.
	 * 
	 * @param {Crypto} crypto The crypto object to use.
	 * @returns {Promise<AESEncrypter>} The encrypter.
	 */
	public static async create(crypto: Crypto): Promise<AESEncrypter> {
		const result = new AESEncrypter();
		result.crypto = crypto;

		const key = await crypto.subtle.generateKey(
			{
				name: 'AES-GCM',
				length: 256
			},
			true,
			['encrypt', 'decrypt']
		);

		result.key = key;

		return result;
	}

	/**
	 * Create an AESEncrypter with a key given in JWK format.
	 * 
	 * @param {Crypto} crypto The crypto object to use.
	 * @param {JsonWebKey} key The key.
	 * @returns {Promise<AESEncrypter>} The encrypter.
	 */
	public static async createFromJwk(crypto: Crypto, key: JsonWebKey): Promise<AESEncrypter> {
		const result = new AESEncrypter();
		result.crypto = crypto;

		const k = await crypto.subtle.importKey(
			'jwk',
			key,
			{
				name: 'AES-GCM',
				length: 256
			},
			true,
			['encrypt', 'decrypt']
		);

		result.key = k;

		return result;
	}

	/**
	 * Export the key.
	 * 
	 * @returns {Promise<JsonWebKey>} The key as a JWK.
	 */
	public async exportKey(): Promise<JsonWebKey> {
		return this.crypto.subtle.exportKey('jwk', this.key);
	}

	/**
	 * Encrypt the given data.
	 * 
	 * @param {string} data The data to encrypt.
	 * @returns {Promise<string>} The encrypted data.
	 */
	public async encrypt(data: string): Promise<string> {
		const iv = this.crypto.getRandomValues(new Uint8Array(12));
		const ciphertext = await this.crypto.subtle.encrypt(
			{
				name: 'AES-GCM',
				iv
			},
			this.key,
			new TextEncoder().encode(data)
		);

		// Combine IV and ciphertext.
		const result = new Uint8Array(iv.byteLength + ciphertext.byteLength);
		result.set(iv);
		result.set(new Uint8Array(ciphertext), iv.byteLength);

		return arrayBufferToBase64(result);
	}

	/**
	 * Decrypt the given data.
	 * 
	 * @param {string} encryptedData The encrypted data.
	 * @returns {Promise<string>} The decrypted data.
	 */
	public async decrypt(encryptedData: string): Promise<string> {
		const data = base64ToArrayBuffer(encryptedData);

		const iv = data.slice(0, 12);
		const ciphertext = data.slice(12);

		const decrypted = await this.crypto.subtle.decrypt(
			{
				name: 'AES-GCM',
				iv
			},
			this.key,
			ciphertext
		);

		return new TextDecoder().decode(decrypted);
	}
}

/**
 * Compute SHA256 of the given string and return the result as a hex string.
 * 
 * @param {Crypto} crypto The crypto object to use.
 * @param {string} data The data to hash.
 * @returns {Promise<string>} The hash.
 */
export async function sha256(crypto: Crypto, data: string): Promise<string> {
	const hash = await crypto.subtle.digest(
		{
			name: 'SHA-256'
		},
		new TextEncoder().encode(data)
	);

	return arrayBufferToHex(hash);
}
