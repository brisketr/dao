// This file is used by the build:ipfs npm script.

// file: src/node-globals.js
export const Buffer = require('buffer').Buffer;
export const process = require('process/browser');
export const global =
	typeof global !== 'undefined'
		? global
		: typeof globalThis !== 'undefined'
		? globalThis
		: typeof self !== 'undefined'
		? self
		: typeof window !== 'undefined'
		? window
		: {};

if (globalThis && globalThis.process && globalThis.process.env)
	globalThis.process.env.LIBP2P_FORCE_PNET = false;
