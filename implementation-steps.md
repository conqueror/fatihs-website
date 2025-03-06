# Conferences Page Implementation Steps

## Step 1: Update Content Generation Script

First, update the content generation script to include the conferences content type. Open `scripts/generate-content.js` and add the following to the `contentTypes` array:

```javascript
// Add to contentTypes array in scripts/generate-content.js
{
  type: 'conferences',
  source: 'src/content/conferences',
  output: 'src/lib/generated'
}
```

## Step 2: Add Utility Functions to Markdown.js

Open `src/lib/utils/markdown.js` and add the following functions to handle conference data:

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

## Step 3: Create Conference Page Route Files

### Create the +page.js file

Create a new file at `src/routes/conferences/+page.js` with the following content:

```javascript
import { getAllConferences } from '$lib/utils/markdown';

// Enable prerendering
export const prerender = true;

/** @type {import('./$types').PageLoad} */
export async function load() {
  // Get all conferences
  const conferences = getAllConferences();
  
  // Sort conferences by date (most recent first)
  conferences.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Return serializable data
  return {
    conferences
  };
}
```

### Update the +page.svelte file

The conferences page already exists at `src/routes/conferences/+page.svelte`, but we need to update it to display the conference data. Replace its content with:

```svelte
<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import SEO from '$lib/components/SEO.svelte';
  import { formatDate } from '$lib/utils/dates';
  
  export let data;
  const { conferences } = data;
  
  // Group conferences by year
  const conferencesByYear = {};
  
  if (conferences) {
    conferences.forEach(conference => {
      const year = new Date(conference.date).getFullYear();
      if (!conferencesByYear[year]) {
        conferencesByYear[year] = [];
      }
      conferencesByYear[year].push(conference);
    });
  }
  
  // Get years in descending order
  const years = Object.keys(conferencesByYear).sort((a, b) => b - a);
  
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
    {#each years as year}
      <div class="mb-16">
        <h2 class="text-3xl font-bold mb-8 text-blue-600 dark:text-blue-400">{year}</h2>
        <div class="grid gap-8">
          {#each conferencesByYear[year] as conference, i}
            <div 
              in:fade={{ delay: 100 + i * 100, duration: 500 }}
              class="conference-card p-6 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-900"
            >
              <div class="flex flex-col md:flex-row gap-6">
                <div class="conference-content flex-1">
                  <div class="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
                    <span>{new Date(conference.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    {#if conference.location}
                      <span>•</span>
                      <span>{conference.location}</span>
                    {/if}
                  </div>
                  
                  <h3 class="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                    {conference.event}
                  </h3>
                  
                  {#if conference.title}
                    <div class="text-xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
                      Talk: <i>{conference.title}</i>
                    </div>
                  {/if}
                  
                  <div class="prose dark:prose-invert max-w-none mb-4">
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
      </div>
    {/each}
  {/if}
</div>
```

## Step 4: Prepare Conference Content

Create individual markdown files in the `src/content/conferences` directory, or update the existing `index.md` file to use the proper frontmatter structure:

Example frontmatter structure:
```markdown
---
title: "Talk Title"
date: "YYYY-MM-DD"
location: "City, Country"
event: "Event Name"
slug: "event-name-yyyy"
excerpt: "Brief description of the talk or conference"
tags: ["Tag1", "Tag2"]
featured: false
---

Content in markdown...
```

## Step 5: Run Content Generation Script

After making these changes, run the content generation script to process the conference markdown files:

```bash
node scripts/generate-content.js
```

This will create a `conferences.json` file in the `src/lib/generated` directory.

## Step 6: Build and Test

Build and serve the site to test the conferences page:

```bash
npm run build
npm run preview
```

Navigate to http://localhost:3000/conferences to view the conferences page.

## Optional Enhancements

### 1. Add filtering by year, tag, or featured status

Add filter controls to the conferences page to allow users to filter by year, tag, or featured status.

### 2. Add individual conference pages

If you want to create individual pages for each conference, add the following files:

#### src/routes/conferences/[slug]/+page.js
```javascript
import { getConferenceBySlug } from '$lib/utils/markdown';

// Enable prerendering
export const prerender = true;

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  const { slug } = params;
  const conference = getConferenceBySlug(slug);
  
  if (!conference) {
    return {
      status: 404,
      error: 'Conference not found'
    };
  }
  
  return {
    conference
  };
}
```

#### src/routes/conferences/[slug]/+page.svelte
```svelte
<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import SEO from '$lib/components/SEO.svelte';
  
  export let data;
  const { conference } = data;
  
  let visible = false;
  onMount(() => {
    visible = true;
  });
</script>

<SEO
  title="{conference.title} | Fatih Nayebi"
  description="{conference.excerpt}"
  keywords="Fatih Nayebi, conferences, {conference.tags.join(', ')}"
/>

<div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  {#if visible}
    <div in:fade={{ duration: 500 }}>
      <div class="mb-8">
        <a href="/conferences" class="text-blue-600 dark:text-blue-400 hover:underline">
          ← Back to All Conferences
        </a>
      </div>
      
      <div class="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-3">
        <span>{new Date(conference.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        {#if conference.location}
          <span>•</span>
          <span>{conference.location}</span>
        {/if}
      </div>
      
      <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        {conference.event}
      </h1>
      
      {#if conference.title}
        <h2 class="text-2xl font-semibold mb-6 text-blue-600 dark:text-blue-400">
          Talk: <i>{conference.title}</i>
        </h2>
      {/if}
      
      <div class="prose dark:prose-invert max-w-none my-8">
        {@html conference.html}
      </div>
      
      {#if conference.tags && conference.tags.length > 0}
        <div class="mt-8">
          <h3 class="text-lg font-semibold mb-2">Topics</h3>
          <div class="flex flex-wrap gap-2">
            {#each conference.tags as tag}
              <span class="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm rounded-full">
                {tag}
              </span>
            {/each}
          </div>
        </div>
      {/if}
    </div>
  {/if}
</div>
```

### 3. Add a featured conferences section to the homepage

Update the homepage to include a section for featured conferences:

```svelte
<script>
  import { getFilteredConferences } from '$lib/utils/markdown';
  
  // Get featured conferences
  const featuredConferences = getFilteredConferences({ featured: true });
</script>

<!-- Featured Conferences Section -->
{#if featuredConferences.length > 0}
  <section class="py-16 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold">Upcoming Speaking Engagements</h2>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Check out my upcoming conference appearances and talks
        </p>
      </div>
      
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {#each featuredConferences as conference}
          <a 
            href="/conferences/{conference.slug}" 
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {new Date(conference.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <h3 class="text-xl font-bold mb-2">{conference.event}</h3>
            <p class="text-blue-600 dark:text-blue-400 font-medium mb-3">{conference.title}</p>
            <p class="text-gray-700 dark:text-gray-300">{conference.excerpt}</p>
          </a>
        {/each}
      </div>
      
      <div class="text-center mt-8">
        <a 
          href="/conferences" 
          class="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          View All Conferences
        </a>
      </div>
    </div>
  </section>
{/if}
``` 