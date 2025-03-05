<script>
	import '../styles/global.css';
	import { page } from '$app/stores';
	import Header from '$lib/Header.svelte';
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
	
	onMount(() => {
		// Check for saved theme preference or use system preference
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme) {
			theme.set(savedTheme);
			document.documentElement.setAttribute('data-theme', savedTheme);
		} else {
			// Use system preference
			const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
				? 'dark'
				: 'light';
			theme.set(systemTheme);
			document.documentElement.setAttribute('data-theme', systemTheme);
			localStorage.setItem('theme', systemTheme);
		}
		
		// Add listener for system theme changes
		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
			if (!localStorage.getItem('theme')) {
				const newTheme = e.matches ? 'dark' : 'light';
				theme.set(newTheme);
				document.documentElement.setAttribute('data-theme', newTheme);
			}
		});
		
		// Initialize analytics based on consent
		if (browser && !isDoNotTrackEnabled()) {
			initAnalytics();
		}
	});

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
	canonical="{currentUrl}"
	structuredData="{structuredData}"
	googleVerification="{GOOGLE_VERIFICATION}"
	bingVerification="{BING_VERIFICATION}"
	yandexVerification="{YANDEX_VERIFICATION}"
/>

<svelte:head>
	<!-- Preconnect to important domains to improve performance -->
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	
	<!-- Preload critical fonts -->
	<link rel="preload" as="font" href="/fonts/inter-var.woff2" type="font/woff2" crossorigin>
	
	<!-- Load fonts with font-display:swap to prevent render blocking -->
	<style>
		/* Inline font-face declaration for critical font */
		@font-face {
			font-family: 'Inter';
			font-style: normal;
			font-weight: 100 900;
			font-display: swap;
			src: url('/fonts/inter-var.woff2') format('woff2');
			unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
		}
	</style>
	
	<!-- Load non-critical fonts asynchronously -->
	<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" media="print" onload="this.media='all'">
	
	<!-- Fallback for JavaScript disabled -->
	<noscript>
		<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">
	</noscript>
	
	<!-- iOS refresh handler script - load with defer -->
	<script src="/refresh-handler.js" defer></script>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<Header />
	<Navbar />
	<main class="flex-grow pt-24">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<slot />
		</div>
	</main>
	<Footer />
	<ScrollToTop />
</div>

<!-- Cookie consent banner -->
<CookieConsent />
