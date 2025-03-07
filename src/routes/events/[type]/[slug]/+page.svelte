<script>
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import SEO from '$lib/components/SEO.svelte';
  import YouTubeEmbed from '$lib/components/YouTubeEmbed.svelte';
  import SpotifyEmbed from '$lib/components/SpotifyEmbed.svelte';
  
  export let data;
  const { event } = data;
  
  let visible = false;
  
  onMount(() => {
    visible = true;
  });
  
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
  
  // Type badge colors
  const typeColors = {
    'speaking': {
      bg: 'bg-blue-100 dark:bg-blue-900/60',
      text: 'text-blue-800 dark:text-blue-200',
      border: 'border-blue-200 dark:border-blue-700'
    },
    'organizing': {
      bg: 'bg-green-100 dark:bg-green-900/60',
      text: 'text-green-800 dark:text-green-200',
      border: 'border-green-200 dark:border-green-700'
    },
    'media': {
      bg: 'bg-purple-100 dark:bg-purple-900/60',
      text: 'text-purple-800 dark:text-purple-200',
      border: 'border-purple-200 dark:border-purple-700'
    }
  }
  
  // Type label mappings
  const typeLabels = {
    'speaking': 'Speaking',
    'organizing': 'Organizing',
    'media': 'Media Appearance'
  };
  
  // Generate structured data for SEO
  let structuredData;
  
  if (event) {
    if (event.type === 'speaking') {
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": event.title,
        "description": event.excerpt,
        "startDate": event.date,
        "location": {
          "@type": "Place",
          "name": event.location
        },
        "performer": {
          "@type": "Person",
          "name": "Fatih Nayebi"
        }
      };
    } else if (event.type === 'organizing') {
      structuredData = {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": event.title,
        "description": event.excerpt,
        "startDate": event.date,
        "location": {
          "@type": "Place",
          "name": event.location
        },
        "organizer": {
          "@type": "Person",
          "name": "Fatih Nayebi",
          "roleName": event.role
        }
      };
    } else if (event.type === 'media') {
      if (event.mediaType === 'spotify') {
        structuredData = {
          "@context": "https://schema.org",
          "@type": "PodcastEpisode",
          "name": event.title,
          "datePublished": event.date,
          "description": event.excerpt,
          "timeRequired": event.mediaDuration,
          "associatedMedia": {
            "@type": "MediaObject",
            "contentUrl": event.mediaUrl
          },
          "partOfSeries": {
            "@type": "PodcastSeries",
            "name": event.event
          }
        };
      } else if (event.mediaType === 'youtube') {
        structuredData = {
          "@context": "https://schema.org",
          "@type": "VideoObject",
          "name": event.title,
          "description": event.excerpt,
          "uploadDate": event.date,
          "duration": event.mediaDuration,
          "contentUrl": event.mediaUrl
        };
      }
    }
  }
</script>

<SEO 
  title="{event ? `${event.title} | ${event.event}` : 'Event'} | Fatih Nayebi"
  description={event?.excerpt || "Event details for Fatih Nayebi's professional engagement."}
  keywords={event?.tags?.join(', ') || "events, professional"}
  canonical={event ? `https://fatihnayebi.com/events/${event.type}/${event.slug}` : undefined}
  structuredData={structuredData}
  openGraph={{
    title: event ? `${event.title} | ${event.event}` : 'Professional Event',
    description: event?.excerpt || "Event details for Fatih Nayebi's professional engagement.",
    url: `https://fatihnayebi.com/events/${event?.type}/${event?.slug}`,
    type: 'article',
    article: {
      publishedTime: event?.date,
      tags: event?.tags
    }
  }}
  twitter={{
    card: 'summary_large_image',
    title: event ? event.title : 'Professional Event',
    description: event?.excerpt || "Event details for Fatih Nayebi's professional engagement."
  }}
/>

{#if !event}
  <div class="container mx-auto px-4 py-16 text-center">
    <h1 class="text-3xl font-bold mb-4">Event Not Found</h1>
    <p class="mb-8">The event you're looking for could not be found.</p>
    <a href="/events" class="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
      Back to Events
    </a>
  </div>
{:else if visible}
  <div class="container mx-auto px-4 py-12 lg:py-16 relative" in:fade={{ duration: 300 }}>
    <!-- Background decorative elements -->
    <div class="absolute top-0 right-10 -z-10 opacity-10 w-64 h-64 bg-primary-600/20 dark:bg-primary-400/5 rounded-full blur-3xl"></div>
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
        <a href="/events/{event.type}" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors capitalize">
          {typeLabels[event.type] || event.type}
        </a>
        <svg class="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <span class="text-gray-800 dark:text-gray-300 truncate max-w-[180px] sm:max-w-none">{event.title}</span>
      </div>
    </div>
    
    <!-- Event Header -->
    <div class="mb-12 md:mb-16">
      <!-- Type badge -->
      <div class="mb-4" in:fly={{ y: 30, duration: 500, delay: 100 }}>
        <span class="inline-flex items-center px-4 py-1.5 text-md font-medium rounded-full 
          {typeColors[event.type]?.bg || 'bg-gray-100 dark:bg-gray-800'} 
          {typeColors[event.type]?.text || 'text-gray-800 dark:text-gray-200'} 
          border {typeColors[event.type]?.border || 'border-gray-200 dark:border-gray-700'}">
          {typeLabels[event.type] || event.type}
        </span>
      </div>
      
      <!-- Event Title -->
      <h1 class="text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white" in:fly={{ y: 30, duration: 500, delay: 200 }}>
        {event.title}
      </h1>
      
      <!-- Event Name -->
      <div class="text-2xl lg:text-3xl text-primary-600 dark:text-primary-400 mb-6" in:fly={{ y: 30, duration: 500, delay: 300 }}>
        {event.event}
      </div>
      
      <!-- Date and Location -->
      <div class="flex flex-wrap items-center gap-y-2 gap-x-8 text-lg mb-8" in:fly={{ y: 30, duration: 500, delay: 400 }}>
        {#if event.date}
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span>{formatDate(event.date)}</span>
          </div>
        {/if}
        
        {#if event.location}
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>{event.location}</span>
          </div>
        {/if}
        
        {#if event.mediaDuration}
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 mr-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>{event.mediaDuration}</span>
          </div>
        {/if}
      </div>
      
      <!-- Tags -->
      {#if event.tags && event.tags.length > 0}
        <div class="flex flex-wrap gap-2 mb-8" in:fly={{ y: 30, duration: 500, delay: 500 }}>
          {#each event.tags as tag}
            <span class="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm rounded-full border border-gray-200 dark:border-gray-700">
              {tag}
            </span>
          {/each}
        </div>
      {/if}
    </div>
    
    <!-- Media Embed for podcast/video -->
    {#if event.mediaUrl && event.mediaType}
      <div class="mb-12 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-lg dark:shadow-xl dark:shadow-gray-900/10" in:fade={{ duration: 800, delay: 600 }}>
        {#if event.mediaType === 'youtube'}
          <div class="aspect-w-16 aspect-h-9">
            <YouTubeEmbed url={event.mediaUrl} title={event.title} />
          </div>
        {:else if event.mediaType === 'spotify'}
          <div class="p-4 bg-gray-50 dark:bg-gray-800/50">
            <SpotifyEmbed url={event.mediaUrl} title={event.title} />
          </div>
        {/if}
      </div>
    {/if}
    
    <!-- Additional Information Panels -->
    <div class="grid md:grid-cols-3 gap-8 mb-12">
      <!-- Role (for organizing) -->
      {#if event.role}
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-xl dark:shadow-gray-900/10 border border-gray-200 dark:border-gray-700" in:fade={{ duration: 500, delay: 700 }}>
          <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Role</h3>
          <p class="text-gray-700 dark:text-gray-300">{event.role}</p>
        </div>
      {/if}
      
      <!-- Host (for media) -->
      {#if event.host}
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-xl dark:shadow-gray-900/10 border border-gray-200 dark:border-gray-700" in:fade={{ duration: 500, delay: 700 }}>
          <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Host</h3>
          <p class="text-gray-700 dark:text-gray-300">{event.host}</p>
        </div>
      {/if}
      
      <!-- Additional slots for future extensions -->
      {#if event.participants}
        <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md dark:shadow-xl dark:shadow-gray-900/10 border border-gray-200 dark:border-gray-700" in:fade={{ duration: 500, delay: 700 }}>
          <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Participants</h3>
          <p class="text-gray-700 dark:text-gray-300">{event.participants}</p>
        </div>
      {/if}
    </div>
    
    <!-- Main Content -->
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md dark:shadow-xl dark:shadow-gray-900/10 mb-12 border border-gray-200 dark:border-gray-700" in:fade={{ duration: 500, delay: 800 }}>
      <div class="prose dark:prose-invert max-w-none">
        {#if event.html}
          {@html event.html}
        {:else if event.content}
          <p class="text-lg text-gray-700 dark:text-gray-300">{event.content}</p>
        {:else}
          <p class="text-lg text-gray-700 dark:text-gray-300">{event.excerpt}</p>
        {/if}
      </div>
    </div>
    
    <!-- Navigation and Related -->
    <div class="flex flex-col md:flex-row gap-8 mb-8" in:fade={{ duration: 500, delay: 900 }}>
      <!-- Back to all events -->
      <a 
        href="/events" 
        class="flex-1 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-xl dark:shadow-gray-900/10 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow group flex items-center justify-between"
      >
        <div class="flex items-center">
          <svg class="w-6 h-6 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span class="font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">All Events</span>
        </div>
      </a>
      
      <!-- Browse by type -->
      <a 
        href="/events/{event.type}" 
        class="flex-1 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-xl dark:shadow-gray-900/10 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow group flex items-center justify-between"
      >
        <div class="flex items-center">
          <svg class="w-6 h-6 mr-3 text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
          </svg>
          <span class="font-medium group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">More {typeLabels[event.type] || event.type} Events</span>
        </div>
      </a>
    </div>
  </div>
{/if} 