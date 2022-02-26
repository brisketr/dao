export interface EncryptedData {
	data: string;
	iv: Uint8Array;
}

function arrayBufferToBase64( buffer ) {
	var binary = '';
	var bytes = new Uint8Array( buffer );
	var len = bytes.byteLength;
	for (var i = 0; i < len; i++) {
		binary += String.fromCharCode( bytes[ i ] );
	}
	return btoa( binary );
}

function base64ToArrayBuffer(base64) {
    var binary_string =  atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

export class Encrypter {
	private aesKey: CryptoKey;
	private crypto: Crypto;

	private constructor() { }

	/**
	 * Encrypter factory method.
	 * 
	 * @param {string} passphrase The passphrase to use for encryption.
	 * @param {string} salt The salt to use for encryption.
	 * @param {Crypto} crypto The crypto object to use.
	 */
	public static async create(passphrase: string, salt: string, crypto: Crypto) {
		const result = new Encrypter();
		result.crypto = crypto;

		// Derive key using passphrase.
		// See also: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveKey#pbkdf2_2
		const key = await crypto.subtle.importKey(
			'raw',
			new TextEncoder().encode(passphrase),
			{
				name: 'PBKDF2'
			},
			false,
			['deriveKey', 'deriveBits']
		);

		// Derive key using salt.
		result.aesKey = await crypto.subtle.deriveKey(
			{
				name: 'PBKDF2',
				salt: new TextEncoder().encode(salt),
				iterations: 100000,
				hash: 'SHA-256'
			},
			key,
			{
				name: 'AES-GCM',
				length: 256
			},
			true,
			['encrypt', 'decrypt']
		);

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
		return this.crypto.subtle.exportKey('jwk', this.aesKey);
	}

	/**
	 * Encrypt the given data for the given public key.
	 * 
	 * @param {string} data The data to encrypt.
	 * @param {JsonWebKey} publicKey The public key to use for encryption
	 * 
	 * @returns {Promise<EncryptedData>} The encrypted data.
	 */
	public async encrypt(data: string, publicKey: JsonWebKey): Promise<EncryptedData> {
		const key = await this.crypto.subtle.importKey(
			'jwk',
			publicKey,
			{
				name: 'AES-GCM',
				length: 256
			},
			false,
			['encrypt']
		);

		const iv = this.crypto.getRandomValues(new Uint8Array(12));

		const encrypted = await this.crypto.subtle.encrypt(
			{
				name: 'AES-GCM',
				iv: iv
			},
			key,
			new TextEncoder().encode(data)
		);

		return {
			data: arrayBufferToBase64(encrypted),
			iv: iv
		};
	}

	/**
	 * Decrypt the given data.
	 * 
	 * @param {EncryptedData} encryptedData The encrypted data.
	 * @returns {Promise<string>} The decrypted data.
	 */
	public async decrypt(encryptedData: EncryptedData): Promise<string> {
		const decrypted = await this.crypto.subtle.decrypt(
			{
				name: 'AES-GCM',
				iv: encryptedData.iv
			},
			this.aesKey,
			base64ToArrayBuffer(encryptedData.data)
		);

		return new TextDecoder().decode(decrypted);
	}
}
