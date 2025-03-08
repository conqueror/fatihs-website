<script>
	import { page } from '$app/stores';
	import NavIcon from './NavIcon.svelte';
	
	export let href = '/';
	export let label = '';
	export let icon = null;
	export let iconName = '';
	export let isMobile = false;
	export let inMobileMenu = false;
</script>

{#if isMobile && !inMobileMenu}
	<!-- Mobile navigation link style - no icons on mobile navbar as per requirement -->
	<a 
		{href} 
		class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-2 py-2 {$page.url.pathname === href || $page.url.pathname.startsWith(href) && href !== '/' ? 'text-primary dark:text-blue-400 font-semibold' : ''}"
	>
		{label}
	</a>
{:else if isMobile && inMobileMenu}
	<!-- Mobile menu link style - with icons -->
	<a 
		{href} 
		class="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all duration-300 transform hover:translate-x-2 py-2 {$page.url.pathname === href || $page.url.pathname.startsWith(href) && href !== '/' ? 'text-primary dark:text-blue-400 font-semibold' : ''}"
	>
		{#if icon}
			<div class="flex flex-row items-center">
				<svelte:component this={icon} class="w-5 h-5 mr-3 inline-block flex-shrink-0" />
				<span class="inline-block">{label}</span>
			</div>
		{:else if iconName}
			<div class="flex flex-row items-center">
				<NavIcon name={iconName} size={20} className="mr-3" />
				<span class="inline-block">{label}</span>
			</div>
		{:else}
			{label}
		{/if}
	</a>
{:else}
	<!-- Desktop navigation link style - with icons -->
	<a 
		{href} 
		class="relative text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-110 {$page.url.pathname === href || $page.url.pathname.startsWith(href) && href !== '/' ? 'text-primary dark:text-blue-400 font-semibold' : ''}"
	>
		<span class="relative">
			{#if icon}
				<div class="flex flex-row items-center">
					<svelte:component this={icon} class="w-4 h-4 mr-1 inline-block flex-shrink-0" />
					<span class="inline-block">{label}</span>
				</div>
			{:else if iconName}
				<div class="flex flex-row items-center">
					<NavIcon name={iconName} size={16} />
					<span class="inline-block">{label}</span>
				</div>
			{:else}
				{label}
			{/if}
		</span>
	</a>
{/if} 