<!--
  PageContainer.svelte - A consistent page container for all routes
  
  This component:
  - Provides proper padding to account for fixed navbar
  - Applies consistent container styling with proper margins
  - Handles responsive adjustments across device sizes
  - Takes care of dark mode styling
-->
<script>
  // Props
  export let fullWidth = false; // Whether this should be full-width or contained
  export let heroSection = false; // Special padding for hero sections
  export let className = ''; // Additional classes
  export let backgroundClass = ''; // Background class for the container
  export let noPadding = false; // Whether to remove default padding
  export let roundedContainer = true; // Whether to apply rounded corners
  
  // Computed classes
  $: containerClass = `
    ${fullWidth ? 'w-full' : 'w-95 max-w-screen-xl mx-auto'}
    ${roundedContainer && !fullWidth ? 'rounded-xl' : ''}
    ${noPadding ? '' : 'px-4 sm:px-6 lg:px-8'}
    ${backgroundClass}
    ${className}
  `;
  
  // Compute padding classes to account for navbar
  $: paddingClass = heroSection 
    ? (noPadding ? 'pt-2 pb-2' : 'pt-24 md:pt-28 pb-10 md:pb-16')
    : (noPadding ? '' : 'pt-20 md:pt-24 pb-12');
</script>

<div class={`relative ${paddingClass} ${containerClass}`}>
  <slot />
</div>

<style>
  /* Default properties for container layouts */
  :global(.w-95) {
    width: 95%;
  }
</style> 