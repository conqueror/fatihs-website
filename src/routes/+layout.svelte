<script>
	import Navbar from '$lib/Navbar.svelte';
	import Footer from '$lib/Footer.svelte';
	import ScrollToTop from '$lib/ScrollToTop.svelte';
	import '../styles/global.css';
	
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

<svelte:head>
	<!-- iOS refresh handler script -->
	<script src="/refresh-handler.js"></script>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<Navbar />
	<main class="flex-grow pt-24">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<slot />
		</div>
	</main>
	<Footer />
	<ScrollToTop />
</div>
