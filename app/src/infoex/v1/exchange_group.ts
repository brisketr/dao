import type { BigNumber } from "ethers";
import { decryptInfoCipherDoc, deserializeInfoCipherDoc, encryptInfoDoc, InfoCipherDoc, InfoDoc, NoKeyFoundError, serializeInfoCipherDoc } from "./cipher_doc";
import { keysAreEqual, RSAEncrypter, sha256 } from "./encryption";

type DataStoreKey = string;
type DataStoreName = string;

function logInfo(...args: any[]): void {
	console.log("exchange_group - INFO - ", ...args);
}

function logError(...args: any[]): void {
	console.error("exchange_group - ERROR - ", ...args);
}

function logWarn(...args: any[]): void {
	console.warn("exchange_group - WARN - ", ...args);
}

export interface GlobalDataStore {
	put(value: string): Promise<DataStoreKey>;
	get(key: DataStoreKey): Promise<string>;
	publishName(subKey: DataStoreKey, contentKey: DataStoreKey): Promise<DataStoreName>;
	resolveName(name: DataStoreName, subKey: DataStoreKey): Promise<DataStoreKey>;
}

export interface LocalDataStore {
	put(key: DataStoreKey, value: string): Promise<void>;
	get(key: DataStoreKey): Promise<string>;
	save(): Promise<void>;
	load(): Promise<void>;
}

export interface Staker {
	address: string;
	staked: BigNumber;
}

export interface Identity {
	address: string;
	encrypter: RSAEncrypter;
}

export interface ExchangeContract {
	topStakers(): Promise<Staker[]>;
	minStake(): Promise<BigNumber>;
	timeUntilEvict(): Promise<BigNumber>;
	isFull(): Promise<boolean>;
	cid(address: string): Promise<string>;
	registerCid(cid: string): Promise<void>;
}

export async function inExchange(
	identity: Identity,
	contract: ExchangeContract
): Promise<boolean> {
	return true;
}

/**
 * Gets the CipherDoc from the given CID.
 * 
 * @param {GlobalDataStore} globalDataStore The global store.
 * @param {string} cid The CID of the document.
 * @returns {Promise<InfoCipherDoc>} The document.
 */
async function getCipherDoc(
	globalDataStore: GlobalDataStore,
	cid: string
): Promise<InfoCipherDoc> {
	const doc = await deserializeInfoCipherDoc(await globalDataStore.get(cid));
	doc.cid = cid;
	return doc;
}

/**
 * Computes the latest aggregate document hash of all the stakers.
 * 
 * @param {Crypto} crypto The crypto object to use.
 * @param {Map<string, InfoCipherDoc>} cipherDocs The set of cipher docs retrieved.
 * @returns {Promise<string>} The the latest hash.
 */
export function computeGroupInfoHash(
	crypto: Crypto,
	cipherDocs: Map<string, InfoCipherDoc>,
): Promise<string> {
	logInfo("Computing latest group info hash...");

	// Get cids from the .cid property of each InfoCipherDoc.
	const cids = Array.from(cipherDocs.values()).map(doc => doc.cid);

	// Filter out any empty CIDs.
	const nonEmptyCids = cids.filter(cid => cid !== "");

	// Sort CIDs, hash and return result.
	return sha256(crypto, nonEmptyCids.sort().join(""));
}

/**
 * Check whether or not new information is available.
 * 
 * @param {Crypto} crypto The crypto object to use.
 * @param {LocalDataStore} localData The local store.
 * @param {Map<string, InfoCipherDoc>} cipherDocs The set of cipher docs retrieved.
 * @returns {Promise<boolean>} true if the latest group info hash differs from the local data store.
 */
export async function newInfoAvailable(
	crypto: Crypto,
	localData: LocalDataStore,
	cipherDocs: Map<string, InfoCipherDoc>,
): Promise<boolean> {
	logInfo("Checking for new information...");

	// Compute the latest group info hash.
	const latestGroupInfoHash = await computeGroupInfoHash(crypto, cipherDocs);

	// Check if the latest group info hash differs from the local data store.
	const localGroupInfoHash = await localData.get("latestGroupInfoHash");

	const result = latestGroupInfoHash !== localGroupInfoHash;

	if (result) {
		logInfo("New information available.");
	} else {
		logInfo("No new information available.");
	}

	return result;
}

/**
 * Acknowledge the latest information. Record latest group info
 * hash in local data store.
 * 
 * @param {LocalDataStore} localData The local store.
 * @param {string} latestGroupInfoHash The latestGroupInfoHash The latest group info hash.
 */
export async function acknowledgeInfo(
	localData: LocalDataStore,
	latestGroupInfoHash: string,
): Promise<void> {
	logInfo(`Acknowledging latest group info hash: ${latestGroupInfoHash}`);
	// Record latest group info hash in local data store.
	await localData.put("latestGroupInfoHash", latestGroupInfoHash);
	await localData.save();
}

/**
 * Get the latest InfoCipherDoc for the given staker address.
 * 
 * @param {GlobalDataStore} globalData The global store.
 * @param {ExchangeContract} contract The contract holding on-chain oracle data.
 * @param {Identity} identity The identity of the data consumer.
 * @param {string} address The address of the staker.
 * @returns {Promise<InfoCipherDoc>} The cipher doc for the given staker.
 */
export async function cipherDoc(
	globalData: GlobalDataStore,
	contract: ExchangeContract,
	address: string,
): Promise<InfoCipherDoc> {
	logInfo(`Getting cipher doc for staker ${address}...`);

	// Get the on-chain CID for the staker.
	logInfo(`Getting CID for staker ${address}...`);
	const cid = await contract.cid(address);

	if (cid === undefined || cid === "" || cid === null) {
		logWarn(`CID for staker ${address} is undefined or empty.`);
		return null;
	}

	// Get the cipher doc.
	logInfo(`Getting cipher doc for CID ${cid}...`);
	const cipherDoc = await getCipherDoc(globalData, cid);

	// If IPNS is set, resolve the IPNS name.
	if (cipherDoc.ipns !== "") {
		try {
			logInfo(`Resolving IPNS name ${cipherDoc.ipns}...`);
			const resolvedCid = await globalData.resolveName(
				cipherDoc.ipns,
				"infoex_v1_cipher_doc"
			);

			logInfo(`Resolved IPNS name ${cipherDoc.ipns} to ${resolvedCid}`);
			return getCipherDoc(globalData, resolvedCid);
		} catch (e) {
			logError("Failed to resolve IPNS name", cipherDoc.ipns, cid, e);
			return cipherDoc;
		}
	} else {
		return cipherDoc;
	}
}

/**
 * Get the latest InfoDoc for the given staker address.
 * 
 * @param {Crypto} crypto The crypto object to use.
 * @param {GlobalDataStore} globalData The global store.
 * @param {ExchangeContract} contract The contract holding on-chain oracle data.
 * @param {Identity} identity The identity of the data consumer.
 * @param {string} address The address of the staker.
 * @returns {Promise<InfoDoc>} The doc for the given staker.
 */
export async function infoDoc(
	crypto: Crypto,
	globalData: GlobalDataStore,
	contract: ExchangeContract,
	identity: Identity,
	address: string
): Promise<InfoDoc> {
	// Get the cipher doc.
	const cdoc = await cipherDoc(globalData, contract, address);

	if (cdoc === null) {
		logWarn(`No cipher doc for staker ${address}`);
		return null;
	}

	return decryptInfoCipherDoc(crypto, identity.encrypter, cdoc);
}

/**
 * Retrieve latest info docs for all stakers.
 * 
 * @param {Crypto} crypto The crypto object to use.
 * @param {GlobalDataStore} globalData Global store.
 * @param {ExchangeContract} contract Contract holding on-chain oracle data.
 * @param {Identity} identity The identity of the data consumer.
 * @returns {Promise<Map<string, InfoDoc>>} latest InfoDocs for all stakers.
 */
export async function infoDocs(
	crypto: Crypto,
	globalData: GlobalDataStore,
	contract: ExchangeContract,
	identity: Identity,
): Promise<Map<string, InfoDoc>> {
	logInfo("Getting info docs for all stakers...");
	const result: Map<string, InfoDoc> = new Map();

	logInfo("Getting stakers...");
	const topStakers = await contract.topStakers();

	// Get InfoDoc for each staker.
	await Promise.all(topStakers.map(async staker => {
		logInfo(`Getting info doc for staker ${staker.address}...`);
		try {
			const doc = await infoDoc(crypto, globalData, contract, identity, staker.address);

			if (doc !== null) {
				result.set(staker.address, doc);
			}
		} catch (e) {
			if (e instanceof NoKeyFoundError) {
				logWarn(`We do not (yet?) have the key to decrypt info doc for staker ${staker.address}`);
			} else {
				logError(`Failed to get info doc for staker ${staker.address}`, e);
			}
		}
	}));

	return result;
}

/**
 * Retrieve latest cipher docs for all stakers.
 * 
 * @param {GlobalDataStore} globalData Global store.
 * @param {ExchangeContract} contract Contract holding on-chain oracle data.
 * @returns {Promise<Map<string, InfoCipherDoc>>} latest InfoCipherDocs for all stakers.
 */
export async function cipherDocs(
	globalData: GlobalDataStore,
	contract: ExchangeContract,
): Promise<Map<string, InfoCipherDoc>> {
	logInfo("Getting cipher docs for all stakers...");
	const result: Map<string, InfoCipherDoc> = new Map();

	logInfo("Getting stakers...");
	const topStakers = await contract.topStakers();

	// Get InfoCipherDoc for each staker.
	await Promise.all(topStakers.map(async staker => {
		const doc = await cipherDoc(globalData, contract, staker.address);

		if (doc !== null) {
			result.set(staker.address, doc);
		}
	}));

	return result;
}

/**
 * Get the set of keys that are allowed to access info in the exchange.
 * 
 * @param {GlobalDataStore} globalData Global store.
 * @param {ExchangeContract} contract Contract holding on-chain oracle data.
 * @param {Identity} identity The identity of the data publisher.
 * @returns {Promise<JsonWebKey[]>} The set of keys that are allowed to access info in the exchange.
 */
async function allowedKeys(
	globalData: GlobalDataStore,
	contract: ExchangeContract,
	identity: Identity,
): Promise<JsonWebKey[]> {
	const topStakers = await contract.topStakers();

	// Get allowed keys.
	logInfo("Retrieving set of allowed pubkeys...");
	const allowedKeys: JsonWebKey[] = await Promise.all(topStakers.map(async staker => {
		try {
			const cdoc = await cipherDoc(globalData, contract, staker.address);

			if (cdoc === null) {
				logWarn(`No cipher doc for staker ${staker.address}`);
				return null;
			}

			return cdoc.ownerRSAPubKey;
		} catch (e) {
			logError("Failed to retrieve cipher doc to resolve RSA public key", staker.address, e);
			return null;
		}
	}));

	// Filter valid keys.
	const validKeys = allowedKeys.filter(key => key !== null && key !== undefined && key !== {});

	// If own key is not in allowed keys, add it.
	const ownPubKey = await identity.encrypter.exportPublicKey();

	if (!validKeys.find(key => keysAreEqual(key, ownPubKey))) {
		logInfo("Own key not in allowed keys, adding it.");
		validKeys.push(ownPubKey);
	}

	// Sort valid keys by key.n.
	return validKeys.sort((a, b) => a.n.localeCompare(b.n));
}

/**
 * Publishes new information off chain.
 * 
 * @param {Crypto} crypto The crypto object to use.
 * @param {GlobalDataStore} The global store.
 * @param {Identity} identity The identity of the data publisher.
 * @param {ExchangeContract} The contract holding on-chain oracle data.
 * @param {InfoDoc} The doc to encrypt and publish.
 * @returns {Promise<string>} The CID of the published cipher doc.
 */
export async function publishIpfs(
	crypto: Crypto,
	globalData: GlobalDataStore,
	identity: Identity,
	contract: ExchangeContract,
	doc: InfoDoc
): Promise<string> {
	logInfo("Encrypting and publishing info doc to IPFS...");
	const validKeys = await allowedKeys(globalData, contract, identity);

	// Encrypt the doc.
	logInfo("Encrypting info doc...");
	const encryptedDoc = await encryptInfoDoc(crypto, validKeys, identity.encrypter, doc);
	const serializedDoc = await serializeInfoCipherDoc(encryptedDoc);

	// Publish the doc.
	logInfo(`Publishing cipher doc for ${identity.address}...`);
	const cid = await globalData.put(serializedDoc);
	logInfo(`Published cipher doc for ${identity.address} to ${cid}`);

	// Get current cipher doc for identity.
	try {
		logInfo(`Updating IPNS for ${identity.address} to ${cid}...`);
		const name = await globalData.publishName("infoex_v1_cipher_doc", cid);

		const cdoc = await cipherDoc(globalData, contract, identity.address);

		// If IPNS is set, update IPNS to point to new CID.
		if (cdoc === null || cdoc.ipns === "" || cdoc.ipns === null || cdoc.ipns === undefined) {
			logInfo(`No IPNS set for ${identity.address}, will init IPNS.`);

			// Update IPNS.
			encryptedDoc.ipns = name;

			// Re-publish doc.
			const serializedDoc = await serializeInfoCipherDoc(encryptedDoc);
			logInfo(`Publishing cipher doc for ${identity.address}...`);
			const cid = await globalData.put(serializedDoc);
			logInfo(`Published cipher doc for ${identity.address} to ${cid}`);

			logInfo(`Updating IPNS for ${identity.address} to ${cid}...`);
			await globalData.publishName("infoex_v1_cipher_doc", cid);

			return cid;
		}
	} catch (e) {
		logError("Failed to update IPNS", identity.address, e);
	}

	return cid;
}

/**
 * Check if the pubkey registered on-chain for the given address is the same as
 * the given pubkey.
 * 
 * @param {GlobalDataStore} globalData The global store.
 * @param {ExchangeContract} contract The contract holding on-chain oracle data.
 * @param {string} address The address of the staker.
 * @param {JsonWebKey} pubkey The public key to check.
 * @returns {Promise<boolean>} True if the pubkey registered on-chain matches.
 */
export async function publishedPubkeyMatches(
	globalData: GlobalDataStore,
	contract: ExchangeContract,
	address: string,
	pubkey: JsonWebKey
): Promise<boolean> {
	const cdoc = await cipherDoc(globalData, contract, address);
	return keysAreEqual(cdoc.ownerRSAPubKey, pubkey);
}

/**
 * Check if the on-chain CID needs to be updated. Update conditions include:
 * 
 * - The CID is not set.
 * - The CID is set but the pubkey registered on-chain does not match the given pubkey.
 * 
 * @param {GlobalDataStore} globalData The global store.
 * @param {ExchangeContract} contract The contract holding on-chain oracle data.
 * @param {Identity} identity The identity of the data publisher.
 * @returns {Promise<boolean>} True if the on-chain CID needs to be updated.
 */
export async function needsOnChainCidUpdate(
	globalData: GlobalDataStore,
	contract: ExchangeContract,
	identity: Identity,
): Promise<boolean> {
	const cid = await contract.cid(identity.address);

	if (cid === "" || cid === null || cid === undefined) {
		return true;
	}

	const cdoc = await cipherDoc(globalData, contract, identity.address);
	return !(await publishedPubkeyMatches(globalData, contract, identity.address, await identity.encrypter.exportPublicKey()));
}

/**
 * Update the on-chain CID.
 * 
 * @param {ExchangeContract} contract The contract holding on-chain oracle data.
 * @param {string} cid The CID to update.
 * @return {Promise<void>}
 */
export async function updateOnChainCid(
	contract: ExchangeContract,
	cid: string
): Promise<void> {
	logInfo(`Updating on-chain CID to ${cid}...`);

	return await contract.registerCid(cid);
}

/**
 * Check if the identity should re-publish it's cipher doc. Conditions include:
 * 
 * - Set of allowed keys has changed.
 * 
 * @param {GlobalDataStore} globalData The global store.
 * @param {ExchangeContract} contract The contract holding on-chain oracle data.
 * @param {Identity} identity The identity of the data publisher.
 * @returns {Promise<boolean>} True if the identity should re-publish it's cipher doc.
 */
export async function needsCipherDocUpdate(
	globalData: GlobalDataStore,
	contract: ExchangeContract,
	identity: Identity,
): Promise<boolean> {
	const validKeys: JsonWebKey[] = await allowedKeys(globalData, contract, identity);
	const cdoc = await cipherDoc(globalData, contract, identity.address);
	const currentlyAllowed: JsonWebKey[] = cdoc.allowedRSAPublicKeys;

	// Check if the set of allowed keys has changed.
	if (currentlyAllowed.length !== validKeys.length) {
		return true;
	}

	// Check if any of the allowed keys has changed.
	for (const key of validKeys) {
		if (!currentlyAllowed.find(k => keysAreEqual(k, key))) {
			return true;
		}
	}

	return false;
}
