import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: 'index.html',
			precompress: false,
			strict: false
		}),
		prerender: {
			crawl: true,
			entries: ['*'],
			handleHttpError: ({ path, referrer, message }) => {
				// ignore specific 404 errors for favicon and apple icons
				if (path.includes('favicon') || path.includes('apple-touch-icon')) {
					console.warn(`[warn] Ignoring 404 for ${path}`);
					return;
				}
				
				// otherwise fail the build
				throw new Error(message);
			}
		},
		// Ensure we're using absolute paths for better compatibility
		paths: {
			base: '',
			relative: false,
			// Add any other paths you need
		},
		// Set app directory to _app to match Kinsta's expectations
		appDir: '_app',
		// Disable aliasing for better cross-environment compatibility
		alias: {},
		files: {
			assets: 'static'
		}
	}
};

export default config;
