import { writable } from "svelte/store";

export const locked = writable(true);
export const encrypter = writable(null);
