import type { DataStoreKey, LocalDataStore } from "./storage";

export class LocalStorageStore implements LocalDataStore {
	private cache: { [key: string]: string } = {};

	put(key: DataStoreKey, value: string): Promise<void> {
		this.cache[key] = value;
		return Promise.resolve();
	}

	get(key: DataStoreKey): Promise<string> {
		return Promise.resolve(this.cache[key]);
	}

	save(): Promise<void> {
		// Store cache in local storage.
		localStorage.setItem("infoex_v1", JSON.stringify(this.cache));
		return Promise.resolve();
	}

	load(): Promise<void> {
		// Load cache from local storage.
		const cache = JSON.parse(localStorage.getItem("infoex_v1"));

		if (cache) {
			this.cache = cache;
		}

		return Promise.resolve();
	}

}
