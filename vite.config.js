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
				// Break down chunks for better performance
				manualChunks: (id) => {
					// Group code by dependency type
					if (id.includes('node_modules')) {
						// Group core libraries together
						if (id.includes('svelte')) {
							return 'vendor-svelte';
						}
						// Group utility libraries together
						if (id.includes('marked') || id.includes('dompurify')) {
							return 'vendor-markdown';
						}
						// Everything else from node_modules goes here
						return 'vendor';
					}
					
					// Group components together
					if (id.includes('/src/lib/components/')) {
						return 'components';
					}
					
					// Group utils together
					if (id.includes('/src/lib/utils/')) {
						return 'utils';
					}
					
					// Keep UI components separate to allow small interactive elements
					// to be loaded independently
					if (id.includes('/src/lib/Header.svelte') || 
					    id.includes('/src/lib/Footer.svelte') ||
					    id.includes('/src/lib/Navbar.svelte')) {
						return 'ui-components';
					}
				}
			}
		},
		// Improve chunk size reporting
		reportCompressedSize: true,
		// Target modern browsers for smaller bundles
		target: 'es2020',
		// Add aggressive minification of CSS and JS
		minify: 'terser',
		terserOptions: {
			compress: {
				drop_console: true,
				drop_debugger: true,
				ecma: 2020, // Use modern syntax for better minification
				passes: 2    // More aggressive optimization
			},
			format: {
				comments: false // Remove all comments
			}
		},
		// Generate source maps for production (useful for monitoring)
		sourcemap: true,
		// Ensure all assets are properly compressed
		assetsInlineLimit: 4096, // 4kb - inline small assets
		chunkSizeWarningLimit: 100, // Alert on chunks larger than 100kb
		cssCodeSplit: true, // Split CSS into multiple files
		cssMinify: true, // Minify CSS
	},
	// Performance optimizations
	optimizeDeps: {
		// Pre-bundle dependencies for faster development
		include: ['dompurify', 'marked', 'shiki'],
		// Use esbuild to optimize dependencies
		esbuildOptions: {
			target: 'es2020',
			// List of features to support
			supported: {
				'top-level-await': true
			}
		}
	},
	// Configure CSS optimization
	css: {
		devSourcemap: true,
		preprocessorOptions: {
			// Any preprocessor options here
		},
		// Enable CSS code splitting
		codeSplit: true
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
	},
	// Provide environment variables to the client
	define: {
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
		'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString())
	}
});
