<script>
	import '../app.css';
	import { page } from '$app/stores';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import SEO from '$lib/components/SEO.svelte';
	import { generateWebsiteSchema } from '$lib/utils/structured-data';
	import Navbar from '$lib/Navbar.svelte';
	import ScrollToTop from '$lib/ScrollToTop.svelte';
	import '../styles/global.css';
	
	// Import analytics and cookie consent components
	import CookieConsent from '$lib/components/CookieConsent.svelte';
	import { initAnalytics, trackPageView, isDoNotTrackEnabled } from '$lib/services/analytics';
	import { browser } from '$app/environment';
	
	// Initialize theme based on localStorage or system preference
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores';
	
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

	// Determine the current URL for canonical and metadata purposes
	$: currentUrl = $page.url.pathname;
	$: siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://fatihnayebi.com';
	
	// Generate website schema for the homepage
	$: websiteSchema = generateWebsiteSchema(siteUrl);
	
	// Use website schema only on the homepage
	$: structuredData = currentUrl === '/' ? websiteSchema : null;
	
	// Track page views when the URL changes (with privacy protection)
	$: if (browser && !isDoNotTrackEnabled()) {
		trackPageView(currentUrl);
	}
</script>

<!-- Base SEO component that will be present on all pages -->
<SEO 
	canonical="{currentUrl}"
	structuredData="{structuredData}"
/>

<svelte:head>
	<!-- Preconnect to important domains to improve performance -->
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
	<!-- iOS refresh handler script -->
	<script src="/refresh-handler.js"></script>
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
