import { ethers } from "ethers";
import { writable } from "svelte/store";
import { Contracts } from "./contracts";

export const connected = writable(false);
export const connecting = writable(false);
export const address = writable(null);
export const ethersProvider = writable(null);
export const wrongNetwork = writable(false);
export const network = writable(null);
export const contract = writable(new Contracts);
export const tokenBalanceBRIB = writable(ethers.constants.Zero);
