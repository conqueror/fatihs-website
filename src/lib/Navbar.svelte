<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import ThemeToggle from '$lib/ThemeToggle.svelte';
	
	let isMenuOpen = false;
	
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
		
		document.addEventListener('click', handleClickOutside);
		document.addEventListener('touchend', handleClickOutside); // Add touch support for iOS
		
		return () => {
			document.removeEventListener('click', handleClickOutside);
			document.removeEventListener('touchend', handleClickOutside);
		};
	});
</script>

<header class="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm dark:shadow-gray-800 border-b border-gray-200 dark:border-gray-800">
	<div class="container mx-auto px-4">
		<nav class="flex items-center justify-between py-4">
			<a href="/" class="text-xl font-bold text-gray-900 dark:text-white">Fatih Nayebi</a>
			
			<div class="hidden md:flex items-center space-x-6">
				<a href="/" class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors {$page.url.pathname === '/' ? 'text-primary dark:text-blue-400 font-semibold' : ''}">Home</a>
				<a href="/about" class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors {$page.url.pathname === '/about' ? 'text-primary dark:text-blue-400 font-semibold' : ''}">About</a>
				<a href="/research" class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors {$page.url.pathname.startsWith('/research') ? 'text-primary dark:text-blue-400 font-semibold' : ''}">Research</a>
				<a href="/publications" class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors {$page.url.pathname === '/publications' ? 'text-primary dark:text-blue-400 font-semibold' : ''}">Publications</a>
				<a href="/blog" class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors {$page.url.pathname.startsWith('/blog') ? 'text-primary dark:text-blue-400 font-semibold' : ''}">Blog</a>
				<a href="/contact" class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors {$page.url.pathname === '/contact' ? 'text-primary dark:text-blue-400 font-semibold' : ''}">Contact</a>
				
				<ThemeToggle />
			</div>
			
			<button 
				on:click={toggleMenu} 
				class="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 focus:outline-none" 
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
			class="fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 z-50 shadow-lg transform transition-transform ease-in-out duration-300"
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
					<a href="/" class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors py-2 {$page.url.pathname === '/' ? 'text-primary dark:text-blue-400 font-semibold' : ''}">Home</a>
					<a href="/about" class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors py-2 {$page.url.pathname === '/about' ? 'text-primary dark:text-blue-400 font-semibold' : ''}">About</a>
					<a href="/research" class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors py-2 {$page.url.pathname.startsWith('/research') ? 'text-primary dark:text-blue-400 font-semibold' : ''}">Research</a>
					<a href="/publications" class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors py-2 {$page.url.pathname === '/publications' ? 'text-primary dark:text-blue-400 font-semibold' : ''}">Publications</a>
					<a href="/blog" class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors py-2 {$page.url.pathname.startsWith('/blog') ? 'text-primary dark:text-blue-400 font-semibold' : ''}">Blog</a>
					<a href="/contact" class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-colors py-2 {$page.url.pathname === '/contact' ? 'text-primary dark:text-blue-400 font-semibold' : ''}">Contact</a>
					
					<div class="pt-4 border-t border-gray-200 dark:border-gray-700">
						<ThemeToggle />
					</div>
				</div>
			</div>
		</div>
	{/if}
</header>
