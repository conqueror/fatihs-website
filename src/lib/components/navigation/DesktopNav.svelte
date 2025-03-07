<script>
	import ThemeToggle from '$lib/components/ui/ThemeToggle.svelte';
	import NavLink from './NavLink.svelte';
	import { navItems, getPlaceholderWidth } from './NavItems.js';
	
	export let mounted = false;
</script>

<!-- Desktop navigation with fixed dimensions to prevent layout shifts -->
<div class="hidden md:flex items-center space-x-6 nav-container">
	{#if mounted}
		{#each navItems as item}
			<NavLink href={item.href} label={item.label} icon={item.icon} />
		{/each}
		
		<ThemeToggle />
	{:else}
		<!-- Placeholders with exact same dimensions to prevent layout shifts while loading -->
		{#each navItems as item}
			<span class="relative text-transparent px-2 py-1 w-[{getPlaceholderWidth(item.label)}]">
				{item.label}
			</span>
		{/each}
		<span class="relative text-transparent px-2 py-1 w-[35px]">Toggle</span>
	{/if}
</div>

<style>
	/* Add styles to ensure consistent dimensions */
	.nav-container {
		min-height: 40px;
	}
	
	/* Ensure links have consistent sizes */
	:global(.nav-container a), 
	.nav-container span {
		display: inline-block;
		min-height: 24px;
		vertical-align: middle;
	}
</style> 