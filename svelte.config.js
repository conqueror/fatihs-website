import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
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
			strict: true,
		}),
		
		// Exclude the search page from prerendering since it uses form actions
		prerender: {
			entries: ['*'],
			handleHttpError: ({ path, referrer, message }) => {
				// Exclude search routes from prerendering
				if (path === '/search' || path.startsWith('/search?')) {
					return;
				}
				
				// Otherwise, throw the error
				console.error(`${path} referred from ${referrer}: ${message}`);
				throw new Error(message);
			}
		}
	},
};

export default config;
