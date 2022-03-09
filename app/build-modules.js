/**
 * Build modules that cannot be built with rollup.
 */
esbuild = require('esbuild');
nodePolyfills = require('@esbuild-plugins/node-modules-polyfill').default;

// "build:ipfs:old": "esbuild ../node_modules/ipfs-core --bundle --format=esm --sourcemap --main-fields=browser,module,main --inject:./src/node-globals.js --define:process.env.NODE_ENV='\"production\"' --splitting --outdir=./src/modules/ipfs-core",

(async () => {
	console.log('Building ipfs-core...');
	await esbuild.build({
		bundle: true,
		format: 'esm',
		sourcemap: true,
		mainFields: ['browser', 'module', 'main'],
		inject: [ './src/node-globals.js' ],
		define: {
			'process.env.NODE_ENV': '"production"'
		},
		splitting: true,
		outdir: './src/modules/ipfs-core',
		entryPoints: ['../node_modules/ipfs-core']
	});

	console.log('Building bip39...');
	await esbuild.build({
		plugins: [nodePolyfills()],
		bundle: true,
		format: 'esm',
		sourcemap: true,
		mainFields: ['browser', 'module', 'main'],
		inject: [ './src/node-globals.js' ],
		define: {
			'process.env.NODE_ENV': '"production"'
		},
		splitting: true,
		outdir: './src/modules/bip39',
		entryPoints: ['../node_modules/bip39']
	});

	console.log('Building seededrsa...');
	await esbuild.build({
		plugins: [nodePolyfills()],
		bundle: true,
		format: 'esm',
		sourcemap: true,
		mainFields: ['browser', 'module', 'main'],
		inject: [ './src/node-globals.js' ],
		define: {
			'process.env.NODE_ENV': '"production"'
		},
		splitting: true,
		outdir: './src/modules/seededrsa',
		entryPoints: ['../node_modules/seededrsa']
	});

	console.log('Building pem-jwk...');
	await esbuild.build({
		plugins: [nodePolyfills()],
		bundle: true,
		format: 'esm',
		sourcemap: true,
		mainFields: ['browser', 'module', 'main'],
		inject: [ './src/node-globals.js' ],
		define: {
			'process.env.NODE_ENV': '"production"'
		},
		splitting: true,
		outdir: './src/modules/pem-jwk',
		entryPoints: ['../node_modules/pem-jwk']
	});

	console.log("Building libp2p-crypto-keys...");
	await esbuild.build({
		plugins: [nodePolyfills()],
		bundle: true,
		format: 'esm',
		sourcemap: true,
		mainFields: ['browser', 'module', 'main'],
		inject: [ './src/node-globals.js' ],
		define: {
			'process.env.NODE_ENV': '"production"'
		},
		splitting: true,
		outdir: './src/modules/libp2p-crypto-keys',
		entryPoints: ['../node_modules/libp2p-crypto/src/keys']
	});

	console.log("Building peer-id...");
	await esbuild.build({
		plugins: [nodePolyfills()],
		bundle: true,
		format: 'esm',
		sourcemap: true,
		mainFields: ['browser', 'module', 'main'],
		inject: [ './src/node-globals.js' ],
		define: {
			'process.env.NODE_ENV': '"production"'
		},
		splitting: true,
		outdir: './src/modules/peer-id',
		entryPoints: ['../node_modules/peer-id']
	});

})();
