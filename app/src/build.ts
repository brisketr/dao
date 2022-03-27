import { build } from 'esbuild'
import alias from 'esbuild-plugin-alias';
import esbuildSvelte from "esbuild-svelte";
import sveltePreprocess from "svelte-preprocess";

// Get dev or production from CLI arguments.
const production = !process.argv.includes('--dev');
const watch = process.argv.includes('--watch');

if (production) {
	console.log('Building for production...');
} else {
	console.log('Building for development...');
}

build({
	bundle: true,
	logLevel: 'info',
	sourcemap: true,
	mainFields: ["svelte", "browser", "module", "main"],
	inject: ['./src/node-globals.js'],
	watch: watch,
	define: {
		'process.env.NODE_ENV': production ? '"production"' : '"dev"',
	},
	minify: production,
	outdir: './public/build/',
	plugins: [
		alias({
			'crypto': require.resolve('crypto-browserify'),
			'stream': require.resolve('stream-browserify'),
			'path': require.resolve('path-browserify'),
			'assert': require.resolve('assert-browserify'),
		}),
		esbuildSvelte({
			preprocess: sveltePreprocess(),
			compilerOptions: {
				// Enable run-time checks when not in production.
				dev: !production
			}
		}),
	],
	entryPoints: ['src/main.ts']
});
