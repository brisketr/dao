import { writable } from "svelte/store";

export const locked = writable(true);
export const identity = writable(null);
export const ipfsConnecting = writable(false);
export const ipfsConnected = writable(false);
export const ipfs = writable(null);
export const localData = writable(null);
export const globalData = writable(null);
export const exchangeContractGenesis = writable(null);
