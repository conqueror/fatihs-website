<script>
	import { onMount } from 'svelte';
	import DesktopNav from './DesktopNav.svelte';
	import MobileNav from './MobileNav.svelte';
	
	let isMenuOpen = false;
	let mounted = false;
	
	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
		// When menu is opened, prevent scrolling on the body
		if (isMenuOpen) {
			document.body.classList.add('overflow-hidden');
		} else {
			document.body.classList.remove('overflow-hidden');
		}
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
				document.body.classList.remove('overflow-hidden');
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

<header class="fixed top-0 z-[90] w-full bg-white/90 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm dark:shadow-gray-800 border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
	<div class="container mx-auto px-4">
		<nav class="flex items-center justify-between py-4">
			<a href="/" class="text-xl font-bold text-gray-900 dark:text-white">Dr. Fatih Nayebi</a>
			
			<!-- Desktop navigation -->
			<DesktopNav {mounted} />
			
			<!-- Mobile navigation -->
			<MobileNav {isMenuOpen} {toggleMenu} />
		</nav>
	</div>
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
	
	/* Ensure the menu layer appears above all content */
	:global(.mobile-nav-layer) {
		position: relative;
		z-index: 1000;
	}
</style>
