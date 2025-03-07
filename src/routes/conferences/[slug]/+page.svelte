<script>
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import SEO from '$lib/components/seo/SEO.svelte';
  import PageContainer from '$lib/components/layout/PageContainer.svelte';
  
  export let data;
  const { conference } = data;
  
  let visible = false;
  
  onMount(() => {
    visible = true;
  });
  
  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
</script>

<SEO 
  title="{conference ? `${conference.name} | Conferences` : 'Conference'} | Fatih Nayebi"
  description={conference?.description || "Details about a conference Fatih Nayebi has participated in."}
  keywords={conference?.tags?.join(', ') || "conference, academic, research"}
  canonical={conference ? `https://fatihnayebi.com/conferences/${conference.slug}` : undefined}
  openGraph={{
    title: conference ? `${conference.name} | Conferences` : 'Conference',
    description: conference?.description || "Details about a conference Fatih Nayebi has participated in.",
    url: `https://fatihnayebi.com/conferences/${conference?.slug}`,
    type: 'article',
    article: {
      publishedTime: conference?.startDate,
      tags: conference?.tags
    }
  }}
  twitter={{
    card: 'summary_large_image',
    title: conference ? conference.name : 'Conference',
    description: conference?.description || "Details about a conference Fatih Nayebi has participated in."
  }}
/>

{#if !conference}
  <PageContainer>
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-4">Conference Not Found</h1>
      <p class="mb-8">The conference you're looking for could not be found.</p>
      <a href="/conferences" class="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
        Back to Conferences
      </a>
    </div>
  </PageContainer>
{:else if visible}
  <PageContainer>
    <!-- Background decorative elements -->
    <div class="absolute top-20 right-10 -z-10 opacity-10 w-64 h-64 bg-primary-600/30 dark:bg-primary-400/5 rounded-full blur-3xl"></div>
    <div class="absolute bottom-40 left-20 -z-10 opacity-10 w-96 h-96 bg-indigo-400/30 dark:bg-indigo-300/5 rounded-full blur-3xl"></div>
    
    <!-- Breadcrumb -->
    <div class="mb-8" in:fly={{ y: -30, duration: 500 }}>
      <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
        <a href="/" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</a>
        <svg class="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <a href="/conferences" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Conferences</a>
        <svg class="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
        <span class="text-gray-800 dark:text-gray-300 truncate max-w-[180px] sm:max-w-none">{conference.name}</span>
      </div>
    </div>
    
    <!-- Conference Header -->
    <div class="mb-12">
      <!-- Conference Title -->
      <h1 class="text-4xl font-bold mb-6 text-gray-900 dark:text-white leading-tight" in:fly={{ y: 20, duration: 500, delay: 200 }}>
        {conference.name}
      </h1>
      
      <!-- Conference Details -->
      <div class="flex flex-wrap gap-y-4 gap-x-8 text-md text-gray-600 dark:text-gray-300 mb-6" in:fly={{ y: 20, duration: 500, delay: 300 }}>
        {#if conference.startDate}
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>
              {formatDate(conference.startDate)}
              {#if conference.endDate && conference.endDate !== conference.startDate}
                - {formatDate(conference.endDate)}
              {/if}
            </span>
          </div>
        {/if}
        
        {#if conference.location}
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{conference.location}</span>
          </div>
        {/if}
        
        {#if conference.website}
          <div class="flex items-center">
            <svg class="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <a href={conference.website} target="_blank" rel="noopener noreferrer" class="text-primary-600 dark:text-primary-400 hover:underline">Conference Website</a>
          </div>
        {/if}
      </div>
      
      <!-- Tags -->
      {#if conference.tags && conference.tags.length > 0}
        <div class="flex flex-wrap gap-2 mb-8" in:fly={{ y: 20, duration: 500, delay: 400 }}>
          {#each conference.tags as tag}
            <span class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">
              {tag}
            </span>
          {/each}
        </div>
      {/if}
    </div>
    
    <!-- Main Content -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 mb-10" in:fly={{ y: 30, duration: 500, delay: 500 }}>
      {#if conference.description}
        <div class="prose dark:prose-invert max-w-none mb-10 text-gray-800 dark:text-gray-200">
          <p class="text-lg">{conference.description}</p>
        </div>
      {/if}
      
      {#if conference.content}
        <div class="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
          {@html conference.content}
        </div>
      {/if}
    </div>
    
    <!-- My Contributions Section -->
    {#if conference.contributions && conference.contributions.length > 0}
      <div class="mb-12" in:fly={{ y: 30, duration: 500, delay: 600 }}>
        <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">My Contributions</h2>
        
        <div class="space-y-6">
          {#each conference.contributions as contribution}
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div class="flex items-start">
                <div class="mr-4 mt-1">
                  <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <svg class="w-5 h-5 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {#if contribution.type === 'paper'}
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      {:else if contribution.type === 'poster'}
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      {:else if contribution.type === 'talk'}
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      {:else if contribution.type === 'workshop'}
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      {:else if contribution.type === 'panel'}
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      {:else}
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      {/if}
                    </svg>
                  </div>
                </div>
                
                <div class="flex-1">
                  <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    {contribution.title}
                    <span class="ml-2 text-sm font-normal text-primary-600 dark:text-primary-400 capitalize">{contribution.type}</span>
                  </h3>
                  
                  {#if contribution.abstract}
                    <div class="mb-4 text-gray-700 dark:text-gray-300">
                      <p>{contribution.abstract}</p>
                    </div>
                  {/if}
                  
                  {#if contribution.coauthors}
                    <div class="mb-3">
                      <span class="text-sm font-medium text-gray-600 dark:text-gray-400">With: </span>
                      <span class="text-sm text-gray-700 dark:text-gray-300">{contribution.coauthors}</span>
                    </div>
                  {/if}
                  
                  <div class="flex flex-wrap gap-4 mt-4">
                    {#if contribution.paperUrl}
                      <a href={contribution.paperUrl} target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-sm text-primary-600 dark:text-primary-400 hover:underline">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        View Paper
                      </a>
                    {/if}
                    
                    {#if contribution.slidesUrl}
                      <a href={contribution.slidesUrl} target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-sm text-primary-600 dark:text-primary-400 hover:underline">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                        View Slides
                      </a>
                    {/if}
                    
                    {#if contribution.videoUrl}
                      <a href={contribution.videoUrl} target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-sm text-primary-600 dark:text-primary-400 hover:underline">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Watch Presentation
                      </a>
                    {/if}
                    
                    {#if contribution.posterUrl}
                      <a href={contribution.posterUrl} target="_blank" rel="noopener noreferrer" class="inline-flex items-center text-sm text-primary-600 dark:text-primary-400 hover:underline">
                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        View Poster
                      </a>
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
    
    <!-- Navigation Link -->
    <div class="text-center" in:fly={{ y: 30, duration: 500, delay: 700 }}>
      <a href="/conferences" class="inline-block text-primary-600 dark:text-primary-400 hover:underline">
        ← Back to All Conferences
      </a>
    </div>
  </PageContainer>
{/if} 