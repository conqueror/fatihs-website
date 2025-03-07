<script>
  export let url;
  export let title = '';
  export let showControls = true;
  
  // Extract YouTube video ID from URL
  function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }
  
  const videoId = getYouTubeId(url);
  
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

<div class="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 rounded overflow-hidden" bind:this={container}>
  {#if loaded && videoId}
    <iframe 
      src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1${showControls ? '' : '&controls=0'}`}
      title={title || "YouTube video"}
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen
      loading="lazy"
      class="w-full h-full rounded focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
    ></iframe>
  {:else if videoId}
    <div class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <svg class="w-12 h-12 text-gray-400 dark:text-gray-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </div>
  {:else}
    <div class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div class="text-center text-gray-500 dark:text-gray-400">Invalid YouTube URL</div>
    </div>
  {/if}
</div>

<style>
  /* Add aspect ratio styling for browsers that don't support the aspect-w-16 aspect-h-9 classes */
  .aspect-w-16.aspect-h-9 {
    position: relative;
    padding-bottom: 56.25%; /* 9/16 = 0.5625 */
  }
  
  .aspect-w-16.aspect-h-9 iframe,
  .aspect-w-16.aspect-h-9 > div {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style> 