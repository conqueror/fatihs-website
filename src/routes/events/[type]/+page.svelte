<script>
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import SEO from '$lib/components/seo/SEO.svelte';
  import EventCard from '$lib/components/ui/EventCard.svelte';
  import EventCalendar from '$lib/components/ui/EventCalendar.svelte';
  import PageContainer from '$lib/components/layout/PageContainer.svelte';
  
  export let data;
  const { events, type } = data;
  
  let visible = false;
  let filteredEvents = [];
  let years = [];
  let tags = [];
  let searchQuery = '';
  let selectedYear = 'all';
  let selectedTags = [];
  let viewMode = 'list'; // 'list' or 'calendar'
  
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
  title={`${type.charAt(0).toUpperCase() + type.slice(1)} Events`}
  description={`Browse my ${type} events, including ${type === 'speaking' ? 'talks, keynotes, and panel discussions' : type === 'organizing' ? 'conferences, meetups, and workshops' : 'podcasts, interviews, and media appearances'}.`}
/>

{#if visible}
<PageContainer>
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">
      {type.charAt(0).toUpperCase() + type.slice(1)} Events
    </h1>
    
    <a 
      href="/events" 
      class="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to All Events
    </a>
  </div>
  
  <!-- View Toggle Buttons -->
  <div class="flex mb-6 border-b border-gray-200 dark:border-gray-700">
    <button 
      class="py-2 px-4 font-medium text-sm {viewMode === 'list' ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-400 dark:border-primary-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}"
      on:click={() => viewMode = 'list'}
      aria-label="List view"
    >
      List View
    </button>
    <button 
      class="py-2 px-4 font-medium text-sm {viewMode === 'calendar' ? 'text-primary-600 border-b-2 border-primary-600 dark:text-primary-400 dark:border-primary-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}"
      on:click={() => viewMode = 'calendar'}
      aria-label="Calendar view"
    >
      Calendar View
    </button>
  </div>
  
  <!-- Filter controls -->
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
        <label for="type-tags-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
        <div id="type-tags-filter" role="group" aria-label="Filter by tags" class="flex flex-wrap gap-2">
          {#each tags as tag}
            <button 
              on:click={() => toggleTag(tag)}
              class="px-3 py-1 text-sm rounded-full transition-colors {selectedTags.includes(tag) ? 'bg-primary-500 dark:bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}"
            >
              {tag}
            </button>
          {/each}
        </div>
      </div>
    {/if}
  </div>
    
  <!-- Display info about type -->
  {#if typeInfo[type]}
    <div class="mb-8">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-xl dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 prose prose-sm dark:prose-invert max-w-none">
        <h2>{typeInfo[type].title}</h2>
        <p>{typeInfo[type].description}</p>
      </div>
    </div>
  {/if}
    
  <!-- Display events according to view mode -->
  {#if viewMode === 'list'}
    {#if filteredEvents.length > 0}
      <div class="space-y-6">
        {#each filteredEvents as event}
          <div in:fade={{ duration: 300 }}>
            <EventCard {event} />
          </div>
        {/each}
      </div>
    {:else}
      <div class="p-10 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-center">
        <p class="text-gray-600 dark:text-gray-300">No events found matching your criteria</p>
        <button 
          on:click={resetFilters}
          class="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 dark:focus:ring-primary-400"
        >
          Reset Filters
        </button>
      </div>
    {/if}
  {:else}
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-xl dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700 p-4">
      <EventCalendar events={filteredEvents} />
    </div>
  {/if}
</PageContainer>
{/if} 