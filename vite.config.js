import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit()
	],
	// Increase chunking for better code splitting
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					'ui-components': [
						'./src/lib/Header.svelte',
						'./src/lib/Footer.svelte',
						'./src/lib/Navbar.svelte'
					]
				}
			}
		},
		// Improve chunk size reporting
		reportCompressedSize: true,
		// Target modern browsers for smaller bundles
		target: 'es2020'
	},
	// Performance optimizations
	optimizeDeps: {
		// Pre-bundle dependencies for faster development
		include: []
	},
	// Configure CSS optimization
	css: {
		devSourcemap: true,
		preprocessorOptions: {
			// Any preprocessor options here
		}
	},
	// Improve server performance
	server: {
		fs: {
			// Allow serving files from one level up to the project root
			allow: ['..']
		},
		// Optimize server response caching
		headers: {
			'Cache-Control': 'public, max-age=0'
		}
	}
});
