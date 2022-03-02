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

    // "build:bip39": "esbuild ../node_modules/bip39 --bundle --format=esm --sourcemap --main-fields=browser,module,main --inject:./src/node-globals.js --define:process.env.NODE_ENV='\"production\"' --splitting --outdir=./src/modules/bip39"

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
})();
