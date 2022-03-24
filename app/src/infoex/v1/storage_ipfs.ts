import type { DataStoreKey, DataStoreName, GlobalDataStore } from "./storage";

export class NamesUndefinedError extends Error { }

export class IpfsGlobalStore implements GlobalDataStore {
	private ipfs: any;

	/**
	 * Construct with IPFS object.
	 */
	constructor(ipfs: any) {
		this.ipfs = ipfs;
	}

	async put(value: string): Promise<DataStoreKey> {
		console.info(`Storing data...`);
		const { cid } = await this.ipfs.add(value);
		console.info(`Data stored: ${cid}`);
		return cid;
	}

	async get(key: DataStoreKey): Promise<string> {
		let data = '';
		console.info(`Retrieving data from ${key}...`);
		const stream = this.ipfs.cat(key);

		for await (const chunk of stream) {
			console.info(`Retrieved chunk of size ${chunk.length} for key ${key}.`);
			data += chunk.toString();
		}

		console.info(`Retrieved ${data.length} bytes.`);

		return data;
	}


	async _getNames(name: string): Promise<Map<DataStoreName, DataStoreKey>> {
		console.info(`Retrieving names for ${name}...`);
		const { key } = await this.ipfs.name.resolve(name);

		if (key === undefined) {
			console.info(`Names not set for ${name}.`);
			throw new NamesUndefinedError();
		}

		console.info(`Retrieved names for ${name}: ${key}`);
		return JSON.parse(await this.get(key));
	}

	async publishName(subKey: DataStoreKey, contentKey: DataStoreKey): Promise<DataStoreName> {
		const id = (await this.ipfs.id()).id;
		console.info(`Publishing name ${id}[${subKey}]...`);
		let curNames = {};

		try {
			curNames = await this._getNames(id);
		} catch (err) {
			// Specifically handle case where names not set, otherwise throw.
			console.warn(`Failed to get names (may not exist yet): ${err.message}`, err);

			// If err is a NamesUndefinedError, continue.
			if (!(err instanceof NamesUndefinedError)) {
				throw err;
			}

			console.info(`Names not set, continuing...`);
		}

		curNames[subKey] = contentKey;

		const key = await this.put(JSON.stringify(curNames));

		const { n } = await this.ipfs.name.publish(key);
		console.info(`Published names for ${id} at key ${key}.`);
		return n;
	}

	async resolveName(name: DataStoreName, subKey: DataStoreKey): Promise<DataStoreKey> {
		const names = await this._getNames(name);
		return names[subKey];
	}
}
