<script>
	import '../styles/global.css';
	import { page } from '$app/stores';
	import Footer from '$lib/Footer.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { generateWebsiteSchema } from '$lib/utils/structured-data';
	import Navbar from '$lib/Navbar.svelte';
	import ScrollToTop from '$lib/ScrollToTop.svelte';
	import ThemeProvider from '$lib/components/ThemeProvider.svelte';
	import FontPreload from '$lib/components/FontPreload.svelte';
	
	// Import analytics and cookie consent components
	import CookieConsent from '$lib/components/CookieConsent.svelte';
	import { initAnalytics, trackPageView, isDoNotTrackEnabled } from '$lib/services/analytics';
	import { browser } from '$app/environment';
	
	// Initialize theme based on localStorage or system preference
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores';
	
	// Search Engine Verification Codes
	// Replace these with your actual verification codes when received
	const GOOGLE_VERIFICATION = ''; // Google Search Console verification code
	const BING_VERIFICATION = '';   // Bing Webmaster Tools verification code
	const YANDEX_VERIFICATION = ''; // Optional: Yandex verification code
	
	// URL and site information
	let currentUrl = '';
	$: siteUrl = browser ? window.location.origin : 'https://fatihnayebi.com';
	
	// Generate website schema for the homepage
	$: websiteSchema = generateWebsiteSchema(siteUrl);
	
	// Use website schema on homepage, null elsewhere (pages define their own)
	$: structuredData = $page.url.pathname === '/' ? websiteSchema : null;
	
	// When the page changes, update current URL and track the page view
	$: {
		const newUrl = $page.url.href;
		if (currentUrl !== newUrl) {
			currentUrl = newUrl;
			if (browser && !isDoNotTrackEnabled()) {
				trackPageView(currentUrl);
			}
		}
	}
	
	// Reactive statement to apply theme class
	$: if (browser && $theme === 'dark') {
		document.documentElement.classList.add('dark');
	} else if (browser) {
		document.documentElement.classList.remove('dark');
	}
	
	// Device detection for conditional features
	let isMobileDevice = false;
	
	// Initialize theme based on localStorage or system preference
	onMount(() => {
		if (browser) {
			// Check stored preference
			const savedTheme = localStorage.getItem('theme');
			if (savedTheme) {
				theme.set(savedTheme);
			} else {
				// Use system preference if no stored preference
				const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
				theme.set(prefersDarkMode ? 'dark' : 'light');
			}
			
			// Initialize analytics only if user hasn't opted out
			if (!isDoNotTrackEnabled()) {
				initAnalytics();
			}
			
			// Mobile detection
			isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
			
			// Set viewport height fix for mobile browsers
			if (isMobileDevice) {
				// Fix for mobile viewport height issues (100vh problem)
				const setVh = () => {
					const vh = window.innerHeight * 0.01;
					document.documentElement.style.setProperty('--vh', `${vh}px`);
				};
				
				window.addEventListener('resize', setVh);
				window.addEventListener('orientationchange', setVh);
				setVh();
			}
		}
	});
	
	// Detect system theme changes
	if (browser) {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		
		// Update theme when system preference changes (if user hasn't manually set a theme)
		mediaQuery.addEventListener('change', (e) => {
			if (!localStorage.getItem('theme')) {
				theme.set(e.matches ? 'dark' : 'light');
			}
		});
	}

	// Register service worker for better routing
	if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
		window.addEventListener('load', () => {
			navigator.serviceWorker.register('/sw.js')
				.then(registration => {
					console.log('ServiceWorker registration successful');
					
					// Check for updates for the service worker
					setInterval(() => {
						registration.update();
					}, 60 * 60 * 1000); // Check for updates hourly
				})
				.catch(error => {
					console.log('ServiceWorker registration failed:', error);
				});
		});
	}
</script>

<!-- Base SEO component that will be present on all pages -->
<SEO 
	title="Fatih Nayebi | AI Researcher and Developer"
	description="Personal website of Fatih Nayebi, featuring research in AI, machine learning, and software development."
	structuredData={structuredData}
	googleVerification="{GOOGLE_VERIFICATION}"
	bingVerification="{BING_VERIFICATION}"
	yandexVerification="{YANDEX_VERIFICATION}"
/>

<FontPreload />

<svelte:head>
	<!-- Mobile optimization meta tags -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1.0, user-scalable=no">
	<meta name="mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
	<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
	<meta name="theme-color" content="#1f2937" media="(prefers-color-scheme: dark)">
	<meta name="format-detection" content="telephone=no">
	<meta http-equiv="ScreenOrientation" content="autoRotate:disabled">
	
	<!-- Use self-hosted fonts -->
	<link rel="stylesheet" href="/fonts/fonts.css">
	
	<!-- Manifest for PWA support -->
	<link rel="manifest" href="/manifest.json">
	
	<!-- iOS specific icons -->
	<link rel="apple-touch-icon" href="/images/icons/apple-touch-icon.png">
	<link rel="apple-touch-icon" sizes="152x152" href="/images/icons/apple-touch-icon-152x152.png">
	<link rel="apple-touch-icon" sizes="180x180" href="/images/icons/apple-touch-icon-180x180.png">
	
	<!-- Load fonts with font-display:swap to prevent render blocking -->
	<style>
		/* Font application styles */
		body {
			/* Font family now defined in fonts.css */
			/* Mobile viewport height fix */
			min-height: 100vh;
			min-height: calc(var(--vh, 1vh) * 100);
			/* Prevent pull-to-refresh on mobile */
			overscroll-behavior-y: none;
		}
		
		/* Fix for mobile tap highlight */
		* {
			-webkit-tap-highlight-color: transparent;
		}
		
		/* Improve mobile readability with slightly larger text */
		@media (max-width: 640px) {
			html {
				font-size: 110%;
			}
		}

		/* Add font loading state styles */
		.fonts-loading {
			/* Avoid layout shifts during font loading */
		}

		.fonts-loaded {
			/* Styles after fonts have loaded */
		}
	</style>
	
	<!-- iOS refresh handler script - load with defer -->
	<script src="/refresh-handler.js" defer></script>
	
	<!-- Font loading detection script -->
	<script>
		// Add class to body while fonts are loading
		document.documentElement.classList.add('fonts-loading');
		if ('fonts' in document) {
			Promise.all([
				document.fonts.load('1em Inter'),
				document.fonts.load('1em Fira Code')
			]).then(() => {
				document.documentElement.classList.remove('fonts-loading');
				document.documentElement.classList.add('fonts-loaded');
			}).catch(() => {
				// Fallback if font loading fails
				document.documentElement.classList.remove('fonts-loading');
			});
		} else {
			// Browsers without font loading API
			document.documentElement.classList.remove('fonts-loading');
		}
	</script>
</svelte:head>

<ThemeProvider>
	<div class="min-h-screen flex flex-col">
		<Navbar />
		<main class="flex-grow pt-16">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<slot />
			</div>
		</main>
		<Footer />
		<ScrollToTop />
	</div>

	<!-- Cookie consent banner -->
	<CookieConsent />
</ThemeProvider>
