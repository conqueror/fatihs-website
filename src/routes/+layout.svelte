<script>
	import '../styles/global.css';
	import { page } from '$app/stores';
	import Footer from '$lib/Footer.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { generateWebsiteSchema } from '$lib/utils/structured-data';
	import Navbar from '$lib/Navbar.svelte';
	import ScrollToTop from '$lib/ScrollToTop.svelte';
	
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

<svelte:head>
	<!-- Use Google Fonts for Fira Code and Inter -->
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap" rel="stylesheet">
	
	<!-- Load fonts with font-display:swap to prevent render blocking -->
	<style>
		/* Import Google Fonts */
		@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
		
		/* Force immediate usage of fonts */
		body {
			font-family: 'Inter', sans-serif;
			font-optical-sizing: auto;
			font-style: normal;
		}
		
		code {
			font-family: 'Fira Code', monospace;
			font-optical-sizing: auto;
			font-style: normal;
		}
	</style>
	
	<!-- iOS refresh handler script - load with defer -->
	<script src="/refresh-handler.js" defer></script>
</svelte:head>

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
