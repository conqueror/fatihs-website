<script>
  import { page } from '$app/stores';
  import SEO from '$lib/components/seo/SEO.svelte';

  // Determine if this is a 404 error
  $: is404 = $page.status === 404;
  $: title = is404 ? "Page Not Found | Fatih Nayebi" : "Error | Fatih Nayebi";
  $: description = is404 
    ? "Sorry, the page you're looking for doesn't exist. Explore Dr. Fatih Nayebi's research in AI and machine learning."
    : "An error occurred while loading this page. Please try again later or explore other sections of Dr. Fatih Nayebi's website.";
</script>

<SEO
  title={title}
  description={description}
  noindex={true}
/>

<div class="container mx-auto px-4 py-16 text-center">
  <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto">
    <h1 class="text-4xl font-bold mb-6 dark:text-white">
      {is404 ? "Page Not Found" : `Error ${$page.status}`}
    </h1>
    
    {#if is404}
      <p class="mb-8 text-gray-600 dark:text-gray-300">
        Sorry, the page "{$page.url.pathname}" doesn't exist or has been moved.
      </p>
    {:else}
      <p class="mb-8 text-gray-600 dark:text-gray-300">
        An unexpected error occurred while loading this page. Please try again later.
      </p>
    {/if}
    
    <div class="space-y-4">
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        You might want to check out these sections instead:
      </p>
      
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <a href="/" class="btn bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded transition-colors">
          Homepage
        </a>
        <a href="/blog" class="btn bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-6 rounded transition-colors">
          Latest Articles
        </a>
        <a href="/publications" class="btn bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-6 rounded transition-colors">
          Research Publications
        </a>
      </div>
    </div>
    
    {#if !is404}
      <div class="mt-8 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
        <p>Error code: {$page.status} {$page.error?.message || ''}</p>
      </div>
    {/if}
  </div>
</div>

<style>
  .btn {
    display: inline-block;
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
  }
</style> 