<script>
  export let event;
  export let showType = true;

  // Helper to format date
  function formatDate(dateString) {
    if (!dateString) return 'Date TBA';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  }

  // Type label mappings
  const typeLabels = {
    'speaking': 'Speaking',
    'organizing': 'Organizing',
    'media': 'Media Appearance'
  };

  // Type icon mappings
  const typeIcons = {
    'speaking': 'microphone',
    'organizing': 'people-group',
    'media': 'podcast'
  };
  
  // Import media components dynamically
  import { onMount } from 'svelte';
  
  let YouTubeEmbed;
  let SpotifyEmbed;
  
  onMount(async () => {
    if (event.mediaType === 'youtube') {
      const module = await import('./YouTubeEmbed.svelte');
      YouTubeEmbed = module.default;
    } else if (event.mediaType === 'spotify') {
      const module = await import('./SpotifyEmbed.svelte');
      SpotifyEmbed = module.default;
    }
  });
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-xl dark:shadow-gray-900/30 overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
  <div class="p-6">
    <!-- Type badge if showType is true -->
    {#if showType && event.type}
      <div class="mb-3">
        <span class="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full 
          {event.type === 'speaking' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200' : 
           event.type === 'organizing' ? 'bg-green-100 text-green-800 dark:bg-green-900/60 dark:text-green-200' : 
           'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200'} 
           border border-transparent dark:border-opacity-10 
           {event.type === 'speaking' ? 'dark:border-blue-700' : 
            event.type === 'organizing' ? 'dark:border-green-700' : 
            'dark:border-purple-700'}">
          <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <!-- Icon based on type -->
            {#if event.type === 'speaking'}
              <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"></path>
            {:else if event.type === 'organizing'}
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
            {:else}
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"></path>
            {/if}
          </svg>
          {typeLabels[event.type] || event.type}
        </span>
      </div>
    {/if}

    <!-- Event name and title -->
    <div class="mb-4">
      <h3 class="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
        {event.event}
      </h3>
      {#if event.title}
        <div class="text-xl mb-3 text-primary-600 dark:text-primary-400">
          {event.title}
        </div>
      {/if}
    </div>
    
    <!-- Date and Location -->
    <div class="flex flex-col sm:flex-row sm:gap-8 mb-4">
      <!-- Date -->
      {#if event.date}
        <div class="flex items-center mb-2 sm:mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <span>{formatDate(event.date)}</span>
        </div>
      {/if}
      
      <!-- Location -->
      {#if event.location}
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>{event.location}</span>
        </div>
      {/if}
      
      <!-- Media Duration (for podcast/video) -->
      {#if event.mediaDuration}
        <div class="flex items-center mt-2 sm:mt-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span>{event.mediaDuration}</span>
        </div>
      {/if}
    </div>
    
    <!-- Media Embed (for podcast/video) -->
    {#if event.mediaUrl && event.mediaType}
      <div class="mb-6 rounded overflow-hidden border border-gray-200 dark:border-gray-700">
        {#if event.mediaType === 'youtube' && YouTubeEmbed}
          <svelte:component this={YouTubeEmbed} url={event.mediaUrl} title={event.title} />
        {:else if event.mediaType === 'spotify' && SpotifyEmbed}
          <svelte:component this={SpotifyEmbed} url={event.mediaUrl} title={event.title} />
        {/if}
      </div>
    {/if}
    
    <!-- Excerpt -->
    <div class="prose dark:prose-invert max-w-none mb-4">
      <p class="text-gray-700 dark:text-gray-300">
        {#if event.excerpt && event.excerpt.length > 0}
          {event.excerpt}
        {:else if event.content && event.content.length > 0}
          {event.content.substring(0, 150)}...
        {:else}
          Details coming soon...
        {/if}
      </p>
    </div>
    
    <!-- Role (for organizing) -->
    {#if event.role}
      <div class="mb-4 p-2 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-700">
        <span class="font-semibold">Role:</span> {event.role}
      </div>
    {/if}
    
    <!-- Host (for media) -->
    {#if event.host}
      <div class="mb-4 p-2 bg-gray-50 dark:bg-gray-800/50 rounded border border-gray-100 dark:border-gray-700">
        <span class="font-semibold">Host:</span> {event.host}
      </div>
    {/if}
    
    <!-- Tags -->
    {#if event.tags && event.tags.length > 0}
      <div class="flex flex-wrap gap-2 mt-4">
        {#each event.tags as tag}
          <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full border border-gray-200 dark:border-gray-600">
            {tag}
          </span>
        {/each}
      </div>
    {/if}
    
    <!-- View Details Link -->
    <div class="mt-6">
      <a 
        href="/events/{event.type}/{event.slug}" 
        class="inline-flex items-center text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 rounded p-1"
      >
        View Details
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>
    </div>
  </div>
</div> 