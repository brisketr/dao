import { validateMnemonic } from 'bip39'
import RSAKey from 'seededrsa'
import { pem2jwk } from 'pem-jwk';
import cryptoKeys from 'libp2p-crypto/src/keys'
const fromJwk = cryptoKeys.supportedKeys.rsa.fromJwk;
import PeerId from 'peer-id'

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

export class Encrypter {
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
	 * @param {string} passphrase The passphrase used to generate the keys.
	 * @param {Crypto} crypto The crypto object to use.
	 */
	public static async create(bip39Phrase: string, crypto: Crypto) {

		// Validate that the bip39 phrase is valid.
		if (!validateMnemonic(bip39Phrase)) {
			throw new Error("invalid BIP39 phrase");
		}

		const result = new Encrypter();
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
	 * @param {JsonWebKey} publicKey The public key.
	 * @returns {Promise<boolean>} true if given key matches our public key.
	 */
	public async matchesPublicKey(publicKey: JsonWebKey): Promise<boolean> {
		const pubKey = await this.exportPublicKey();
		return pubKey.kty === publicKey.kty && pubKey.n === publicKey.n && pubKey.e === publicKey.e;
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
}
