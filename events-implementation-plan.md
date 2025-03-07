# Events Section Implementation Plan

## Overview

This document outlines the strategy and implementation steps for transforming the current "Conferences" section into a broader "Events" section that encompasses three content types:

1. **Speaking** (conferences, talks, panels)  
2. **Organizing** (hackathons, workshops)  
3. **Media** (podcasts, interviews)  

The implementation will follow the existing content generation approach, with consistent data modeling and visual presentation across all content types, while adding support for embedded media where appropriate.

## 1. Content Structure & Data Model

### Unified Content Model

All event types will share a common base structure with type-specific extensions:

```typescript
// Base event interface
interface BaseEvent {
  title: string;
  date: string;
  location: string; // Virtual for online events
  event: string;    // Name of event/podcast/hackathon
  slug: string;     // URL-friendly identifier
  excerpt: string;  // Brief summary
  tags: string[];
  featured: boolean;
  type: "speaking" | "organizing" | "media"; // Field to distinguish types
  content: string;  // Markdown content
  html: string;     // Rendered HTML
}

// Extended interfaces for specific types
interface MediaEvent extends BaseEvent {
  mediaUrl?: string;  // URL for embedded content (podcast/video)
  mediaType?: "youtube" | "spotify" | "other";
  mediaDuration?: string; // Length of media content
  host?: string;  // For podcasts: who hosted the episode
}

interface OrganizingEvent extends BaseEvent {
  role: string;  // e.g., "Organizer", "Judge", "Mentor"
  participants?: number; // Number of participants
  mediaUrl?: string;  // For demo videos, highlight reels
  mediaType?: "youtube" | "other";
}
```

### Directory Structure

```
/src/content/
  /speaking/        # Was: /conferences/
    conference-1.md
    conference-2.md
  /organizing/      # New: For hackathons, workshops
    hackathon-1.md
    hackathon-2.md
  /media/           # New: For podcasts, interviews
    podcast-1.md
    podcast-2.md
```

### Markdown Frontmatter

Example for a podcast:
```markdown
---
title: "The Future of Retail AI"
date: "2024-05-15"
location: "Virtual"
event: "AI in Business Podcast"
slug: "future-of-retail-ai-podcast"
excerpt: "Fatih discusses the transformative impact of AI on retail operations and customer experience."
tags: ["AI", "Retail", "Machine Learning", "Customer Experience"]
featured: true
type: "media"
mediaUrl: "https://open.spotify.com/episode/123456789"
mediaType: "spotify"
mediaDuration: "45:30"
host: "Jane Smith"
---

# AI in Business Podcast – Virtual (2024)

## Episode: *The Future of Retail AI*

...content...
```

## 2. Migration & Content Generation

### Migration Script

Create a new script (`scripts/migrate-conferences.js`) to automate the migration of existing conference content:

```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define source and destination paths
const sourceDir = path.join(__dirname, '..', 'src/content/conferences');
const destDir = path.join(__dirname, '..', 'src/content/speaking');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Process all conference files
const files = fs.readdirSync(sourceDir);

for (const file of files) {
  if (!file.endsWith('.md')) continue;
  
  const sourcePath = path.join(sourceDir, file);
  const destPath = path.join(destDir, file);
  
  // Read file and parse frontmatter
  const content = fs.readFileSync(sourcePath, 'utf-8');
  const { data, content: markdownContent } = matter(content);
  
  // Add the type field
  data.type = 'speaking';
  
  // Recreate the file with updated frontmatter
  const updatedContent = matter.stringify(markdownContent, data);
  
  // Write to new location
  fs.writeFileSync(destPath, updatedContent);
  
  console.log(`Migrated: ${file}`);
}

console.log('Migration complete!');
```

### Update to `scripts/generate-content.js`

Update the content generation script to handle multiple source directories for events:

```javascript
// Update contentTypes array
const contentTypes = [
  // Existing content types...
  {
    type: 'events',
    sources: [
      { path: 'src/content/speaking', type: 'speaking' },
      { path: 'src/content/organizing', type: 'organizing' },
      { path: 'src/content/media', type: 'media' }
    ],
    output: 'src/lib/generated'
  }
];

// Add new processing function for multi-source content types
async function processMultiSourceContentType(contentType) {
  console.log(`Generating ${contentType.type}...`);
  
  const items = [];
  
  for (const source of contentType.sources) {
    const contentDir = path.join(__dirname, '..', source.path);
    
    try {
      await fs.promises.access(contentDir);
    } catch (error) {
      console.warn(`Content directory ${contentDir} does not exist. Skipping.`);
      continue;
    }
    
    // Read all files in the content directory
    const files = await fs.promises.readdir(contentDir);
    
    for (const file of files) {
      // Only process markdown files
      if (!file.endsWith('.md')) continue;
      
      try {
        // Read the file
        const filePath = path.join(contentDir, file);
        const fileContent = await fs.promises.readFile(filePath, 'utf-8');
        
        // Fix line endings
        const normalizedContent = fileContent.replace(/\r\n/g, '\n');
        
        // Process the content
        const processedContent = await processContent(normalizedContent);
        
        // Create a slug from the filename
        const slug = file.replace(/\.md$/, '');
        
        // Process data fields that might contain markdown
        const processedData = processDataFields(processedContent.frontmatter);
        
        // Add the item to the array, ensuring type is set
        items.push({
          slug,
          ...processedData,
          type: processedData.type || source.type, // Use specified type or fallback to source type
          content: processedContent.content,
          html: processedContent.html
        });
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
  }
  
  // Sort items by date if available
  items.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date) - new Date(a.date);
    }
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return 0;
  });
  
  // Write the items to a JSON file
  const outputFile = path.join(__dirname, '..', contentType.output, `${contentType.type}.json`);
  await fs.promises.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.promises.writeFile(outputFile, JSON.stringify(items, null, 2));
  
  console.log(`Successfully generated ${items.length} ${contentType.type} items`);
}
```

### Unified Content Access API

Create a new `src/lib/utils/events.js` file for accessing event data:

```javascript
import eventsData from '$lib/generated/events.json';

// Get all events, sorted by date
export function getAllEvents() {
  return eventsData.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Get events by type
export function getEventsByType(type) {
  return eventsData.filter(event => event.type === type);
}

// Get event by slug
export function getEventBySlug(slug) {
  return eventsData.find(event => event.slug === slug);
}

// Get filtered events
export function getFilteredEvents({
  type = null,
  year = null,
  featured = false,
  tags = [],
  location = null
} = {}) {
  let filteredEvents = eventsData;
  
  if (type) {
    filteredEvents = filteredEvents.filter(event => event.type === type);
  }
  
  if (year) {
    filteredEvents = filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear().toString() === year.toString();
    });
  }
  
  if (featured) {
    filteredEvents = filteredEvents.filter(event => event.featured);
  }
  
  if (tags && tags.length > 0) {
    filteredEvents = filteredEvents.filter(event => 
      tags.some(tag => event.tags && event.tags.includes(tag)));
  }
  
  if (location) {
    filteredEvents = filteredEvents.filter(event => 
      event.location && event.location.includes(location));
  }
  
  return filteredEvents;
}

// Get unique years from events
export function getEventYears() {
  const years = eventsData
    .map(event => {
      if (!event.date) return null;
      try {
        return new Date(event.date).getFullYear();
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean);
  
  return [...new Set(years)].sort((a, b) => b - a);
}

// Get unique tags from events
export function getEventTags() {
  const allTags = eventsData
    .flatMap(event => event.tags || []);
  
  return [...new Set(allTags)].sort();
}

// Get unique locations from events
export function getEventLocations() {
  const locations = eventsData
    .map(event => event.location)
    .filter(Boolean);
  
  return [...new Set(locations)].sort();
}
```

## 3. UI/UX Implementation

### Component Structure

1. **EventCard Component** (`src/lib/components/EventCard.svelte`): Unified card component for all event types
2. **Media Embedding Components**:
   - `src/lib/components/YouTubeEmbed.svelte`: For YouTube videos
   - `src/lib/components/SpotifyEmbed.svelte`: For Spotify podcasts

### EventCard Component

```svelte
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
      const module = await import('$lib/components/YouTubeEmbed.svelte');
      YouTubeEmbed = module.default;
    } else if (event.mediaType === 'spotify') {
      const module = await import('$lib/components/SpotifyEmbed.svelte');
      SpotifyEmbed = module.default;
    }
  });
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-xl dark:shadow-gray-900/30 overflow-hidden hover:shadow-xl transition-shadow duration-300">
  <div class="p-6">
    <!-- Type badge if showType is true -->
    {#if showType && event.type}
      <div class="mb-3">
        <span class="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full 
          {event.type === 'speaking' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 
           event.type === 'organizing' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
           'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'}">
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
      <div class="mb-6 rounded overflow-hidden">
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
      <div class="mb-4">
        <span class="font-semibold">Role:</span> {event.role}
      </div>
    {/if}
    
    <!-- Host (for media) -->
    {#if event.host}
      <div class="mb-4">
        <span class="font-semibold">Host:</span> {event.host}
      </div>
    {/if}
    
    <!-- Tags -->
    {#if event.tags && event.tags.length > 0}
      <div class="flex flex-wrap gap-2 mt-4">
        {#each event.tags as tag}
          <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full">
            {tag}
          </span>
        {/each}
      </div>
    {/if}
  </div>
</div>
```

### Media Embedding Components

#### YouTube Embed (`src/lib/components/YouTubeEmbed.svelte`)

```svelte
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

<div class="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700" bind:this={container}>
  {#if loaded && videoId}
    <iframe 
      src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1${showControls ? '' : '&controls=0'}`}
      title={title || "YouTube video"}
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen
      loading="lazy"
      class="w-full h-full rounded"
    ></iframe>
  {:else if videoId}
    <div class="w-full h-full flex items-center justify-center">
      <svg class="w-12 h-12 text-gray-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </div>
  {:else}
    <div class="w-full h-full flex items-center justify-center">
      <div class="text-center text-gray-500">Invalid YouTube URL</div>
    </div>
  {/if}
</div>
```

#### Spotify Embed (`src/lib/components/SpotifyEmbed.svelte`)

```svelte
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

<div class="h-[232px] bg-gray-200 dark:bg-gray-700 rounded" bind:this={container}>
  {#if loaded && embedUrl}
    <iframe 
      src={embedUrl}
      title={title || "Spotify podcast"}
      frameborder="0" 
      allowtransparency="true" 
      allow="encrypted-media"
      loading="lazy"
      class="w-full h-full rounded"
    ></iframe>
  {:else if embedUrl}
    <div class="w-full h-full flex items-center justify-center">
      <svg class="w-12 h-12 text-gray-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path>
      </svg>
    </div>
  {:else}
    <div class="w-full h-full flex items-center justify-center">
      <div class="text-center text-gray-500">Invalid Spotify URL</div>
    </div>
  {/if}
</div>
```

### Main Events Page (`/src/routes/events/+page.svelte`)

The main events page will include:
1. An overview section
2. Type filtering tabs (Speaking, Organizing, Media)
3. Additional filters (year, tags, location)
4. Event cards displayed by year

### Route Structure

Implementation will follow this routing structure for better SEO and user experience:

```
/events                       # Main events page with all types 
/events/speaking              # Speaking events page 
/events/organizing            # Organizing events page
/events/media                 # Media events page
/events/[type]/[slug]         # Individual event page
```

## 4. SEO Optimization

### URL Structure

The URL structure `/events/[type]/[slug]` provides several SEO benefits:
- Clearly communicates content hierarchy
- Includes relevant keywords in URL path
- Groups related content for better context

### Structured Data Implementation

Each event type will use appropriate schema.org structured data:

1. **Speaking Events**: Use `Event` schema
   ```javascript
   {
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
   }
   ```

2. **Organizing Events**: Use `Event` schema with organizer role
   ```javascript
   {
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
   }
   ```

3. **Media Events**: Use `PodcastEpisode` or `VideoObject` schema
   ```javascript
   // For podcasts
   {
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
   }
   
   // For videos
   {
     "@context": "https://schema.org",
     "@type": "VideoObject",
     "name": event.title,
     "description": event.excerpt,
     "uploadDate": event.date,
     "duration": event.mediaDuration,
     "contentUrl": event.mediaUrl,
     "thumbnailUrl": thumbnailUrl // If available
   }
   ```

### Sitemap Updates

Update the sitemap generation to include all event types and URLs:

```javascript
// In scripts/generate-sitemap.js
// Add events to sitemap
const events = JSON.parse(fs.readFileSync('./src/lib/generated/events.json', 'utf8'));

events.forEach(event => {
  const eventUrl = `${baseUrl}/events/${event.type}/${event.slug}`;
  
  // Add to sitemap entries
  sitemapEntries.push({
    url: eventUrl,
    lastmod: new Date().toISOString().split('T')[0],
    priority: 0.7
  });
});

// Add event type index pages
['speaking', 'organizing', 'media'].forEach(type => {
  sitemapEntries.push({
    url: `${baseUrl}/events/${type}`,
    lastmod: new Date().toISOString().split('T')[0],
    priority: 0.8
  });
});

// Add main events page
sitemapEntries.push({
  url: `${baseUrl}/events`,
  lastmod: new Date().toISOString().split('T')[0],
  priority: 0.9
});
```

## 5. Implementation Timeline

| Phase | Tasks | Timeline | Dependencies |
|------|----------|--------------|------------|
| **Phase 1: Foundation** | 1. Update data model and directory structure<br>2. Create migration script<br>3. Update content generation script<br>4. Create unified content access API | Days 1-2 | None |
| **Phase 2: Components and UI** | 5. Create EventCard component<br>6. Create media embedding components<br>7. Implement main events page with filtering<br>8. Implement event type pages | Days 3-4 | Phase 1 |
| **Phase 3: Detail Pages and Routing** | 9. Implement individual event detail pages<br>10. Set up routing structure<br>11. Add navigation updates | Days 5-6 | Phase 2 |
| **Phase 4: Search and SEO** | 12. Update search functionality<br>13. Implement SEO optimizations<br>14. Add structured data<br>15. Update sitemap generation | Days 7-8 | Phase 3 |
| **Phase 5: Testing and Refinement** | 16. Test all functionality<br>17. Performance optimization<br>18. Final refinements and bug fixes | Days 9-10 | Phase 4 |

## 6. Key Implementation Considerations

1. **Performance**
   - Use lazy loading for media embeds to prevent performance issues
   - Implement proper caching strategies for generated content
   - Optimize images and media for fast loading

2. **SEO**
   - Implement comprehensive structured data for all event types
   - Ensure proper meta tags for social sharing
   - Create canonical URLs to prevent duplicate content issues

3. **Accessibility**
   - Ensure all components, especially media embeds, are fully accessible
   - Add proper ARIA attributes and keyboard navigation
   - Implement proper text alternatives for media content

4. **Mobile Responsiveness**
   - Design all components to adapt gracefully to different screen sizes
   - Implement special handling for media embeds on mobile devices
   - Test thoroughly across device sizes

5. **Filter State Management**
   - Use URL search parameters to maintain filter state
   - Implement shareable filtered views
   - Ensure filter state persists during navigation

6. **Dark and Light Mode Support**
   - Ensure consistent appearance across both dark and light modes
   - Implement smooth transitions between modes
   - Create specific styles for interactive elements in each mode
   - Test with accessibility tools to ensure sufficient contrast

## 7. Dark and Light Mode Architecture

### Design Principles

1. **Consistent Visual Hierarchy**
   - Maintain the same visual hierarchy in both modes
   - Ensure content readability with appropriate contrast
   - Keep interactive elements easily identifiable in both modes

2. **Color Semantics**
   - Preserve the meaning of colors across modes (e.g., success, error, warning)
   - Adjust brightness and saturation rather than changing hues entirely
   - Ensure status indicators remain clear in both modes

3. **Transition Experience**
   - Implement smooth transitions between modes
   - Avoid jarring changes in layout or element size
   - Ensure animations and transitions work well in both modes

### Implementation Strategy

1. **CSS Architecture**
   - Use Tailwind's dark mode utilities with the `dark:` prefix
   - Consider CSS custom properties for theme-specific colors
   - Create consistent color pairings for light and dark modes

2. **Component-Level Requirements**
   - Card components need dark backgrounds with appropriate shadows
   - Form elements require special focus states in dark mode
   - Media embeds need appropriate loading states in both modes
   - Interactive elements (buttons, links) need clear hover/focus states

3. **Specific Improvements**
   - Add explicit dark mode styles for decorative elements:
     ```html
     <div class="bg-primary-600/10 dark:bg-primary-400/5 rounded-full blur-3xl"></div>
     ```
   - Ensure proper borders for separation in dark mode:
     ```html
     <div class="border border-gray-200 dark:border-gray-700"></div>
     ```
   - Enhance interactive states:
     ```html
     <button class="hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"></button>
     ```

4. **Testing Strategy**
   - Test with system-level dark mode preferences
   - Verify contrast ratios meet WCAG standards in both modes
   - Create visual regression tests for both modes
   - Test with keyboard navigation in both modes

## 8. Static Site Generation Compatibility

This section outlines the considerations and modifications required to ensure the Events section is fully compatible with static site generation for deployment on Kinsta or similar static hosting services.

### Static Architecture Overview

The Events section needs to be fully pre-rendered at build time, with no server-side runtime components required after deployment. Key requirements include:

1. **Pre-rendered Pages**: All event pages must be generated at build time
2. **Client-side Functionality**: All interactive features (search, filtering) must work without a server
3. **Direct Data Access**: Content must be accessible without API endpoints

### Implementation Changes

The following changes have been made to ensure compatibility with static site generation:

#### 1. Replacing API Endpoints with Direct Imports

The original implementation used an API endpoint (`/api/events`) which would not work in a fully static deployment. The following changes address this:

- Removed dependency on `/api/events` endpoint
- Modified server load functions to use direct imports from utility functions
- Updated `src/lib/utils/events.js` to work with imported data only

#### 2. Server Load Function Updates

All server load functions have been updated to use direct data imports:

```javascript
// src/routes/events/[type]/[slug]/+page.server.js
import { getAllEvents } from '$lib/utils/events.js';

export async function load({ params }) {
  // Get events directly from utility function
  const events = getAllEvents().filter(event => event.type === params.type);
  const event = events.find(e => e.slug === params.slug);
  // ...
}
```

#### 3. SvelteKit Configuration

The SvelteKit configuration (`svelte.config.js`) is already properly set up for static generation:

```javascript
adapter: adapter({
  pages: 'build',
  assets: 'build',
  fallback: 'index.html',
  precompress: true,
  strict: true
}),
prerender: {
  crawl: true,
  entries: ['*', '/sitemap.xml', '/robots.txt'],
  handleHttpError: 'warn'
}
```

This configuration ensures:
- All pages are prerendered at build time
- The static adapter is used for deployment
- Error handling is properly configured

#### 4. Client-side Search and Filtering

The search functionality has been implemented with static site generation in mind:

- All data filtering happens client-side
- URL parameters are used for state management
- No server-side search endpoints are required

### Build and Deployment Recommendations

#### Build Process

1. **Content Generation**: Run content generation scripts before building
   ```bash
   node scripts/generate-content.js
   ```

2. **Build Command**: Use the standard SvelteKit build command
   ```bash
   npm run build
   ```

3. **Verify Build**: Check the `build` directory for completeness
   ```bash
   npx serve build
   ```

4. **Generated Data Files**: Ensure all JSON data files are included in the build

#### Deployment to Kinsta

1. **Files to Upload**: The entire `build` directory should be uploaded to Kinsta
2. **Custom Domain**: Configure the custom domain in Kinsta's dashboard
3. **Caching Headers**: Recommended cache settings for Kinsta:
   - HTML files: no cache or short cache (1 hour)
   - Assets (JS/CSS/images): long cache (1 week or more)
   - JSON data files: medium cache (1 day)

4. **Redirect Rules**: If migrating from the previous conferences setup, add 301 redirects:
   ```
   /conferences/* → /events/speaking/*
   ```

### Testing Recommendations

Before deploying to production, verify static site compatibility with these tests:

1. **Local Static Test**: Build and serve locally without a development server
   ```bash
   npm run build && npx serve build
   ```

2. **Functionality Check**: Verify these features work in the static build:
   - Navigation between event types
   - Individual event detail pages
   - Search and filtering
   - Dark/light mode switching

3. **Link Validation**: Check all internal links with a tool like `broken-link-checker`
   ```bash
   npx broken-link-checker http://localhost:3000
   ```

4. **Performance Testing**: Run Lighthouse tests on the static build

This approach ensures the Events section will function correctly in a purely static environment while maintaining all the interactive features and SEO benefits implemented in previous phases. 

## 9. Future Enhancements

1. **Advanced Search Integration**
   - Integrate event content with site-wide search
   - Add faceted search capabilities for events
   - Implement search result highlighting for events

2. **Calendar View**
   - Add a calendar view for upcoming events
   - Implement iCal/Google Calendar export functionality
   - Add event reminders/notifications

3. **Related Content**
   - Implement "related events" recommendations
   - Cross-link with blog posts and other content
   - Create topical clusters based on tags

4. **Analytics Integration**
   - Track event page metrics
   - Implement enhanced engagement tracking
   - Create event-specific analytics dashboard 