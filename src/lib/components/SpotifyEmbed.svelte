<script>
  export let url;
  export let title = '';
  
  // Extract Spotify embed information
  function getSpotifyEmbedUrl(url) {
    // Handle both podcast and episode URLs
    if (url.includes('episode')) {
      // Extract episode ID
      const matches = url.match(/episode\/([a-zA-Z0-9]+)/);
      if (matches && matches[1]) {
        return `https://open.spotify.com/embed/episode/${matches[1]}`;
      }
    } else if (url.includes('show')) {
      // Extract show ID
      const matches = url.match(/show\/([a-zA-Z0-9]+)/);
      if (matches && matches[1]) {
        return `https://open.spotify.com/embed/show/${matches[1]}`;
      }
    }
    return null;
  }
  
  const embedUrl = getSpotifyEmbedUrl(url);
  
  // Use intersection observer for lazy loading
  import { onMount } from 'svelte';
  
  let container;
  let loaded = false;
  
  onMount(() => {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            loaded = true;
            observer.disconnect();
          }
        });
      }, { threshold: 0.1 });
      
      if (container) {
        observer.observe(container);
      }
      
      return () => {
        if (container) {
          observer.unobserve(container);
        }
      };
    } else {
      // Fallback for browsers that don't support IntersectionObserver
      loaded = true;
    }
  });
</script>

<div class="h-[232px] bg-gray-200 dark:bg-gray-700 rounded overflow-hidden" bind:this={container}>
  {#if loaded && embedUrl}
    <iframe 
      src={embedUrl}
      title={title || "Spotify podcast"}
      frameborder="0" 
      allowtransparency="true" 
      allow="encrypted-media"
      loading="lazy"
      class="w-full h-full rounded focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
    ></iframe>
  {:else if embedUrl}
    <div class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <svg class="w-12 h-12 text-gray-400 dark:text-gray-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
      </svg>
    </div>
  {:else}
    <div class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div class="text-center text-gray-500 dark:text-gray-400">Invalid Spotify URL</div>
    </div>
  {/if}
</div> 