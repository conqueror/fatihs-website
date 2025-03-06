<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import ThemeToggle from '$lib/ThemeToggle.svelte';
	
	let isMenuOpen = false;
	let mounted = false;
	
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
	
	// Close menu when clicking outside
	onMount(() => {
		const handleClickOutside = (event) => {
			// Don't close if clicking on the toggle button itself
			if (event.target.closest('.hamburger-button')) {
				return;
			}
			
			// Close if menu is open and click is outside the menu
			if (isMenuOpen && !event.target.closest('.mobile-menu')) {
				isMenuOpen = false;
			}
		};
		
		// Use capture phase to ensure the event is caught before it reaches the menu
		document.addEventListener('click', handleClickOutside, true);
		document.addEventListener('touchend', handleClickOutside, true); // Add touch support for iOS
		
		mounted = true;
		
		return () => {
			document.removeEventListener('click', handleClickOutside, true);
			document.removeEventListener('touchend', handleClickOutside, true);
		};
	});
</script>

<header class="fixed top-0 z-50 bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800 border-b border-gray-200 dark:border-gray-800 w-full">
	<div class="container mx-auto px-4">
		<nav class="flex items-center justify-between py-4">
			<a href="/" class="text-xl font-bold text-gray-900 dark:text-white">Dr. Fatih Nayebi</a>
			
			<!-- Desktop navigation with fixed dimensions to prevent layout shifts -->
			<div class="hidden md:flex items-center space-x-6 nav-container">
				{#if mounted}
					<a href="/" class="relative text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-110 {$page.url.pathname === '/' ? 'text-primary dark:text-blue-400 font-semibold' : ''}">
						<span class="relative">Home</span>
					</a>
					<a href="/about" class="relative text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-110 {$page.url.pathname.startsWith('/about') ? 'text-primary dark:text-blue-400 font-semibold' : ''}">
						<span class="relative">About</span>
					</a>
					<a href="/research" class="relative text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-110 {$page.url.pathname.startsWith('/research') ? 'text-primary dark:text-blue-400 font-semibold' : ''}">
						<span class="relative">Research</span>
					</a>
					<a href="/publications" class="relative text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-110 {$page.url.pathname.startsWith('/publications') ? 'text-primary dark:text-blue-400 font-semibold' : ''}">
						<span class="relative">Publications</span>
					</a>
					<a href="/blog" class="relative text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-110 {$page.url.pathname.startsWith('/blog') ? 'text-primary dark:text-blue-400 font-semibold' : ''}">
						<span class="relative">Blog</span>
					</a>
					<a href="/conferences" class="relative text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-110 {$page.url.pathname.startsWith('/conferences') ? 'text-primary dark:text-blue-400 font-semibold' : ''}">
						<span class="relative">Conferences</span>
					</a>
					<a href="/contact" class="relative text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-110 {$page.url.pathname.startsWith('/contact') ? 'text-primary dark:text-blue-400 font-semibold' : ''}">
						<span class="relative">Contact</span>
					</a>
					<a href="/search" class="relative text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-110 {$page.url.pathname.startsWith('/search') ? 'text-primary dark:text-blue-400 font-semibold' : ''}">
						<span class="relative flex flex-row items-center">
							<svg class="w-4 h-4 mr-1 inline-block flex-shrink-0 search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
							</svg>
							<span class="inline-block">Search</span>
						</span>
					</a>
					
					<ThemeToggle />
				{:else}
					<!-- Placeholders with exact same dimensions to prevent layout shifts while loading -->
					<span class="relative text-transparent px-2 py-1 w-[55px]">Home</span>
					<span class="relative text-transparent px-2 py-1 w-[58px]">About</span>
					<span class="relative text-transparent px-2 py-1 w-[85px]">Research</span>
					<span class="relative text-transparent px-2 py-1 w-[106px]">Publications</span>
					<span class="relative text-transparent px-2 py-1 w-[48px]">Blog</span>
					<span class="relative text-transparent px-2 py-1 w-[105px]">Conferences</span>
					<span class="relative text-transparent px-2 py-1 w-[76px]">Contact</span>
					<span class="relative text-transparent px-2 py-1 w-[75px] flex flex-row items-center">
						<span class="w-4 h-4 mr-1 inline-block flex-shrink-0"></span>
						<span class="inline-block">Search</span>
					</span>
					<span class="relative text-transparent px-2 py-1 w-[35px]">Toggle</span>
				{/if}
			</div>
			
			<button 
				on:click={toggleMenu} 
				class="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 focus:outline-none hamburger-button" 
				aria-label="Toggle menu"
			>
				<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
				</svg>
			</button>
		</nav>
	</div>

	{#if isMenuOpen}
		<div 
			class="fixed inset-0 bg-black bg-opacity-50 z-40"
			on:click|self={toggleMenu}
			on:keydown={(e) => e.key === 'Escape' && toggleMenu()}
			role="button"
			tabindex="0"
			aria-label="Close menu overlay"
		></div>
		
		<div 
			class="mobile-menu fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 z-50 shadow-lg transform transition-transform ease-in-out duration-300 translate-x-0"
		>
			<div class="p-5">
				<div class="flex justify-between items-center mb-6">
					<span class="text-xl font-bold text-gray-900 dark:text-white">Menu</span>
					<button 
						on:click={toggleMenu} 
						class="p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 focus:outline-none" 
						aria-label="Close menu"
					>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
						</svg>
					</button>
				</div>
				
				<div class="flex flex-col space-y-4">
					<a href="/" class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-2 py-2 {$page.url.pathname === '/' ? 'text-primary dark:text-blue-400 font-semibold' : ''}">Home</a>
					<a href="/about" class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-2 py-2 {$page.url.pathname.startsWith('/about') ? 'text-primary dark:text-blue-400 font-semibold' : ''}">About</a>
					<a href="/research" class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-2 py-2 {$page.url.pathname.startsWith('/research') ? 'text-primary dark:text-blue-400 font-semibold' : ''}">Research</a>
					<a href="/publications" class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-2 py-2 {$page.url.pathname.startsWith('/publications') ? 'text-primary dark:text-blue-400 font-semibold' : ''}">Publications</a>
					<a href="/blog" class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-2 py-2 {$page.url.pathname.startsWith('/blog') ? 'text-primary dark:text-blue-400 font-semibold' : ''}">Blog</a>
					<a href="/conferences" class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-2 py-2 {$page.url.pathname.startsWith('/conferences') ? 'text-primary dark:text-blue-400 font-semibold' : ''}">Conferences</a>
					<a href="/contact" class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-2 py-2 {$page.url.pathname.startsWith('/contact') ? 'text-primary dark:text-blue-400 font-semibold' : ''}">Contact</a>
					<a href="/search" class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-2 py-2 {$page.url.pathname.startsWith('/search') ? 'text-primary dark:text-blue-400 font-semibold' : ''}">
						<div class="flex flex-row items-center">
							<svg class="w-4 h-4 mr-1 inline-block flex-shrink-0 search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
							</svg>
							<span class="inline-block">Search</span>
						</div>
					</a>
					
					<div class="pt-4 border-t border-gray-200 dark:border-gray-700">
						<ThemeToggle />
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Hidden menu element for smooth exit animation -->
		<div 
			class="mobile-menu fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 z-50 shadow-lg transform transition-transform ease-in-out duration-300 translate-x-full pointer-events-none"
		></div>
	{/if}
</header>

<style>
	/* Add styles to ensure consistent dimensions */
	.nav-container {
		min-height: 40px;
	}
	
	/* Ensure links have consistent sizes */
	a, span {
		display: inline-block;
		min-height: 24px;
		vertical-align: middle;
	}
	
	/* Additional style for search icon to prevent large blue icon on load */
	:global(.search-icon) {
		color: inherit !important;
		stroke: currentColor !important;
		fill: none !important;
		overflow: hidden;
	}
</style>
