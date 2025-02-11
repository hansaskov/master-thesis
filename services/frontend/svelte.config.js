import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			fallback: '200.html'
		}),

		output: {
			bundleStrategy: 'single',
			preloadStrategy: 'modulepreload'
		},

		router: {
			type: 'pathname'
		},

		alias: {
			'@/*': './src/lib/*',
			'$auth/*': '../backend/src/auth/*',
			'$config/*': '../backend/src/config/*',
			'$db/*': '../backend/src/db/*',
			'$types/*': '../backend/src/types/*',
			'$utils/*': '../backend/src/utils/*',
			'$collections/*': '../backend/src/collections/*'
		}
	}
};

export default config;
