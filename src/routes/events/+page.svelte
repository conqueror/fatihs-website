<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import SEO from '$lib/components/seo/SEO.svelte';
  import EventCard from '$lib/components/ui/EventCard.svelte';
  import EventCalendar from '$lib/components/ui/EventCalendar.svelte';
  import PageContainer from '$lib/components/layout/PageContainer.svelte';
  
  // Import any required components for animation
  // Assuming there's an AnimateInView component as shown in the plan
  let AnimateInView;
  
  onMount(async () => {
    const module = await import('$lib/components/ui/AnimateInView.svelte');
    AnimateInView = module.default;
    
    // Apply URL search params to state
    applySearchParamsToState();
    
    // Set visible after loading
    visible = true;
  });
  
  export let data;
  const { allEvents, years, tags, locations } = data;
  
  // Filtering state
  let selectedType = 'all';
  let selectedYear = 'all';
  let selectedLocation = 'all';
  let selectedTags = [];
  let searchQuery = '';
  
  // UI state
  let filteredEvents = {};
  let visible = false;
  let showFilterPanel = false;
  
  // Add a view state
  let viewMode = 'list'; // 'list' or 'calendar'
  
  // Function to apply search params from URL to state
  function applySearchParamsToState() {
    if (browser) {
      const searchParams = new URLSearchParams($page.url.search);
      
      if (searchParams.has('type')) {
        selectedType = searchParams.get('type');
      }
      
      if (searchParams.has('year')) {
        selectedYear = searchParams.get('year');
      }
      
      if (searchParams.has('location')) {
        selectedLocation = searchParams.get('location');
      }
      
      if (searchParams.has('tags')) {
        const tagParam = searchParams.get('tags');
        selectedTags = tagParam.split(',').filter(Boolean);
      }
      
      if (searchParams.has('q')) {
        searchQuery = searchParams.get('q');
      }
    }
  }
  
  // Function to update URL with current filters
  function updateUrlWithFilters() {
    if (browser) {
      const searchParams = new URLSearchParams();
      
      if (selectedType !== 'all') {
        searchParams.set('type', selectedType);
      }
      
      if (selectedYear !== 'all') {
        searchParams.set('year', selectedYear);
      }
      
      if (selectedLocation !== 'all') {
        searchParams.set('location', selectedLocation);
      }
      
      if (selectedTags.length > 0) {
        searchParams.set('tags', selectedTags.join(','));
      }
      
      if (searchQuery) {
        searchParams.set('q', searchQuery);
      }
      
      const newUrl = searchParams.toString() 
        ? `${$page.url.pathname}?${searchParams.toString()}`
        : $page.url.pathname;
      
      goto(newUrl, { replaceState: true, noScroll: true });
    }
  }
  
  // Function that filters events when state changes
  function filterEvents() {
    filteredEvents = {};
    
    // Create an array of events filtered by selected criteria
    let filtered = [...allEvents];
    
    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(event => event.type === selectedType);
    }
    
    // Filter by year
    if (selectedYear !== 'all') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getFullYear().toString() === selectedYear.toString();
      });
    }
    
    // Filter by location
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(event => 
        event.location && event.location.includes(selectedLocation));
    }
    
    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(event => 
        event.tags && selectedTags.some(tag => event.tags.includes(tag)));
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(event => 
        (event.title && event.title.toLowerCase().includes(query)) ||
        (event.event && event.event.toLowerCase().includes(query)) ||
        (event.excerpt && event.excerpt.toLowerCase().includes(query))
      );
    }
    
    // Group by year
    years.forEach(year => {
      const forYear = filtered.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getFullYear().toString() === year.toString();
      });
      
      if (forYear.length > 0) {
        filteredEvents[year] = forYear;
      }
    });
    
    // Update URL to reflect current filters
    updateUrlWithFilters();
  }
  
  // Watch for changes in filter state
  $: if (visible && (selectedType || selectedYear || selectedLocation || selectedTags || searchQuery)) {
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
    selectedType = 'all';
    selectedYear = 'all';
    selectedLocation = 'all';
    selectedTags = [];
    searchQuery = '';
    showFilterPanel = false;
  }

  // SEO MetaData for the Main Events Page
  const pageTitle = "Events | Dr. Fatih Nayebi - Speaking, Organizing, Media";
  const pageDescription = "Explore professional events featuring Dr. Fatih Nayebi, including speaking engagements, organized hackathons, media appearances, and podcast interviews on AI and retail technology.";
  const keywords = "Fatih Nayebi events, AI speaker, retail technology conference, data science podcast, AI hackathon";
  const siteUrl = "https://fatihnayebi.com";
  const canonicalUrl = `${siteUrl}/events`;

  const openGraphData = {
    title: pageTitle,
    description: pageDescription,
    type: "website",
    url: canonicalUrl,
    image: `${siteUrl}/images/social-card.jpg`
  };

  const twitterData = {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    image: `${siteUrl}/images/social-card.jpg`
  };

  // Basic structured data (Website/CollectionPage). SEO component adds Breadcrumbs.
  const eventsPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": pageTitle,
    "description": pageDescription,
    "url": canonicalUrl
    // Potentially add mainEntity listing the categories if desired
  };
</script>

<SEO 
  title={pageTitle}
  description={pageDescription}
  keywords={keywords}
  canonical={canonicalUrl}
  type="website"
  openGraph={openGraphData}
  twitter={twitterData}
  structuredData={eventsPageStructuredData}
/>

{#if visible}
<PageContainer heroSection={true}>
  <!-- Background decorative elements with dark mode specific colors -->
  <div class="absolute top-20 right-10 opacity-10 w-64 h-64 bg-primary-600/20 dark:bg-primary-400/5 rounded-full blur-3xl"></div>
  <div class="absolute bottom-40 left-10 opacity-10 w-96 h-96 bg-indigo-400/20 dark:bg-indigo-300/5 rounded-full blur-3xl"></div>
  
  <!-- Title and Introduction Section -->
  <h1 class="text-5xl font-bold mb-4 text-center text-primary dark:text-blue-400" in:fly={{ y: -30, duration: 800, delay: 100 }}>
    Professional Events
  </h1>
  <p class="text-lg text-center mb-8 max-w-3xl mx-auto text-gray-700 dark:text-gray-300" in:fly={{ y: 30, duration: 800, delay: 300 }}>
    Explore my professional activities including conference talks, hackathons I've organized, and podcast appearances where I discuss artificial intelligence, retail technology, and data science.
  </p>

  <!-- Call to action box with improved dark mode styling -->
  {#if AnimateInView}
    <svelte:component this={AnimateInView} type="fade" delay={500}>
      <div class="mb-16 bg-gradient-to-br from-primary/5 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-xl shadow-lg backdrop-blur-[2px] border border-primary-200 dark:border-primary-800/50 text-gray-800 dark:text-gray-100 relative overflow-hidden">
        <!-- Decorative elements -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 dark:bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div class="absolute bottom-0 left-0 w-32 h-32 bg-indigo-100/20 dark:bg-indigo-500/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <h3 class="text-2xl font-bold mb-4 relative z-10 text-primary-700 dark:text-blue-400">Interested in having me speak at your event?</h3>
        <p class="mb-6 text-lg max-w-2xl relative z-10">
          I'm available for speaking engagements, podcast appearances, and hackathon judging/mentoring on AI, machine learning, retail technology, 
          and data science. Please get in touch via the contact page to discuss opportunities.
        </p>
        <a href="/contact" class="inline-block px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-600 transition-colors shadow-md relative z-10 focus:outline-none focus:ring-2 focus:ring-primary/50 transform hover:scale-105 duration-300">
          Contact Me
        </a>
      </div>
    </svelte:component>
  {:else}
    <!-- Same CTA box without animation wrapper -->
    <div class="mb-16 bg-gradient-to-br from-primary/5 to-indigo-100/50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-xl shadow-lg backdrop-blur-[2px] border border-primary-200 dark:border-primary-800/50 text-gray-800 dark:text-gray-100 relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 dark:bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div class="absolute bottom-0 left-0 w-32 h-32 bg-indigo-100/20 dark:bg-indigo-500/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      
      <h3 class="text-2xl font-bold mb-4 relative z-10 text-primary-700 dark:text-blue-400">Interested in having me speak at your event?</h3>
      <p class="mb-6 text-lg max-w-2xl relative z-10">
        I'm available for speaking engagements, podcast appearances, and hackathon judging/mentoring on AI, machine learning, retail technology, 
        and data science. Please get in touch via the contact page to discuss opportunities.
      </p>
      <a href="/contact" class="inline-block px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-600 transition-colors shadow-md relative z-10 focus:outline-none focus:ring-2 focus:ring-primary/50 transform hover:scale-105 duration-300">
        Contact Me
      </a>
    </div>
  {/if}

  <!-- Event Categories Section with explicit links for crawlers -->
  {#if AnimateInView}
    <svelte:component this={AnimateInView} type="fade" delay={700}>
      <div class="mb-12">
        <h2 class="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Browse by Category</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Speaking Events Card -->
          <a href="/events/speaking" class="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
            <div class="flex items-center mb-4">
              <span class="text-3xl mr-3">🎤</span>
              <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400">Speaking</h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300">Conference talks, workshops, and panels where I share insights on AI, ML, and retail technology.</p>
          </a>
          
          <!-- Organizing Events Card -->
          <a href="/events/organizing" class="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
            <div class="flex items-center mb-4">
              <span class="text-3xl mr-3">👥</span>
              <h3 class="text-xl font-bold text-green-600 dark:text-green-400">Organizing</h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300">Hackathons, conferences, and community events that I've helped organize, judge, or mentor.</p>
          </a>
          
          <!-- Media Appearances Card -->
          <a href="/events/media" class="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
            <div class="flex items-center mb-4">
              <span class="text-3xl mr-3">🎙️</span>
              <h3 class="text-xl font-bold text-purple-600 dark:text-purple-400">Media</h3>
            </div>
            <p class="text-gray-600 dark:text-gray-300">Podcast interviews, video appearances, and other media engagements on technology trends and AI.</p>
          </a>
        </div>
      </div>
    </svelte:component>
  {:else}
    <div class="mb-12">
      <h2 class="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">Browse by Category</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Speaking Events Card -->
        <a href="/events/speaking" class="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
          <div class="flex items-center mb-4">
            <span class="text-3xl mr-3">🎤</span>
            <h3 class="text-xl font-bold text-blue-600 dark:text-blue-400">Speaking</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-300">Conference talks, workshops, and panels where I share insights on AI, ML, and retail technology.</p>
        </a>
        
        <!-- Organizing Events Card -->
        <a href="/events/organizing" class="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
          <div class="flex items-center mb-4">
            <span class="text-3xl mr-3">👥</span>
            <h3 class="text-xl font-bold text-green-600 dark:text-green-400">Organizing</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-300">Hackathons, conferences, and community events that I've helped organize, judge, or mentor.</p>
        </a>
        
        <!-- Media Appearances Card -->
        <a href="/events/media" class="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
          <div class="flex items-center mb-4">
            <span class="text-3xl mr-3">🎙️</span>
            <h3 class="text-xl font-bold text-purple-600 dark:text-purple-400">Media</h3>
          </div>
          <p class="text-gray-600 dark:text-gray-300">Podcast interviews, video appearances, and other media engagements on technology trends and AI.</p>
        </a>
      </div>
    </div>
  {/if}

  <!-- View Toggle Buttons with animation -->
  {#if AnimateInView}
    <svelte:component this={AnimateInView} type="fade" delay={900}>
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
    </svelte:component>
  {:else}
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
  {/if}

  <!-- Search and Filter Controls with improved dark mode styling and animation -->
  {#if AnimateInView}
    <svelte:component this={AnimateInView} type="fade" delay={1100}>
      <div class="mb-8">
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

        <!-- Type filtering tabs with improved dark mode styling -->
        <div class="flex flex-wrap justify-center mb-6 sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-4 rounded-lg shadow dark:shadow-gray-800/50 border border-gray-100 dark:border-gray-700/50">
          <button 
            class="px-6 py-2 mx-2 mb-2 rounded-full {selectedType === 'all' ? 'bg-primary-600 text-white dark:bg-primary-500 dark:text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'} transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            on:click={() => selectedType = 'all'}
          >
            All
          </button>
          <button 
            class="px-6 py-2 mx-2 mb-2 rounded-full {selectedType === 'speaking' ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'} transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            on:click={() => selectedType = 'speaking'}
          >
            Speaking
          </button>
          <button 
            class="px-6 py-2 mx-2 mb-2 rounded-full {selectedType === 'organizing' ? 'bg-green-600 text-white dark:bg-green-500 dark:text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'} transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
            on:click={() => selectedType = 'organizing'}
          >
            Organizing
          </button>
          <button 
            class="px-6 py-2 mx-2 mb-2 rounded-full {selectedType === 'media' ? 'bg-purple-600 text-white dark:bg-purple-500 dark:text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'} transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
            on:click={() => selectedType = 'media'}
          >
            Media
          </button>
        </div>
      </div>
    </svelte:component>
  {:else}
    <div class="mb-8">
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

      <!-- Type filtering tabs with improved dark mode styling -->
      <div class="flex flex-wrap justify-center mb-6 sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-4 rounded-lg shadow dark:shadow-gray-800/50 border border-gray-100 dark:border-gray-700/50">
        <button 
          class="px-6 py-2 mx-2 mb-2 rounded-full {selectedType === 'all' ? 'bg-primary-600 text-white dark:bg-primary-500 dark:text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'} transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
          on:click={() => selectedType = 'all'}
        >
          All
        </button>
        <button 
          class="px-6 py-2 mx-2 mb-2 rounded-full {selectedType === 'speaking' ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'} transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          on:click={() => selectedType = 'speaking'}
        >
          Speaking
        </button>
        <button 
          class="px-6 py-2 mx-2 mb-2 rounded-full {selectedType === 'organizing' ? 'bg-green-600 text-white dark:bg-green-500 dark:text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'} transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400"
          on:click={() => selectedType = 'organizing'}
        >
          Organizing
        </button>
        <button 
          class="px-6 py-2 mx-2 mb-2 rounded-full {selectedType === 'media' ? 'bg-purple-600 text-white dark:bg-purple-500 dark:text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'} transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
          on:click={() => selectedType = 'media'}
        >
          Media
        </button>
      </div>
    </div>
  {/if}
    
  <!-- Advanced filters toggle with improved dark mode styling and animation -->
  {#if AnimateInView}
    <svelte:component this={AnimateInView} type="fade" delay={1300}>
      <div class="flex justify-center mb-6">
        <button 
          on:click={() => showFilterPanel = !showFilterPanel}
          class="px-4 py-2 text-sm font-medium flex items-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 rounded"
        >
          {showFilterPanel ? 'Hide Filters' : 'Show Advanced Filters'}
          <svg class="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={showFilterPanel ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
          </svg>
        </button>
      </div>
    </svelte:component>
  {:else}
    <div class="flex justify-center mb-6">
      <button 
        on:click={() => showFilterPanel = !showFilterPanel}
        class="px-4 py-2 text-sm font-medium flex items-center text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 rounded"
      >
        {showFilterPanel ? 'Hide Filters' : 'Show Advanced Filters'}
        <svg class="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={showFilterPanel ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
        </svg>
      </button>
    </div>
  {/if}
    
  <!-- Advanced filter panel with improved dark mode styling -->
  {#if showFilterPanel}
    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-xl dark:shadow-gray-900/20 p-6 mb-8 border border-gray-200 dark:border-gray-700" transition:fade={{ duration: 200 }}>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        
        <!-- Location filter -->
        <div>
          <label for="location-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location</label>
          <select 
            id="location-filter"
            bind:value={selectedLocation}
            class="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-primary-500 dark:focus:border-primary-400 text-gray-800 dark:text-gray-200"
          >
            <option value="all">All Locations</option>
            {#each locations as location}
              <option value={location}>{location}</option>
            {/each}
          </select>
        </div>
        
        <!-- Reset filters button -->
        <div class="flex items-end">
          <button 
            on:click={resetFilters}
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
          >
            Reset All Filters
          </button>
        </div>
      </div>
      
      <!-- Tags filter with improved dark mode styling -->
      <div class="mt-6">
        <label for="tags-filter" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</label>
        <div id="tags-filter" role="group" aria-label="Filter by tags" class="flex flex-wrap gap-2">
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
    </div>
  {/if}

  <!-- Display events by year with improved dark mode styling -->
  {#if viewMode === 'list'}
    {#if Object.keys(filteredEvents).length > 0}
      {#each Object.keys(filteredEvents).sort((a, b) => b - a) as year}
        {#if AnimateInView}
          <svelte:component this={AnimateInView} type="fade" delay={300}>
            <div class="mb-20">
              <h2 class="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">{year} Events</h2>
              
              <div class="grid gap-8">
                {#each filteredEvents[year] as event, i}
                  <EventCard {event} />
                {/each}
              </div>
            </div>
          </svelte:component>
        {:else}
          <div class="mb-20">
            <h2 class="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">{year} Events</h2>
            
            <div class="grid gap-8">
              {#each filteredEvents[year] as event, i}
                <EventCard {event} />
              {/each}
            </div>
          </div>
        {/if}
      {/each}
    {:else}
      {#if AnimateInView}
        <svelte:component this={AnimateInView} type="fade" delay={500}>
          <div class="mb-8 text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 class="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">No Events Found</h2>
            <p class="text-gray-700 dark:text-gray-300 mb-8">
              No events matching the selected filters are available.
            </p>
            <button 
              on:click={resetFilters}
              class="px-6 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Reset Filters
            </button>
          </div>
        </svelte:component>
      {:else}
        <div class="mb-8 text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 class="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">No Events Found</h2>
          <p class="text-gray-700 dark:text-gray-300 mb-8">
            No events matching the selected filters are available.
          </p>
          <button 
            on:click={resetFilters}
            class="px-6 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            Reset Filters
          </button>
        </div>
      {/if}
    {/if}
  {:else}
    <!-- Calendar view -->
    <div class="mb-8">
      <EventCalendar events={allEvents.filter(event => {
        // Apply the same filters as we do for the list view
        let matchesType = selectedType === 'all' || event.type === selectedType;
        
        let matchesYear = true;
        if (selectedYear !== 'all') {
          const eventDate = new Date(event.date);
          matchesYear = eventDate.getFullYear().toString() === selectedYear.toString();
        }
        
        let matchesLocation = true;
        if (selectedLocation !== 'all') {
          matchesLocation = event.location && event.location.includes(selectedLocation);
        }
        
        let matchesTags = true;
        if (selectedTags.length > 0) {
          matchesTags = event.tags && selectedTags.some(tag => event.tags.includes(tag));
        }
        
        let matchesSearch = true;
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          matchesSearch = 
            (event.title && event.title.toLowerCase().includes(query)) ||
            (event.excerpt && event.excerpt.toLowerCase().includes(query)) ||
            (event.location && event.location.toLowerCase().includes(query));
        }
        
        return matchesType && matchesYear && matchesLocation && matchesTags && matchesSearch;
      })} />
    </div>
  {/if}
</PageContainer>
{/if} 