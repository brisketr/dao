import { writable } from "svelte/store";

export const locked = writable(true);
export const identity = writable(null);
export const ipfsConnecting = writable(false);
export const ipfsConnected = writable(false);
export const ipfs = writable(null);
export const ipfsPeerCount = writable(null);
export const orbit = writable(null);
export const localData = writable(null);
export const globalData = writable(null);
export const exchangeContractGenesis = writable(null);
export const needsOnChainPublish = writable(false);
export const latestDoc = writable(null);
export const latestCipherDoc = writable(null);
export const latestCid = writable(null);

/**
 * Used to invalidate cache of on-chain data.
 */
export const eventCount = writable(0);
