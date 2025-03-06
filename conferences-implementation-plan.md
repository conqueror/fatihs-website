# Conferences Page Implementation Plan

## Overview

This document outlines the implementation plan for adding a Conferences page to the website, following a similar pattern to the Blog page. The Conferences page will display content from markdown files like the existing Blog page does.

## Current System Analysis

### Content Generation

The website currently uses a content generation system that:

1. Takes markdown files from `src/content/[content-type]` directories
2. Processes them with a Node.js script (`scripts/generate-content.js`)
3. Extracts frontmatter and content
4. Converts markdown to HTML with syntax highlighting via Shiki
5. Outputs JSON files to `src/lib/generated/[content-type].json`

The JSON files are then imported by utility functions in `src/lib/utils/markdown.js` to be used throughout the site.

### Blog Implementation

The Blog page implementation consists of:

- Markdown files in `src/content/blog/`
- Generated JSON at `src/lib/generated/blog-posts.json`
- Utility functions in `src/lib/utils/markdown.js`
- Route components:
  - `src/routes/blog/+page.svelte` (UI for listing blog posts)
  - `src/routes/blog/+page.js` (server-side load function)
  - `src/routes/blog/[slug]/+page.svelte` (UI for individual blog post)
  - `src/routes/blog/[slug]/+page.js` (server-side load function for individual post)

## Implementation Tasks

### 1. Update Content Generation Script

- [x] Verify that `conferences` content type is present in the `src/content` directory
- [ ] Update `generate-content.js` to include the conferences content type

```javascript
// Add to contentTypes array in scripts/generate-content.js
{
  type: 'conferences',
  source: 'src/content/conferences',
  output: 'src/lib/generated'
}
```

### 2. Create Markdown Utility Functions

- [ ] Add utility functions to `src/lib/utils/markdown.js` to handle conference data:

```javascript
import conferencesData from '$lib/generated/conferences.json';

export function getAllConferences() {
  return conferencesData;
}

export function getConferenceBySlug(slug) {
  return conferencesData.find(conference => conference.slug === slug);
}

export function getFilteredConferences({ year = null, featured = false } = {}) {
  let filteredConferences = conferencesData;

  if (year) {
    filteredConferences = filteredConferences.filter(conference => 
      conference.date.includes(year));
  }

  if (featured) {
    filteredConferences = filteredConferences.filter(conference => conference.featured);
  }

  return filteredConferences;
}
```

### 3. Prepare Conference Markdown Content

- [ ] Structure conference data in markdown files
- [ ] Create individual markdown files for conferences or use a consolidated approach
- [ ] Define frontmatter structure for conferences:

```markdown
---
title: "Conference Title"
date: "YYYY-MM-DD"
location: "City, Country"
event: "Event Name"
slug: "event-name-yyyy"
excerpt: "Brief description of the talk or conference"
tags: ["Tag1", "Tag2"]
featured: false
---

Conference content in markdown...
```

### 4. Create Conferences Page Routes

- [ ] Create `src/routes/conferences/+page.js`:

```javascript
import { getAllConferences } from '$lib/utils/markdown';

// Enable prerendering
export const prerender = true;

/** @type {import('./$types').PageLoad} */
export async function load() {
  // Get all conferences
  const conferences = getAllConferences();
  
  // Return serializable data
  return {
    conferences
  };
}
```

- [ ] Create `src/routes/conferences/+page.svelte` for listing conferences:

```svelte
<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import SEO from '$lib/components/SEO.svelte';
  import { formatDate } from '$lib/utils/dates';
  
  export let data;
  const { conferences } = data;
  
  let visible = false;
  onMount(() => {
    visible = true;
  });
</script>

<SEO
  title="Conference Talks & Speaking Engagements | Fatih Nayebi"
  description="Explore Fatih Nayebi's conference talks and speaking engagements on AI, machine learning, and digital transformation."
  keywords="Fatih Nayebi, conferences, speaking engagements, AI talks, machine learning presentations"
/>

<div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <div class="text-center mb-12">
    {#if visible}
      <div in:fly={{ y: -20, duration: 800 }}>
        <span class="inline-block mx-auto mb-2">
          <span class="w-20 h-1 bg-blue-500 block mb-1"></span>
          <span class="w-10 h-1 bg-blue-500 block ml-auto"></span>
        </span>
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Conference Talks</h1>
        <p class="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Explore my speaking engagements and conference presentations on AI, 
          machine learning, and digital transformation.
        </p>
      </div>
    {/if}
  </div>

  {#if visible}
    <div class="grid gap-12 mt-12">
      {#each conferences as conference, i}
        <div 
          in:fade={{ delay: 100 + i * 100, duration: 500 }}
          class="conference-card p-6 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-900"
        >
          <div class="flex flex-col md:flex-row gap-6">
            <div class="conference-content flex-1">
              <div class="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>{conference.date}</span>
                {#if conference.location}
                  <span>•</span>
                  <span>{conference.location}</span>
                {/if}
              </div>
              
              <h2 class="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                {conference.event}
              </h2>
              
              {#if conference.title}
                <h3 class="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
                  {conference.title}
                </h3>
              {/if}
              
              <div class="prose dark:prose-dark max-w-none mb-4">
                {@html conference.excerpt}
              </div>
              
              {#if conference.tags && conference.tags.length > 0}
                <div class="flex flex-wrap gap-2 mt-4">
                  {#each conference.tags as tag}
                    <span class="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm rounded-full">
                      {tag}
                    </span>
                  {/each}
                </div>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
```

- [ ] Optionally, create individual conference pages at `src/routes/conferences/[slug]/+page.svelte` and `+page.js` if detailed individual pages are needed

### 5. Process & Format Conference Content 

- [ ] Run the content generation script to process markdown files and generate JSON
- [ ] Verify that conferences are displayed correctly on the page
- [ ] Add sorting by date/year and any filtering needed

```bash
node scripts/generate-content.js
```

### 6. Add Navigation & Integration

- [ ] Ensure the Conferences link in the navigation menu works correctly
- [ ] Add transitions and animations consistent with the rest of the site 
- [ ] Test responsiveness on different screen sizes

### 7. Testing & Validation

- [ ] Test the page with sample conference data
- [ ] Validate HTML and accessibility
- [ ] Check performance and loading time
- [ ] Verify SEO metadata is correct

## Considerations

1. **Content Structure**: Consider whether to organize conferences by year or as individual entries.
2. **Design Consistency**: Ensure the Conferences page matches the visual style of the Blog page but with appropriate content-specific adaptations.
3. **Performance**: Verify that adding another content type doesn't significantly impact build time.
4. **SEO**: Include proper metadata for the Conferences page and individual conference entries if applicable.

## Next Steps After Implementation

1. Add more conference entries via markdown files
2. Consider adding filtering by year, topic, or location
3. Add a featured section for upcoming speaking engagements
4. Implement a calendar view or timeline visualization 