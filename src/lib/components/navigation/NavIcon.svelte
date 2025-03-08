<script>
  import { iconPaths } from '$lib/utils/icon-paths';
  
  export let name = '';
  export let size = 16;
  export let className = '';
</script>

<svg xmlns="http://www.w3.org/2000/svg" 
     width={size} 
     height={size} 
     viewBox="0 0 24 24" 
     fill="none" 
     stroke="currentColor" 
     stroke-width="2" 
     stroke-linecap="round" 
     stroke-linejoin="round" 
     aria-hidden="true" 
     class="nav-icon {className}">
  {#if iconPaths[name]}
    <path d={iconPaths[name]} />
  {:else}
    <!-- Fallback icon if the requested one doesn't exist -->
    <circle cx="12" cy="12" r="10" />
  {/if}
</svg>

<style>
  .nav-icon {
    display: inline-block;
    vertical-align: middle;
    margin-right: 0.5rem;
    flex-shrink: 0;
    /* Transition for hover effects */
    transition: transform 0.2s ease, color 0.2s ease;
  }
</style> 