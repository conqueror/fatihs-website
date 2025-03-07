<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  export let type = 'fade'; // fade, fly, scale
  export let delay = 0;
  export let duration = 800;
  export let y = 20; // for fly animation
  export let x = 0; // for fly animation
  export let start = 0.95; // for scale animation
  
  let visible = false;
  let element;
  
  onMount(() => {
    if (!browser) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          visible = true;
          observer.unobserve(element);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(element);
    
    return () => {
      if (element) observer.unobserve(element);
    };
  });
</script>

<div bind:this={element}>
  <div class="animate-wrapper" 
       class:visible
       class:fade={type === 'fade'}
       class:fly={type === 'fly'}
       class:scale={type === 'scale'}
       style="--delay: {delay}ms; --duration: {duration}ms; --y: {y}px; --x: {x}px; --start: {start}">
    <slot />
  </div>
</div>

<style>
  .animate-wrapper {
    opacity: 0;
    transition-property: opacity, transform;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .animate-wrapper.visible {
    opacity: 1;
  }
  
  .animate-wrapper {
    transition-duration: var(--duration);
    transition-delay: var(--delay);
  }
  
  .fly:not(.visible) {
    transform: translate(var(--x), var(--y));
  }
  
  .fly.visible {
    transform: translate(0, 0);
  }
  
  .scale:not(.visible) {
    transform: scale(var(--start));
  }
  
  .scale.visible {
    transform: scale(1);
  }
  
  .fade:not(.visible) {
    opacity: 0;
  }
  
  .fade.visible {
    opacity: 1;
  }
</style> 