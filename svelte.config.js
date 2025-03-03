import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
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
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore missing apple icon errors
				if (path.includes('apple-touch-icon') || path.includes('favicon')) {
					return;
				}
				
				// Otherwise, throw an error
				throw new Error(message);
			},
			handleMissingId: 'warn',
			entries: ['*'],
			crawl: true,
			origin: 'https://fatihnayebi.com'
		},
		paths: {
			base: '',
			relative: false
		},
		appDir: '_app',
		files: {
			assets: 'static'
		},
		csp: {
			mode: 'auto',
			directives: {
				'default-src': ["'self'"],
				'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
				'style-src': ["'self'", "'unsafe-inline'"],
				'img-src': ["'self'", 'data:', 'blob:'],
				'connect-src': ["'self'"],
				'frame-src': ["'self'"],
				'font-src': ["'self'"],
				'object-src': ["'none'"],
				'base-uri': ["'self'"]
			}
		}
	}
};

export default config;
