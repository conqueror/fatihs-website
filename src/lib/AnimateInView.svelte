<script>
  import { onMount } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';
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
  {#if visible && browser}
    {#if type === 'fade'}
      <div in:fade={{ delay, duration }}>
        <slot />
      </div>
    {:else if type === 'fly'}
      <div in:fly={{ y, x, delay, duration }}>
        <slot />
      </div>
    {:else if type === 'scale'}
      <div in:scale={{ start, delay, duration }}>
        <slot />
      </div>
    {/if}
  {:else}
    <div class="opacity-0">
      <slot />
    </div>
  {/if}
</div> 