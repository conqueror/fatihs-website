<script>
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import AnimateInView from '$lib/components/ui/AnimateInView.svelte';
  import SEO from '$lib/components/seo/SEO.svelte';
  
  export let data;
  const { conferences } = data;
  
  // Group conferences by year
  const conferencesByYear = {};
  
  if (conferences && conferences.length) {
    conferences.forEach(conference => {
      // Extract year from date, properly handling various date formats
      let year;
      if (conference.date) {
        // Handle both YYYY-MM-DD and other date formats
        if (conference.date.includes('-')) {
          year = conference.date.split('-')[0];
        } else {
          // Fallback if date doesn't include hyphen
          year = new Date(conference.date).getFullYear();
        }
      } else {
        // Default to current year if no date
        year = new Date().getFullYear();
      }
      
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
  
  // Format date for display
  function formatDate(dateString) {
    if (!dateString) return 'Date TBA';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // If we can't parse it as a date, return as is
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
  
  // Helper to get clean event name
  function getEventName(conference) {
    // If event is just a single letter, try to extract from location
    if (conference.event && conference.event.length > 1) {
      return conference.event;
    } else if (conference.location && conference.location.includes('–')) {
      // Extract from location if it contains a dash
      return conference.location.split('–')[0].trim();
    } else {
      return conference.event || 'Conference';
    }
  }
  
  // Helper to get clean location
  function getLocation(conference) {
    if (!conference.location) return '';
    
    if (conference.location.includes('–')) {
      // If location has event info (contains a dash), try to extract just location part
      const parts = conference.location.split('–');
      return parts[parts.length - 1].trim();
    }
    
    return conference.location;
  }
  
  // Get a safe excerpt
  function getSafeExcerpt(conference) {
    if (conference.excerpt && conference.excerpt.length > 0) {
      return conference.excerpt;
    } else if (conference.html) {
      // Extract text from HTML for excerpt if no excerpt is provided
      const div = document.createElement('div');
      div.innerHTML = conference.html;
      const text = div.textContent || div.innerText || '';
      return text.length > 150 ? text.substring(0, 150) + '...' : text;
    }
    return 'Details coming soon...';
  }
</script>

<SEO 
  title="Conference Appearances | Fatih Nayebi"
  description="Upcoming and past conference appearances by Fatih Nayebi, covering AI, retail technology, and data science topics."
  keywords="conferences, speaking engagements, AI talks, retail technology, Fatih Nayebi"
/>

{#if visible}
<div in:fade={{ duration: 800 }} class="py-12 container mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
  <!-- Background decorative elements (optional) -->
  <div class="absolute top-20 right-10 opacity-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
  <div class="absolute bottom-40 left-10 opacity-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
  
  <!-- Page header with center alignment -->
  <h1 class="text-5xl font-bold mb-4 text-center text-primary dark:text-blue-400" in:fly={{ y: -30, duration: 800, delay: 300 }}>Conference Appearances</h1>
  <p class="text-lg text-center mb-8 max-w-3xl mx-auto text-gray-700 dark:text-gray-300" in:fly={{ y: 30, duration: 800, delay: 500 }}>
    Here you'll find my upcoming and recent speaking engagements at conferences and events
    around the world. I regularly speak on topics including artificial intelligence,
    retail technology, and the practical application of data science.
  </p>

  <!-- Call to action box - moved to top and enhanced -->
  <AnimateInView type="fade" delay={700}>
    <div class="mb-16 bg-gradient-to-r from-primary-600/90 to-indigo-600/90 p-8 rounded-lg shadow-xl border-2 border-primary-300 dark:border-primary-700 text-gray-800 dark:text-white relative overflow-hidden">
      <!-- Decorative elements -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
      
      <h3 class="text-2xl font-bold mb-4 relative z-10">Interested in having me speak at your event?</h3>
      <p class="mb-6 text-lg max-w-2xl relative z-10">
        I'm available for speaking engagements on AI, machine learning, retail technology, 
        and data science. Please get in touch via the contact page to discuss opportunities.
      </p>
      <a href="/contact" class="inline-block px-8 py-4 bg-white text-primary-700 font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-md relative z-10">
        Contact Me
      </a>
    </div>
  </AnimateInView>

  {#if years.length > 0}
    {#each years as year}
      <AnimateInView type="fade" delay={300}>
        <div class="mb-20">
          <h2 class="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">{year} Conferences</h2>
          
          <div class="grid gap-8">
            {#each conferencesByYear[year] as conference, i}
              <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-xl dark:shadow-gray-900/30 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div class="p-6">
                  <!-- Event name and title section -->
                  <div class="mb-4">
                    <h3 class="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100">
                      {conference.event && conference.event.length > 1 ? conference.event : 'Conference'}
                    </h3>
                    {#if conference.title}
                      <div class="text-xl mb-3 text-primary-600 dark:text-primary-400">
                        {conference.title}
                      </div>
                    {/if}
                  </div>
                  
                  <!-- Date and Location -->
                  <div class="flex flex-col sm:flex-row sm:gap-8 mb-4">
                    <!-- Date -->
                    {#if conference.date}
                      <div class="flex items-center mb-2 sm:mb-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <span>{formatDate(conference.date)}</span>
                      </div>
                    {/if}
                    <!-- Location -->
                    {#if conference.location}
                      <div class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        <span>{conference.location}</span>
                      </div>
                    {/if}
                  </div>
                  
                  <!-- Excerpt -->
                  <div class="prose dark:prose-invert max-w-none mb-4">
                    <p class="text-gray-700 dark:text-gray-300">
                      {#if conference.excerpt && conference.excerpt.length > 0}
                        {conference.excerpt}
                      {:else if conference.content && conference.content.length > 0}
                        {conference.content.substring(0, 150)}...
                      {:else}
                        Details coming soon...
                      {/if}
                    </p>
                  </div>
                  
                  <!-- Tags -->
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
            {/each}
          </div>
        </div>
      </AnimateInView>
    {/each}
  {:else}
    <AnimateInView type="fade" delay={500}>
      <div class="mb-8">
        <h2 class="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100">No Conferences Found</h2>
        <p class="text-gray-700 dark:text-gray-300 mb-8">
          No conference data is currently available. Please check back later.
        </p>
      </div>
    </AnimateInView>
  {/if}
</div>
{/if} 