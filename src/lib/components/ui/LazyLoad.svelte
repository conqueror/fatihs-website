<script>
  import { onMount, createEventDispatcher } from 'svelte';
  
  // Props for lazy loading component
  export let threshold = 0.1;    // Intersection threshold (0-1)
  export let rootMargin = '200px'; // Root margin to start loading earlier
  export let enabled = true;     // Allow disabling if needed
  export let once = true;        // Whether to disconnect after first load
  export let offset = 0;         // Offset to adjust margins
  export let placeholder = true; // Whether to show placeholder
  export let placeholderClass = 'placeholder-pulse'; // Placeholder style
  export let delay = 0;          // Delay before showing content after loaded
  
  // Internal state
  let intersecting = false;
  let loaded = false;
  let container;
  let observer;
  
  // Set up event dispatcher
  const dispatch = createEventDispatcher();
  
  // Update on these props changing
  $: if (enabled === false) {
    intersecting = true;
    loaded = true;
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }
  
  // Handle showing content with optional delay
  $: if (intersecting && delay > 0) {
    setTimeout(() => {
      loaded = true;
      dispatch('visible');
    }, delay);
  } else if (intersecting) {
    loaded = true;
    dispatch('visible');
  }
  
  // Clean up on component destroy
  onMount(() => {
    if (!enabled) {
      intersecting = true;
      loaded = true;
      return;
    }
    
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        entries => {
          // Get the first entry (we only observe one element)
          const [entry] = entries;
          
          // Update state when intersection changes
          if (entry.isIntersecting) {
            intersecting = true;
            
            // If set to once, disconnect the observer
            if (once) {
              observer.disconnect();
              observer = null;
            }
          } else {
            // Only change if not 'once' mode
            if (!once && loaded) {
              intersecting = false;
            }
          }
        },
        {
          rootMargin,
          threshold,
        }
      );
      
      // Start observing the container element
      observer.observe(container);
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      intersecting = true;
      loaded = true;
    }
    
    // Clean up on destroy
    return () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    };
  });
</script>

<div 
  bind:this={container}
  class="lazy-load-container {placeholder && !loaded ? placeholderClass : ''}"
  style="--offset: {offset}px" 
  class:loaded
>
  {#if loaded}
    <div class="lazy-load-content">
      <slot />
    </div>
  {:else if placeholder}
    <div class="lazy-load-placeholder">
      <slot name="placeholder">
        <!-- Default empty placeholder -->
      </slot>
    </div>
  {/if}
</div>

<style>
  .lazy-load-container {
    position: relative;
    display: block;
    width: 100%;
    min-height: 1px;
    overflow: hidden;
    transition: opacity 0.3s ease;
  }
  
  .lazy-load-content {
    position: relative;
    opacity: 0;
    animation: fade-in 0.5s ease forwards;
  }
  
  .lazy-load-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
  }
  
  :global(.dark) .lazy-load-placeholder {
    background-color: #374151;
  }
  
  .placeholder-pulse {
    animation: pulse 1.5s ease-in-out 0.5s infinite;
  }
  
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 0.8; }
    100% { opacity: 0.6; }
  }
</style> 