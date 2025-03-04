<script>
	import Navbar from '$lib/Navbar.svelte';
	import Footer from '$lib/Footer.svelte';
	import ScrollToTop from '$lib/ScrollToTop.svelte';
	import '../styles/global.css';
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
