# Engagements Section Implementation Plan

## Overview

This document outlines the strategy and implementation steps for transforming the current "Conferences" section into a broader "Engagements" section that encompasses three content types:

1. **Speaking** (conferences, talks, panels)  
2. **Organizing** (hackathons, workshops)  
3. **Media** (podcasts, interviews)  

The implementation will follow the existing content generation approach, with consistent data modeling and visual presentation across all content types, while adding support for embedded media where appropriate.

## 1. Content Structure & Data Model

### Unified Content Model

All engagement types will share a common base structure with type-specific extensions:

```typescript
interface BaseEngagement {
  title: string;
  date: string;
  location: string; // Virtual for online events
  event: string;    // Name of event/podcast/hackathon
  slug: string;     // URL-friendly identifier
  excerpt: string;  // Brief summary
  tags: string[];
  featured: boolean;
  type: "speaking" | "organizing" | "media"; // New field to distinguish types
  content: string;  // Markdown content
  html: string;     // Rendered HTML
}

interface MediaEngagement extends BaseEngagement {
  mediaUrl?: string;  // URL for embedded content (podcast/video)
  mediaType?: "audio" | "video";
  mediaDuration?: string; // Length of media content
  host?: string;  // For podcasts: who hosted the episode
}

interface OrganizingEngagement extends BaseEngagement {
  role: string;  // e.g., "Organizer", "Judge", "Mentor"
  participants?: number; // Number of participants
  mediaUrl?: string;  // For demo videos, highlight reels
  mediaType?: "audio" | "video";
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
mediaUrl: "https://example.com/podcast/episode-123"
mediaType: "audio"
mediaDuration: "45:30"
host: "Jane Smith"
---

# AI in Business Podcast – Virtual (2024)

## Episode: *The Future of Retail AI*

...content...
```

## 2. Content Generation Updates

### Update to `scripts/generate-content.js`

1. Add new content types to the script:
```javascript
const contentTypes = [
  // Existing content types...
  {
    type: 'speaking',
    source: 'src/content/speaking',
    output: 'src/lib/generated'
  },
  {
    type: 'organizing',
    source: 'src/content/organizing',
    output: 'src/lib/generated'
  },
  {
    type: 'media',
    source: 'src/content/media',
    output: 'src/lib/generated'
  }
];
```

2. Modify the processing logic to handle the additional fields for media and organizing events.

### Update to `src/lib/utils/markdown.js`

Add utility functions for the new content types:

```javascript
// Import the new content types
import speakingData from '$lib/generated/speaking.json';
import organizingData from '$lib/generated/organizing.json';
import mediaData from '$lib/generated/media.json';

// Get all engagements (combined and sorted by date)
export function getAllEngagements() {
  return [...speakingData, ...organizingData, ...mediaData]
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Get engagements by type
export function getEngagementsByType(type) {
  switch(type) {
    case 'speaking':
      return speakingData;
    case 'organizing':
      return organizingData;
    case 'media':
      return mediaData;
    default:
      return [];
  }
}

// Get engagement by slug
export function getEngagementBySlug(slug) {
  return getAllEngagements().find(item => item.slug === slug);
}

// Filter engagements by criteria
export function getFilteredEngagements({ 
  type = null, 
  year = null, 
  featured = false,
  tags = [] 
} = {}) {
  let filteredEngagements = getAllEngagements();
  
  if (type) {
    filteredEngagements = filteredEngagements.filter(item => item.type === type);
  }
  
  if (year) {
    filteredEngagements = filteredEngagements.filter(item => 
      new Date(item.date).getFullYear().toString() === year.toString());
  }
  
  if (featured) {
    filteredEngagements = filteredEngagements.filter(item => item.featured);
  }
  
  if (tags && tags.length > 0) {
    filteredEngagements = filteredEngagements.filter(item => 
      tags.some(tag => item.tags.includes(tag)));
  }
  
  return filteredEngagements;
}
```

## 3. UI/UX Implementation

### Create Engagement Card Component

Create a unified card component that can display any engagement type in `/src/lib/components/EngagementCard.svelte`:

```svelte
<script>
  export let engagement;
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
</script>

<div class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-xl dark:shadow-gray-900/30 overflow-hidden hover:shadow-xl transition-shadow duration-300">
  <div class="p-6">
    <!-- Type badge if showType is true -->
    {#if showType && engagement.type}
      <div class="mb-3">
        <span class="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full 
          {engagement.type === 'speaking' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 
           engagement.type === 'organizing' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
           'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'}">
          <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <!-- Icon based on type -->
            {#if engagement.type === 'speaking'}
              <path d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"></path>
            {:else if engagement.type === 'organizing'}
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
            {:else}
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"></path>
            {/if}
          </svg>
          {typeLabels[engagement.type] || engagement.type}
        </span>
      </div>
    {/if}

    <!-- Event name and title -->
    <div class="mb-4">
      <h3 class="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
        {engagement.event}
      </h3>
      {#if engagement.title}
        <div class="text-xl mb-3 text-primary-600 dark:text-primary-400">
          {engagement.title}
        </div>
      {/if}
    </div>
    
    <!-- Date and Location -->
    <div class="flex flex-col sm:flex-row sm:gap-8 mb-4">
      <!-- Date -->
      {#if engagement.date}
        <div class="flex items-center mb-2 sm:mb-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          <span>{formatDate(engagement.date)}</span>
        </div>
      {/if}
      
      <!-- Location -->
      {#if engagement.location}
        <div class="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span>{engagement.location}</span>
        </div>
      {/if}
      
      <!-- Media Duration (for podcast/video) -->
      {#if engagement.mediaDuration}
        <div class="flex items-center mt-2 sm:mt-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span>{engagement.mediaDuration}</span>
        </div>
      {/if}
    </div>
    
    <!-- Media Embed (for podcast/video) -->
    {#if engagement.mediaUrl && engagement.mediaType}
      <div class="mb-6 rounded overflow-hidden">
        {#if engagement.mediaType === 'video'}
          <div class="aspect-w-16 aspect-h-9">
            <iframe 
              src={engagement.mediaUrl} 
              title={engagement.title} 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
              class="w-full"
            ></iframe>
          </div>
        {:else if engagement.mediaType === 'audio'}
          <audio 
            controls 
            class="w-full"
            src={engagement.mediaUrl}
          >
            Your browser does not support the audio element.
          </audio>
        {/if}
      </div>
    {/if}
    
    <!-- Excerpt -->
    <div class="prose dark:prose-invert max-w-none mb-4">
      <p class="text-gray-700 dark:text-gray-300">
        {#if engagement.excerpt && engagement.excerpt.length > 0}
          {engagement.excerpt}
        {:else if engagement.content && engagement.content.length > 0}
          {engagement.content.substring(0, 150)}...
        {:else}
          Details coming soon...
        {/if}
      </p>
    </div>
    
    <!-- Role (for organizing) -->
    {#if engagement.role}
      <div class="mb-4">
        <span class="font-semibold">Role:</span> {engagement.role}
      </div>
    {/if}
    
    <!-- Host (for media) -->
    {#if engagement.host}
      <div class="mb-4">
        <span class="font-semibold">Host:</span> {engagement.host}
      </div>
    {/if}
    
    <!-- Tags -->
    {#if engagement.tags && engagement.tags.length > 0}
      <div class="flex flex-wrap gap-2 mt-4">
        {#each engagement.tags as tag}
          <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-full">
            {tag}
          </span>
        {/each}
      </div>
    {/if}
  </div>
</div>
```

### Main Engagements Page

Create the main Engagements page in `/src/routes/engagements/+page.svelte`:

```svelte
<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import AnimateInView from '$lib/AnimateInView.svelte';
  import SEO from '$lib/components/SEO.svelte';
  import EngagementCard from '$lib/components/EngagementCard.svelte';
  
  export let data;
  const { allEngagements, years } = data;
  
  let selectedType = 'all';
  let filteredEngagements = {};
  let visible = false;
  
  // Filter function that updates filteredEngagements when selectedType changes
  function filterEngagements() {
    filteredEngagements = {};
    
    // Create an array of engagements filtered by selected type
    const filtered = selectedType === 'all' 
      ? allEngagements 
      : allEngagements.filter(engagement => engagement.type === selectedType);
    
    // Group by year
    years.forEach(year => {
      const forYear = filtered.filter(item => {
        const itemYear = new Date(item.date).getFullYear();
        return itemYear.toString() === year.toString();
      });
      
      if (forYear.length > 0) {
        filteredEngagements[year] = forYear;
      }
    });
  }
  
  onMount(() => {
    visible = true;
    filterEngagements(); // Initial filtering
  });
  
  // Watch for changes in selectedType
  $: if (visible && selectedType) {
    filterEngagements();
  }
</script>

<SEO 
  title="Professional Engagements | Fatih Nayebi"
  description="Conferences, hackathons, podcasts, and other professional engagements by Fatih Nayebi, focusing on AI, retail technology, and data science."
  keywords="speaking engagements, conferences, hackathons, podcasts, AI, retail technology, Fatih Nayebi"
/>

{#if visible}
<div in:fade={{ duration: 800 }} class="py-12 container mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
  <!-- Background decorative elements -->
  <div class="absolute top-20 right-10 opacity-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
  <div class="absolute bottom-40 left-10 opacity-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
  
  <!-- Page header -->
  <h1 class="text-5xl font-bold mb-4 text-center text-primary dark:text-blue-400" in:fly={{ y: -30, duration: 800, delay: 300 }}>Professional Engagements</h1>
  <p class="text-lg text-center mb-8 max-w-3xl mx-auto text-gray-700 dark:text-gray-300" in:fly={{ y: 30, duration: 800, delay: 500 }}>
    Explore my professional activities including conference talks, hackathons I've organized, and podcast appearances where I discuss artificial intelligence, retail technology, and data science.
  </p>

  <!-- Call to action box -->
  <AnimateInView type="fade" delay={700}>
    <div class="mb-16 bg-gradient-to-r from-primary-600/90 to-indigo-600/90 p-8 rounded-lg shadow-xl border-2 border-primary-300 dark:border-primary-700 text-gray-800 dark:text-white relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      
      <h3 class="text-2xl font-bold mb-4 relative z-10">Interested in having me speak at your event?</h3>
      <p class="mb-6 text-lg max-w-2xl relative z-10">
        I'm available for speaking engagements, podcast appearances, and hackathon judging/mentoring on AI, machine learning, retail technology, 
        and data science. Please get in touch via the contact page to discuss opportunities.
      </p>
      <a href="/contact" class="inline-block px-8 py-4 bg-white text-primary-700 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-md relative z-10">
        Contact Me
      </a>
    </div>
  </AnimateInView>

  <!-- Filtering tabs -->
  <div class="flex flex-wrap justify-center mb-10 sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-4 rounded-lg shadow">
    <button 
      class="px-6 py-2 mx-2 mb-2 rounded-full {selectedType === 'all' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'} transition-colors"
      on:click={() => selectedType = 'all'}
    >
      All
    </button>
    <button 
      class="px-6 py-2 mx-2 mb-2 rounded-full {selectedType === 'speaking' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'} transition-colors"
      on:click={() => selectedType = 'speaking'}
    >
      Speaking
    </button>
    <button 
      class="px-6 py-2 mx-2 mb-2 rounded-full {selectedType === 'organizing' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'} transition-colors"
      on:click={() => selectedType = 'organizing'}
    >
      Organizing
    </button>
    <button 
      class="px-6 py-2 mx-2 mb-2 rounded-full {selectedType === 'media' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700'} transition-colors"
      on:click={() => selectedType = 'media'}
    >
      Media
    </button>
  </div>

  <!-- Display engagements by year -->
  {#if Object.keys(filteredEngagements).length > 0}
    {#each Object.keys(filteredEngagements).sort((a, b) => b - a) as year}
      <AnimateInView type="fade" delay={300}>
        <div class="mb-20">
          <h2 class="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">{year} Engagements</h2>
          
          <div class="grid gap-8">
            {#each filteredEngagements[year] as engagement, i}
              <EngagementCard {engagement} />
            {/each}
          </div>
        </div>
      </AnimateInView>
    {/each}
  {:else}
    <AnimateInView type="fade" delay={500}>
      <div class="mb-8 text-center py-12">
        <h2 class="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">No Engagements Found</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-8">
          No engagements matching the selected filter are available.
        </p>
      </div>
    </AnimateInView>
  {/if}
</div>
{/if}
```

### Create Page Data Loading Script

Create `/src/routes/engagements/+page.js`:

```javascript
import { getAllEngagements } from '$lib/utils/markdown';

// Enable prerendering
export const prerender = true;

/** @type {import('./$types').PageLoad} */
export async function load() {
  // Get all engagements
  const allEngagements = getAllEngagements();
  
  // Extract unique years
  const years = [...new Set(allEngagements.map(item => {
    const date = new Date(item.date);
    return date.getFullYear();
  }))].sort((a, b) => b - a); // Sort years in descending order
  
  // Return serializable data
  return {
    allEngagements,
    years
  };
}
```

### Update Navigation

Update `src/lib/Navbar.svelte` and other navigation components to change "Conferences" to "Engagements".

## 4. Content Migration

### Migrate Existing Conference Content

1. Create the new content directories:
```bash
mkdir -p src/content/speaking
mkdir -p src/content/organizing
mkdir -p src/content/media
```

2. Move existing conference files:
```bash
# Copy existing conference files to speaking directory
cp src/content/conferences/* src/content/speaking/
```

3. Update frontmatter in each file to add the `type` field:
```bash
# Add type: "speaking" to each file's frontmatter
```

### Create Sample Hackathon and Podcast Content

Create at least one sample for each new content type following the frontmatter structure defined above.

## 5. SEO Optimization

### URL Structure

- Keep URL structure simple and descriptive
- Main section: `/engagements/`
- Individual items can be accessed at:
  - `/engagements/speaking/[slug]`
  - `/engagements/organizing/[slug]`
  - `/engagements/media/[slug]`

### Metadata and Structured Data

Add appropriate schema.org structured data to each engagement type:
- Speaking: Use `Event` schema
- Organizing: Use `Event` schema
- Media: Use `PodcastEpisode` schema

### Internal Linking Strategy

- Ensure related engagements are linked to each other
- Cross-link with relevant blog posts
- Add links from homepage to featured engagements

## 6. Implementation Timeline

| Task | Timeline | Dependencies |
|------|----------|--------------|
| 1. Update Data Model & Directory Structure | Day 1 | None |
| 2. Update Content Generation Script | Day 1 | Task 1 |
| 3. Create EngagementCard Component | Day 1-2 | None |
| 4. Create Main Engagements Page | Day 2 | Task 3 |
| 5. Migrate Existing Content | Day 2 | Tasks 1-2 |
| 6. Create Sample Content | Day 2-3 | Task 5 |
| 7. Update Navigation | Day 3 | Task 4 |
| 8. SEO Optimization | Day 3 | Tasks 4-6 |
| 9. Testing & Refinement | Day 3-4 | All previous tasks |
| 10. Deployment | Day 4 | All previous tasks |

## 7. Testing Plan

1. **Content Display Testing**
   - Verify all engagement types display correctly
   - Test filtering functionality
   - Check responsive design on different screen sizes

2. **Navigation Testing**
   - Ensure navigation updates work correctly
   - Test tab/filter functionality

3. **Media Embed Testing**
   - Verify audio and video embeds function correctly
   - Test performance impact of embedded media

4. **SEO Testing**
   - Validate structured data with Google's Rich Results Test
   - Check meta tags and descriptions
   - Validate canonical URLs

## 8. Future Enhancements

1. **Advanced Filtering**
   - Add tag-based filtering
   - Implement search functionality

2. **Content Relationships**
   - Create relationships between related engagements
   - Show "related content" sections

3. **Calendar View**
   - Add an optional calendar view for upcoming engagements

4. **Metrics Dashboard**
   - Track engagement metrics (views, interactions)
   - Visualize activity over time 