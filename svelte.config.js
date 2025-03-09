// Removed: import 'svelte/register';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	extensions: ['.svelte', ...mdsvexConfig.extensions],

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
			precompress: true,
			strict: true
		}),
		prerender: {
			crawl: true,
			entries: [
  "*",
  "/sitemap.xml",
  "/robots.txt",
  "/",
  "/about",
  "/blog",
  "/publications",
  "/research",
  "/events",
  "/conferences",
  "/consulting",
  "/contact",
  "/search",
  "/privacy",
  "/events/speaking",
  "/events/organizing",
  "/events/media",
  "/events/speaking/scaling-ai-initiatives-in-retail-gen-ai-reality-check-2025-07",
  "/events/speaking/big-data-analytics-summit-canada-2025",
  "/events/speaking/newsweek-ai-impact-awards-2025",
  "/events/speaking/generative-ai-and-the-next-generation-of-search-2025-03",
  "/events/speaking/mcgill-data-network-retail-panel-2025",
  "/events/speaking/from-conversational-to-agentic-ai-how-ai-agents-are-reshaping-retail-2025-02",
  "/events/speaking/leveraging-ai-for-retail-innovation-aldos-success-stories-2025-02",
  "/events/speaking/personalization-at-scale-cxsphere-2024",
  "/events/speaking/scaling-ai-initiatives-in-retail-odsc-west-2024",
  "/events/organizing/retail-gen-ai-hackathon-2024",
  "/events/speaking/big-data-analytics-montreal-summit-2024",
  "/events/speaking/all-in-2024",
  "/events/speaking/conference-of-montreal-2024",
  "/events/media/ai-with-sach-podcast-2024",
  "/events/media/behind-the-growth-podcast-2024",
  "/events/speaking/unleashing-the-power-of-data-ai-to-drive-business-value-and-innovation-2024-04",
  "/events/speaking/unleashing-the-power-of-generative-ai-for-tabular-data-in-machine-learning-applications-2023-10",
  "/events/organizing/retail-gen-ai-hackathon-2023"
],
			handleHttpError: ({ status, path, referrer, referenceType }) => {
				// Special handling for search paths
				if (path.startsWith('/search')) {
					console.warn(`${status} ${path}${referrer ? ` (${referenceType} from ${referrer})` : ''} - Redirecting to search page`);
					return '/search';
				}
				
				// Default for everything else is to warn only
				console.warn(`${status} ${path}${referrer ? ` (${referenceType} from ${referrer})` : ''}`);
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
	},

	preprocess: [
		vitePreprocess(),
		mdsvex(mdsvexConfig)
	]
};

export default config;
