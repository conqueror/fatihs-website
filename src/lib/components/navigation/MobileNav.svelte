<script>
	import { page } from '$app/stores';
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import NavLink from './NavLink.svelte';
	import { navItems } from './NavItems.js';
	
	export let isMenuOpen = false;
	export let toggleMenu;
</script>

<button 
	on:click={toggleMenu} 
	class="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 focus:outline-none hamburger-button" 
	aria-label="Toggle menu"
>
	<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
	</svg>
</button>

{#if isMenuOpen}
	<!-- Menu overlay backdrop -->
	<div 
		class="fixed inset-0 bg-black bg-opacity-50 z-[9999]"
		on:click|self={toggleMenu}
		on:keydown={(e) => e.key === 'Escape' && toggleMenu()}
		role="button"
		tabindex="0"
		aria-label="Close menu overlay"
	></div>
	
	<!-- Menu panel -->
	<div 
		class="mobile-menu fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 z-[10000] shadow-lg transform transition-transform ease-in-out duration-300 translate-x-0"
		style="background-color: rgb(255, 255, 255); background-opacity: 1;"
	>
		<div class="p-5 bg-white dark:bg-gray-900" style="background-opacity: 1;">
			<div class="flex justify-between items-center mb-6 bg-white dark:bg-gray-900">
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
			
			<div class="flex flex-col space-y-4 bg-white dark:bg-gray-900">
				{#each navItems as item}
					<NavLink href={item.href} label={item.label} icon={item.icon} isMobile={true} />
				{/each}
				
				<div class="pt-4 border-t border-gray-200 dark:border-gray-700">
					<ThemeToggle />
				</div>
			</div>
		</div>
	</div>
{:else}
	<!-- Hidden menu element for smooth exit animation -->
	<div 
		class="mobile-menu fixed top-0 right-0 w-64 h-full bg-white dark:bg-gray-900 z-[-1] shadow-lg transform transition-transform ease-in-out duration-300 translate-x-full pointer-events-none"
	></div>
{/if} 

<style>
	/* Force all menu components to the highest layer */
	:global(body.overflow-hidden) {
		overflow: hidden !important;
	}

	/* Ensure both menu elements have very high z-index values */
	:global(.mobile-menu) {
		z-index: 10000 !important;
		background-color: white !important;
	}
	
	:global(.dark .mobile-menu) {
		background-color: #111827 !important; /* dark:bg-gray-900 equivalent */
	}
</style> 