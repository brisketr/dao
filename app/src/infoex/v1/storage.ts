export type DataStoreKey = string;
export type DataStoreName = string;

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
