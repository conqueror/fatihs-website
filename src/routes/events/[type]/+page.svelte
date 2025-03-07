<script>
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import SEO from '$lib/components/SEO.svelte';
  import EventCard from '$lib/components/EventCard.svelte';
  
  export let data;
  const { events, type } = data;
  
  let visible = false;
  let filteredEvents = [];
  let years = [];
  let tags = [];
  let searchQuery = '';
  let selectedYear = 'all';
  let selectedTags = [];
  
  onMount(() => {
    // Extract all years from events
    const yearSet = new Set();
    events.forEach(event => {
      if (event.date) {
        const year = new Date(event.date).getFullYear();
        if (!isNaN(year)) {
          yearSet.add(year.toString());
        }
      }
    });
    years = Array.from(yearSet).sort((a, b) => b - a);
    
    // Extract all tags from events
    const tagSet = new Set();
    events.forEach(event => {
      if (event.tags && Array.isArray(event.tags)) {
        event.tags.forEach(tag => tagSet.add(tag));
      }
    });
    tags = Array.from(tagSet).sort();
    
    // Initialize filtered events
    filterEvents();
    
    visible = true;
  });
  
  // Type specific information
  const typeInfo = {
    'speaking': {
      title: 'Speaking Engagements',
      description: 'Conference talks, workshops, and panels where I share insights on artificial intelligence, machine learning, and retail technology innovation.',
      icon: 'microphone',
      color: 'blue',
      emoji: '🎤'
    },
    'organizing': {
      title: 'Organizing Events',
      description: 'Hackathons, conferences, and community events that I\'ve helped organize, judge, or mentor to foster innovation and knowledge sharing.',
      icon: 'people-group',
      color: 'green',
      emoji: '👥'
    },
    'media': {
      title: 'Media Appearances',
      description: 'Podcast interviews, video appearances, and other media engagements where I discuss technology trends, AI developments, and retail innovation.',
      icon: 'podcast',
      color: 'purple',
      emoji: '🎙️'
    }
  };
  
  // Filter events based on user selection
  function filterEvents() {
    filteredEvents = [...events];
    
    // Filter by year
    if (selectedYear !== 'all') {
      filteredEvents = filteredEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getFullYear().toString() === selectedYear.toString();
      });
    }
    
    // Filter by tags
    if (selectedTags.length > 0) {
      filteredEvents = filteredEvents.filter(event => 
        event.tags && selectedTags.some(tag => event.tags.includes(tag)));
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredEvents = filteredEvents.filter(event => 
        (event.title && event.title.toLowerCase().includes(query)) ||
        (event.event && event.event.toLowerCase().includes(query)) ||
        (event.excerpt && event.excerpt.toLowerCase().includes(query))
      );
    }
  }
  
  // Watch for changes in filter state
  $: if (visible && (selectedYear || selectedTags || searchQuery)) {
    filterEvents();
  }
  
  // Toggle a tag in the selected tags list
  function toggleTag(tag) {
    if (selectedTags.includes(tag)) {
      selectedTags = selectedTags.filter(t => t !== tag);
    } else {
      selectedTags = [...selectedTags, tag];
    }
  }
  
  // Reset all filters
  function resetFilters() {
    selectedYear = 'all';
    selectedTags = [];
    searchQuery = '';
  }
  
  // Get page title and description based on event type
  $: pageTitle = typeInfo[type]?.title || `${type.charAt(0).toUpperCase() + type.slice(1)} Events`;
  $: pageDescription = typeInfo[type]?.description || `Events related to ${type}`;
  $: pageColor = typeInfo[type]?.color || 'primary';
  $: pageEmoji = typeInfo[type]?.emoji || '📅';
</script>

<SEO 
  title="{pageTitle} | Fatih Nayebi"
  description={pageDescription}
  keywords={`${type} events, ${tags.slice(0, 5).join(', ')}`}
  canonical={`https://fatihnayebi.com/events/${type}`}
  openGraph={{
    title: pageTitle,
    description: pageDescription,
    url: `https://fatihnayebi.com/events/${type}`,
    type: 'website'
  }}
  twitter={{
    card: 'summary',
    title: pageTitle,
    description: pageDescription
  }}
/>

{#if visible}
<div class="container mx-auto px-4 py-12 relative" in:fade={{ duration: 300 }}>
  <!-- Background decorative elements -->
  <div class="absolute top-0 right-10 -z-10 opacity-10 w-64 h-64 
    {pageColor === 'blue' ? 'bg-blue-600/20 dark:bg-blue-400/5' :
     pageColor === 'green' ? 'bg-green-600/20 dark:bg-green-400/5' :
     pageColor === 'purple' ? 'bg-purple-600/20 dark:bg-purple-400/5' :
     'bg-primary-600/20 dark:bg-primary-400/5'} 
    rounded-full blur-3xl"></div>
  <div class="absolute bottom-40 left-10 -z-10 opacity-10 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-300/5 rounded-full blur-3xl"></div>
  
  <!-- Breadcrumb Navigation -->
  <div class="mb-8" in:fly={{ y: -30, duration: 500 }}>
    <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
      <a href="/" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</a>
      <svg class="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
      <a href="/events" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Events</a>
      <svg class="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
      <span class="text-gray-800 dark:text-gray-300 capitalize">{pageTitle}</span>
    </div>
  </div>
  
  <!-- Page Header -->
  <div class="mb-12 text-center" in:fly={{ y: 30, duration: 500, delay: 100 }}>
    <h1 class="text-5xl font-bold mb-6 flex justify-center items-center
      {pageColor === 'blue' ? 'text-blue-600 dark:text-blue-400' :
       pageColor === 'green' ? 'text-green-600 dark:text-green-400' :
       pageColor === 'purple' ? 'text-purple-600 dark:text-purple-400' :
       'text-primary-600 dark:text-primary-400'}">
      <span class="mr-4 text-4xl">{pageEmoji}</span>
      {pageTitle}
    </h1>
    <p class="text-lg max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
      {pageDescription}
    </p>
  </div>
  
  <!-- Search and Filter Controls -->
  <div class="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-xl dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700" in:fly={{ y: 30, duration: 500, delay: 200 }}>
    <!-- Search input -->
    <div class="mb-4">
      <div class="relative">
        <input 
          type="text" 
          bind:value={searchQuery}
          placeholder="Search events..."
          class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 placeholder-gray-500 dark:placeholder-gray-400"
        />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
      </div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Year filter -->
      <div>
        <label for="year-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
        <select 
          id="year-filter"
          bind:value={selectedYear}
          class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 text-gray-800 dark:text-gray-200"
        >
          <option value="all">All Years</option>
          {#each years as year}
            <option value={year}>{year}</option>
          {/each}
        </select>
      </div>
      
      <!-- Reset filters button -->
      <div class="flex items-end">
        <button 
          on:click={resetFilters}
          class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
        >
          Reset Filters
        </button>
      </div>
      
      <!-- Browse all events button -->
      <div class="flex items-end justify-end">
        <a 
          href="/events" 
          class="px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Browse All Events
        </a>
      </div>
    </div>
    
    <!-- Tags filter -->
    {#if tags.length > 0}
      <div class="mt-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
        <div class="flex flex-wrap gap-2">
          {#each tags as tag}
            <button 
              on:click={() => toggleTag(tag)}
              class="px-3 py-1 text-sm rounded-full transition-colors border
              {selectedTags.includes(tag) 
                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/50 dark:text-primary-300 border-primary-300 dark:border-primary-700' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 border-gray-200 dark:border-gray-600'} 
              focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            >
              {tag}
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>
  
  <!-- Results Section -->
  {#if filteredEvents.length === 0}
    <div class="text-center py-16 text-gray-600 dark:text-gray-400" in:fly={{ y: 30, duration: 500, delay: 300 }}>
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h3 class="text-xl font-bold mb-2">No events found</h3>
      <p>Try adjusting your filters or search criteria.</p>
      <button 
        on:click={resetFilters}
        class="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      >
        Reset Filters
      </button>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" in:fly={{ y: 30, duration: 500, delay: 300 }}>
      {#each filteredEvents as event}
        <a href="/events/{type}/{event.slug}" class="block">
          <EventCard {event} />
        </a>
      {/each}
    </div>
  {/if}
  
  <!-- Back to all events -->
  <div class="mt-12 text-center" in:fade={{ duration: 300, delay: 400 }}>
    <a 
      href="/events" 
      class="inline-flex items-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium text-lg"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
      </svg>
      View All Event Types
    </a>
  </div>
</div>
{/if} 