<script>
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import SEO from '$lib/components/seo/SEO.svelte';
  import YouTubeEmbed from '$lib/components/media/YouTubeEmbed.svelte';
  import SpotifyEmbed from '$lib/components/media/SpotifyEmbed.svelte';
  import PageContainer from '$lib/components/layout/PageContainer.svelte';
  import { marked } from 'marked';
  import DOMPurify from 'isomorphic-dompurify';
  
  export let data;
  const { event } = data;
  
  let visible = false;
  let parsedContent = '';
  
  onMount(() => {
    // Parse markdown content if it exists
    if (event && event.content) {
      try {
        // Check if content is HTML or Markdown
        if (event.content.trim().startsWith('<') && event.content.includes('</')) {
          // Content seems to be HTML, just sanitize it
          if (typeof DOMPurify !== 'undefined') {
            const sanitizeOptions = {
              ADD_TAGS: ['pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
              ADD_ATTR: ['class', 'language-*'],
              ALLOW_DATA_ATTR: true
            };
            parsedContent = DOMPurify.sanitize(event.content, sanitizeOptions);
          } else {
            parsedContent = event.content;
          }
        } else {
          // Content is markdown, parse it
          const rawHtml = marked.parse(event.content);
          
          // Sanitize the parsed HTML
          if (typeof DOMPurify !== 'undefined') {
            const sanitizeOptions = {
              ADD_TAGS: ['pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
              ADD_ATTR: ['class', 'language-*'],
              ALLOW_DATA_ATTR: true
            };
            parsedContent = DOMPurify.sanitize(rawHtml, sanitizeOptions);
          } else {
            parsedContent = rawHtml;
          }
        }
      } catch (error) {
        console.error('Error processing event content:', error);
        parsedContent = event.content; // Fallback to raw content
      }
    }
    
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
  <PageContainer>
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-4">Event Not Found</h1>
      <p class="mb-8">The event you're looking for could not be found.</p>
      <a href="/events" class="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
        Back to Events
      </a>
    </div>
  </PageContainer>
{:else if visible}
  <PageContainer>
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
      
      <!-- Event title -->
      <h1 class="text-4xl font-bold mb-6 text-gray-900 dark:text-white leading-tight" in:fly={{ y: 20, duration: 500, delay: 200 }}>
        {event.title}
      </h1>
      
      <!-- Event details row -->
      <div class="flex flex-wrap gap-y-4 gap-x-8 text-md text-gray-600 dark:text-gray-300" in:fly={{ y: 20, duration: 500, delay: 300 }}>
        {#if event.date}
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate(event.date)}</span>
          </div>
        {/if}
        
        {#if event.event}
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{event.event}</span>
          </div>
        {/if}
        
        {#if event.location}
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{event.location}</span>
          </div>
        {/if}
        
        {#if event.role}
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{event.role}</span>
          </div>
        {/if}
      </div>
    </div>
    
    <!-- Main content -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 mb-10" in:fly={{ y: 30, duration: 500, delay: 400 }}>
      <!-- Content based on type -->
      {#if event.content}
        <div class="prose dark:prose-invert max-w-none mb-10 text-gray-800 dark:text-gray-200">
          {@html parsedContent}
        </div>
      {:else if event.excerpt}
        <div class="prose dark:prose-invert max-w-none mb-10 text-gray-800 dark:text-gray-200">
          <p>{event.excerpt}</p>
        </div>
      {/if}
      
      <!-- Media section -->
      {#if event.mediaType === 'youtube' && event.mediaUrl}
        <div class="mt-8">
          <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Watch the Presentation</h2>
          <div class="aspect-video">
            <YouTubeEmbed url={event.mediaUrl} title={event.title} />
          </div>
        </div>
      {:else if event.mediaType === 'spotify' && event.mediaUrl}
        <div class="mt-8">
          <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Listen to the Podcast Episode</h2>
          <SpotifyEmbed url={event.mediaUrl} title={event.title} />
        </div>
      {/if}
      
      <!-- Tags -->
      {#if event.tags && event.tags.length > 0}
        <div class="mt-10">
          <h3 class="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Topics</h3>
          <div class="flex flex-wrap gap-2">
            {#each event.tags as tag}
              <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                {tag}
              </span>
            {/each}
          </div>
        </div>
      {/if}
    </div>
    
    <!-- CTA Section -->
    <div in:fly={{ y: 30, duration: 500, delay: 500 }}>
      {#if event.registrationUrl}
        <div class="mb-8 text-center">
          <a href={event.registrationUrl} target="_blank" rel="noopener noreferrer" 
             class="inline-block px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors">
            Register for this Event
          </a>
        </div>
      {/if}
      
      <div class="text-center">
        <a href="/events/{event.type}" class="inline-block mr-4 text-primary-600 dark:text-primary-400 hover:underline">
          ← Back to {typeLabels[event.type] || 'Events'}
        </a>
        <a href="/events" class="inline-block text-primary-600 dark:text-primary-400 hover:underline">
          View All Events
        </a>
      </div>
    </div>
  </PageContainer>
{/if} 