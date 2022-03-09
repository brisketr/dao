import { logInfo, logWarn } from "./logging";
import type { DataStoreKey, DataStoreName, GlobalDataStore } from "./storage";

export class IpfsGlobalStore implements GlobalDataStore {
	private ipfs: any;

	/**
	 * Construct with IPFS object.
	 */
	constructor(ipfs: any) {
		this.ipfs = ipfs;
	}

	async put(value: string): Promise<DataStoreKey> {
		logInfo(`Storing data...`);
		const { cid } = await this.ipfs.add(value);
		logInfo(`Data stored: ${cid}`);
		return cid;
	}

	async get(key: DataStoreKey): Promise<string> {
		let data = '';
		logInfo(`Retrieving data from ${key}...`);
		const stream = this.ipfs.cat(key);

		for await (const chunk of stream) {
			logInfo(`Retrieved chunk of size ${chunk.length} for key ${key}.`);
			data += chunk.toString();
		}

		logInfo(`Retrieved ${data.length} bytes.`);

		return data;
	}

	async _getNames(name): Promise<Map<DataStoreName, DataStoreKey>> {
		logInfo(`Retrieving names for ${name}...`);
		const { key } = await this.ipfs.name.resolve(name);
		logInfo(`Retrieved names for ${name}: ${key}`);
		return JSON.parse(await this.get(key));
	}

	async publishName(subKey: DataStoreKey, contentKey: DataStoreKey): Promise<DataStoreName> {
		const { id } = this.ipfs.id();
		logInfo(`Publishing name ${id}[${subKey}]...`);
		let curNames = {};

		try {
			curNames = await this._getNames(id);
		} catch (err) {
			//FIXME specifically handle case where names not set, otherwise throw.
			logWarn(`Failed to get names (may not exist yet): ${err.message}`, err);
		}

		curNames[subKey] = contentKey;

		const key = await this.put(JSON.stringify(curNames));

		const { n } = await this.ipfs.name.publish(key);
		logInfo(`Published names for ${id} at key ${key}.`);
		return n;
	}

	async resolveName(name: DataStoreName, subKey: DataStoreKey): Promise<DataStoreKey> {
		const names = await this._getNames(name);
		return names[subKey];
	}
}
