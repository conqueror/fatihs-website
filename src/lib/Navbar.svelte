<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	
	let isMenuOpen = false;
	
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}
	
	// Close menu when clicking outside
	onMount(() => {
		const handleClickOutside = (event) => {
			if (isMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.mobile-menu-toggle')) {
				isMenuOpen = false;
			}
		};
		
		document.addEventListener('click', handleClickOutside);
		
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<header class="fixed w-full bg-white shadow-sm z-10">
	<div class="container mx-auto px-4">
		<nav class="flex justify-between items-center h-20">
			<a href="/" class="flex items-center text-primary hover:text-primary-hover transition-colors">
				<span class="text-2xl font-bold">Fatih Nayebi</span>
			</a>
			
			<div class="hidden md:flex items-center space-x-6">
				<a href="/" 
					class="{$page.url.pathname === '/' ? 'text-primary' : 'text-gray-700'} 
						 relative font-medium hover:text-primary transition-colors
						 after:content-[''] after:absolute after:bottom-[-5px] after:left-0 
						 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300
						 hover:after:w-full">
					Home
				</a>
				<a href="/about" 
					class="{$page.url.pathname === '/about' ? 'text-primary' : 'text-gray-700'} 
						 relative font-medium hover:text-primary transition-colors
						 after:content-[''] after:absolute after:bottom-[-5px] after:left-0 
						 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300
						 hover:after:w-full">
					About
				</a>
				<a href="/research" 
					class="{$page.url.pathname === '/research' ? 'text-primary' : 'text-gray-700'} 
						 relative font-medium hover:text-primary transition-colors
						 after:content-[''] after:absolute after:bottom-[-5px] after:left-0 
						 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300
						 hover:after:w-full">
					Research
				</a>
				<a href="/publications" 
					class="{$page.url.pathname === '/publications' ? 'text-primary' : 'text-gray-700'} 
						 relative font-medium hover:text-primary transition-colors
						 after:content-[''] after:absolute after:bottom-[-5px] after:left-0 
						 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300
						 hover:after:w-full">
					Publications
				</a>
				<a href="/blog" 
					class="{$page.url.pathname.startsWith('/blog') ? 'text-primary' : 'text-gray-700'} 
						 relative font-medium hover:text-primary transition-colors
						 after:content-[''] after:absolute after:bottom-[-5px] after:left-0 
						 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300
						 hover:after:w-full">
					Blog
				</a>
				<a href="/contact" 
					class="{$page.url.pathname === '/contact' ? 'text-primary' : 'text-gray-700'} 
						 relative font-medium hover:text-primary transition-colors
						 after:content-[''] after:absolute after:bottom-[-5px] after:left-0 
						 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300
						 hover:after:w-full">
					Contact
				</a>
			</div>
			
			<div class="flex items-center">
				<a href="/search" class="p-2 rounded-full hover:bg-gray-100 transition-colors" aria-label="Search">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700 hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
				</a>
				
				<button 
					class="md:hidden ml-4 flex flex-col justify-center items-center w-10 h-10 border-none bg-transparent cursor-pointer"
					on:click={toggleMenu}
					aria-label="Toggle menu"
					aria-expanded={isMenuOpen}>
					<span class="block w-6 h-0.5 bg-gray-700 mb-1.5 transition-transform duration-300 {isMenuOpen ? 'transform translate-y-2 rotate-45' : ''}"></span>
					<span class="block w-6 h-0.5 bg-gray-700 mb-1.5 transition-opacity duration-300 {isMenuOpen ? 'opacity-0' : ''}"></span>
					<span class="block w-6 h-0.5 bg-gray-700 transition-transform duration-300 {isMenuOpen ? 'transform -translate-y-2 -rotate-45' : ''}"></span>
				</button>
			</div>
		</nav>
	</div>
	
	<!-- Mobile menu -->
	<div class="md:hidden {isMenuOpen ? 'block' : 'hidden'} absolute top-20 left-0 w-full bg-white shadow-md z-20 py-4">
		<div class="container mx-auto px-4">
			<div class="flex flex-col space-y-4">
				<a href="/" class="{$page.url.pathname === '/' ? 'text-primary' : 'text-gray-700'} font-medium py-2 hover:text-primary transition-colors">Home</a>
				<a href="/about" class="{$page.url.pathname === '/about' ? 'text-primary' : 'text-gray-700'} font-medium py-2 hover:text-primary transition-colors">About</a>
				<a href="/research" class="{$page.url.pathname === '/research' ? 'text-primary' : 'text-gray-700'} font-medium py-2 hover:text-primary transition-colors">Research</a>
				<a href="/publications" class="{$page.url.pathname === '/publications' ? 'text-primary' : 'text-gray-700'} font-medium py-2 hover:text-primary transition-colors">Publications</a>
				<a href="/blog" class="{$page.url.pathname.startsWith('/blog') ? 'text-primary' : 'text-gray-700'} font-medium py-2 hover:text-primary transition-colors">Blog</a>
				<a href="/contact" class="{$page.url.pathname === '/contact' ? 'text-primary' : 'text-gray-700'} font-medium py-2 hover:text-primary transition-colors">Contact</a>
				<a href="/search" class="{$page.url.pathname === '/search' ? 'text-primary' : 'text-gray-700'} font-medium py-2 hover:text-primary transition-colors">Search</a>
			</div>
		</div>
	</div>
</header>
