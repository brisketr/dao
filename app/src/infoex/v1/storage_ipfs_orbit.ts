import type { DataStoreKey, DataStoreName, GlobalDataStore } from "./storage";

export class NamesUndefinedError extends Error { }

export class IpfsOrbitGlobalStore implements GlobalDataStore {
	private ipfs: any;
	private orbit: any;
	private namesDb: any;
	private namesDbs = {};
	private namesDbsReplicated = {};
	private nameEventSubscribers = [];

	private constructor() { }

	/**
	 * Create with IPFS & Orbit.
	 */
	public static async create(ipfs: any, orbit: any): Promise<IpfsOrbitGlobalStore> {
		console.info("Creating IPFS Orbit store...");
		const newStore = new IpfsOrbitGlobalStore();
		newStore.ipfs = ipfs;
		newStore.orbit = orbit;
		console.info("Initializing names database...");
		newStore.namesDb = await orbit.eventlog("names");
		const namesDbAddr = newStore.namesDb.address.toString();
		newStore.namesDbs[namesDbAddr] = newStore.namesDb;

		// Track our db loading progress.
		newStore.namesDbs[namesDbAddr].events.on("ready", () => {
			console.info(`Names db ${namesDbAddr} ready.`);
			newStore.namesDbsReplicated[namesDbAddr] = true;
		});

		console.info("Loading names database...");
		await newStore.namesDb.load(10);

		return newStore;
	}

	public namesDbAddress(): string {
		return this.namesDb.address.toString();
	}

	public async put(value: string): Promise<DataStoreKey> {
		console.info(`Storing data...`);
		const { cid } = await this.ipfs.add(value);
		console.info(`Data stored: ${cid}`);
		return cid.toString();
	}

	public onNameEvent(callback: (nameDbAddress: string) => void) {
		this.nameEventSubscribers.push(callback);

		return {
			cancel: () => {
				this.nameEventSubscribers = this.nameEventSubscribers.filter((sub) => sub !== callback);
			}
		}
	}

	public async get(key: DataStoreKey): Promise<string> {
		let data = '';
		console.info(`Retrieving data from ${key}...`);
		const stream = this.ipfs.cat(key, {
			timeout: 30000,
		});

		for await (const chunk of stream) {
			console.info(`Retrieved chunk of size ${chunk.length} for key ${key}.`);

			// If data + chunk were to be greater than 100K, throw an error.
			if (data.length + chunk.length > 100 * 1024) {
				throw new Error(`Data too large for key ${key}.`);
			}

			data += chunk.toString();
		}

		console.info(`Retrieved ${data.length} bytes.`);

		return data;
	}


	private async _getNames(nameDbAddr: string): Promise<Map<DataStoreName, DataStoreKey>> {
		console.info(`Retrieving names for ${nameDbAddr}...`);

		// Initialize names db if not set.
		if (!this.namesDbs.hasOwnProperty(nameDbAddr)) {
			if (this.namesDb.address.toString() !== nameDbAddr) {
				console.info(`Names not initalized for ${nameDbAddr}, initializing...`);
				this.namesDbs[nameDbAddr] = await this.orbit.eventlog(nameDbAddr);
				console.log(`Beginning replication of names db: ${nameDbAddr}...`);
				this.namesDbsReplicated[nameDbAddr] = false;

				this.namesDbs[nameDbAddr].events.on("replicated", () => {
					console.info(`Names db ${nameDbAddr} replicated.`);

					if (this.namesDbsReplicated[nameDbAddr]) {
						// Notify naming event subscribers.
						this.nameEventSubscribers.forEach((sub) => sub(nameDbAddr));
					} else {
						this.namesDbsReplicated[nameDbAddr] = true;
					}
				});

				let maxTotal = 0,
					loaded = 0;

				this.namesDbs[nameDbAddr].events.on(
					"replicate.progress",
					(address, hash, entry, progress, total) => {
						loaded++;
						maxTotal = Math.max.apply(null, [maxTotal, progress, 0]);

						total = Math.max.apply(null, [
							progress,
							maxTotal,
							total,
							entry.clock.time,
							0,
						]);

						console.info(`Names db ${nameDbAddr} DB Load Progress: ${maxTotal} / ${total}`);
					}
				);
			}
		}

		const db = this.namesDbs[nameDbAddr];

		// Asynchronously wait up to 30 seconds for condition: this.namesDbsReplicated[name] == true
		try {
			await new Promise((resolve, reject) => {
				const startTime = Date.now();
				const interval = setInterval(() => {
					if (this.namesDbsReplicated[nameDbAddr]) {
						clearInterval(interval);
						resolve(true);
					} else {
						if (Date.now() - startTime > 30000) {
							clearInterval(interval);
							reject(new Error(`Names db ${nameDbAddr} not replicated after 30 seconds.`));
						} else {
							console.info(`Waiting for names db ${nameDbAddr} to replicate (waited ${Date.now() - startTime} ms)...`);
						}
					}
				}, 1000);
			});
		} catch (e) {
			console.error(`Error waiting for names db ${nameDbAddr} to replicate: ${e}`);
		}

		const names = db.iterator({ limit: 1 })
			.collect()
			.map((e) => e.payload.value);

		if (names.length === 0) {
			console.info(`Names not set for ${nameDbAddr}.`);
			throw new NamesUndefinedError();
		}

		return names[0];
	}

	public async publishName(subKey: DataStoreKey, contentKey: DataStoreKey): Promise<DataStoreName> {
		const namesDbAddress = this.namesDbAddress();
		console.info(`Publishing name ${namesDbAddress}[${subKey}]...`);
		let curNames = {};

		try {
			curNames = await this._getNames(namesDbAddress);
		} catch (err) {
			// Specifically handle case where names not set, otherwise throw.
			console.info(`Failed to get names (may not exist yet): ${err.message}`, err);

			// If err is a NamesUndefinedError, continue.
			if (!(err instanceof NamesUndefinedError)) {
				throw err;
			}

			console.info(`Names not set, continuing...`);
		}

		curNames[subKey] = contentKey;

		const hash = await this.namesDb.add(curNames);
		console.info(`Published names for ${namesDbAddress} with hash ${hash}.`);

		return namesDbAddress;
	}

	public async resolveName(name: DataStoreName, subKey: DataStoreKey): Promise<DataStoreKey> {
		const names = await this._getNames(name);
		return names[subKey];
	}
}
