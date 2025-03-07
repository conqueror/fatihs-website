<script>
  import { onMount, afterUpdate, onDestroy, createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';
  
  // Props
  export let duration = 200;         // Transition duration in ms
  export let delay = 50;             // Transition delay in ms
  export let easing = cubicOut;      // Easing function
  export let enabled = true;         // Enable/disable transitions
  export let resetScroll = true;     // Auto-scroll to top on page change
  export let key = null;             // Key to trigger transitions (usually the pathname)
  
  // Internal state
  let mounted = false;
  let transitionMode = 'out-in';     // 'in-out' | 'out-in' | 'simultaneous'
  let currentKey = key;              // Track the current key for transitions
  let previousKey = null;            // Track the previous key
  let firstRender = true;            // Skip animation on first render
  let transitioning = false;         // Currently in transition
  let container;                     // Reference to container element
  
  // Create event dispatcher
  const dispatch = createEventDispatcher();
  
  // Import easing function
  function cubicOut(t) {
    const f = t - 1.0;
    return f * f * f + 1.0;
  }
  
  // Handle transitions when key changes
  $: if (mounted && key !== currentKey && enabled) {
    previousKey = currentKey;
    currentKey = key;
    transitioning = true;
    
    if (!firstRender) {
      // Emit events
      dispatch('transition', { from: previousKey, to: currentKey });
    }
    
    // Skip animation on first render
    firstRender = false;
  }
  
  // When transition ends
  function onTransitionEnd() {
    transitioning = false;
    dispatch('transitionend', { key: currentKey });
    
    // Reset scroll position if needed
    if (resetScroll && typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }
  
  onMount(() => {
    mounted = true;
    
    // Skip transitions on initial render
    setTimeout(() => {
      firstRender = false;
    }, 100);
  });
  
  afterUpdate(() => {
    // If key changed, handle transitions
    if (key !== currentKey && enabled) {
      currentKey = key;
    }
  });
  
  onDestroy(() => {
    // Clean up any timers or listeners
  });
</script>

<div 
  bind:this={container}
  class="page-transition"
  class:transitioning
>
  {#key key}
    <div 
      class="page-content"
      transition:fade={{ duration, delay, easing }}
      on:introend={onTransitionEnd}
      on:outroend={() => dispatch('outroend')}
    >
      <slot />
    </div>
  {/key}
</div>

<style>
  .page-transition {
    position: relative;
    display: flex;
    flex-direction: column;
    min-height: 0;
    flex: 1;
  }
  
  .page-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
  }
  
  .transitioning {
    pointer-events: none;
  }
</style> 