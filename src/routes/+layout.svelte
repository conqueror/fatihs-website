<script>
	import '../styles/global.css';
	import { page } from '$app/stores';
	import Footer from '$lib/components/layout/Footer.svelte';
	import SEO from '$lib/components/seo/SEO.svelte';
	import { generateWebsiteSchema } from '$lib/utils/structured-data';
	import Navbar from '$lib/components/navigation/Navbar.svelte';
	import ScrollToTop from '$lib/components/ui/ScrollToTop.svelte';
	import ThemeProvider from '$lib/components/layout/ThemeProvider.svelte';
	import FontPreload from '$lib/components/ui/FontPreload.svelte';
	import ScriptLoader from '$lib/components/ui/ScriptLoader.svelte';
	import PageTransition from '$lib/components/ui/PageTransition.svelte';
	import { initFonts, fontsLoaded } from '$lib/services/fonts';
	
	// Import analytics and cookie consent components
	import CookieConsent from '$lib/components/ui/CookieConsent.svelte';
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
	$: siteUrl = 'https://fatihnayebi.com';  // Always use the production URL
	$: pageKey = $page.url.pathname; // Key for page transitions
	
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
	
	// Initialize analytics and theme
	onMount(() => {
		if (!isDoNotTrackEnabled()) {
			initAnalytics();
		}
		
		// Initialize fonts
		initFonts();
		
		// Check for older browsers
		if (browser) {
			try {
				// Simple feature detection for modern browsers
				if (!('IntersectionObserver' in window) || !('querySelector' in document)) {
					document.getElementById('old-browser-warning').classList.remove('hidden');
				}
			} catch (e) {
				console.warn('Browser feature detection failed', e);
			}
		}
	});
</script>

<svelte:head>
	<!-- SEO -->
	<title>Fatih Nayebi, Ph.D. | Data & AI Leader</title>
	<meta name="description" content="Fatih Nayebi's personal website - Data & AI Leader, Faculty Lecturer at McGill University, and VP of Data & AI at ALDO Group." />

	<!-- Charset and viewport -->
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />

	<!-- Canonical URL - Always use the production domain for consistent SEO -->
	<link rel="canonical" href="https://fatihnayebi.com{$page.url.pathname}" />
	
	<!-- Favicons and PWA -->
	<link rel="icon" href="/favicon.ico" sizes="any" />
	<!-- <link rel="icon" href="/favicon.svg" type="image/svg+xml" /> -->
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	<link rel="manifest" href="/manifest.json" />
	
	<!-- Preload resources for performance -->
	<link rel="dns-prefetch" href="https://api.fatihnayebi.com" />
	<link rel="preconnect" href="https://api.fatihnayebi.com" crossorigin />
	
	<!-- Enhanced resource hints for common services -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin />
	<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin />
	
	<!-- Prefetch important pages for faster navigation -->
	<link rel="prefetch" href="/about" as="document" />
	<link rel="prefetch" href="/blog" as="document" />
	<link rel="prefetch" href="/publications" as="document" />
	<link rel="prefetch" href="/contact" as="document" />
	
	<!-- Preload critical resources -->
	<!-- <link rel="preload" href="/images/background.jpg" as="image" fetchpriority="high" /> -->
	<!-- <link rel="preload" href="/images/optimized/profile-640.avif" as="image" type="image/avif" fetchpriority="high" /> -->
	<link rel="preload" href="/fonts/inter-600.woff2" as="font" type="font/woff2" crossorigin="anonymous" fetchpriority="high" />
	<!-- <link rel="preload" href="/fonts/inter-400.woff2" as="font" type="font/woff2" crossorigin /> -->
	
	<!-- Search engine verification -->
	{#if GOOGLE_VERIFICATION}
		<meta name="google-site-verification" content={GOOGLE_VERIFICATION} />
	{/if}
	{#if BING_VERIFICATION}
		<meta name="msvalidate.01" content={BING_VERIFICATION} />
	{/if}
	{#if YANDEX_VERIFICATION}
		<meta name="yandex-verification" content={YANDEX_VERIFICATION} />
	{/if}
	
	<!-- Open Graph / Social media meta tags -->
	<meta property="og:site_name" content="Fatih Nayebi | Data & AI Leader" />
	<meta property="og:url" content={`${siteUrl}${$page.url.pathname}`} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content="Fatih Nayebi, Ph.D. | Data & AI Leader" />
	<meta property="og:description" content="Fatih Nayebi's personal website - Data & AI Leader, Faculty Lecturer at McGill University, and VP of Data & AI at ALDO Group." />
	<meta property="og:image" content={`${siteUrl}/images/social-card.jpg`} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	
	<!-- Twitter Card data -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@FatihNayebi" />
	<meta name="twitter:title" content="Fatih Nayebi, Ph.D. | Data & AI Leader" />
	<meta name="twitter:description" content="Fatih Nayebi's personal website - Data & AI Leader, Faculty Lecturer at McGill University, and VP of Data & AI at ALDO Group." />
	<meta name="twitter:image" content={`${siteUrl}/images/social-card.jpg`} />
	
	<!-- Author information -->
	<meta name="author" content="Fatih Nayebi" />
	
	<!-- Robots directive -->
	<meta name="robots" content="index, follow" />
</svelte:head>

<!-- Font preloading -->
<FontPreload />

<!-- Notification for older browsers -->
<div class="bg-yellow-300 text-black px-4 py-2 text-center hidden" id="old-browser-warning">
	You are using an outdated browser. Please upgrade for the best experience.
</div>

<!-- Theme management -->
<ThemeProvider>
	<div class="min-h-screen flex flex-col">
		<!-- Header -->
		<Navbar />
		
		<!-- Main content with SEO and page transitions -->
		<main class="flex-grow z-0">
			<PageTransition key={pageKey}>
				<slot />
			</PageTransition>
		</main>
		
		<!-- Footer -->
		<Footer />
		
		<!-- Cookie consent banner -->
		<CookieConsent />
		
		<!-- Back to top button -->
		<ScrollToTop />
	</div>
</ThemeProvider>

<!-- Load third-party scripts -->
<ScriptLoader />

<style>
	/* Global styles specific to the layout */
	:global(body) {
		/* System fonts fallback handled by FontPreload component */
	}
	
	:global(.page-transition) {
		position: relative;
	}
	
	/* Styles for the old browser warning */
	#old-browser-warning {
		font-family: system-ui, sans-serif; /* Ensure this works in older browsers */
	}
</style>
