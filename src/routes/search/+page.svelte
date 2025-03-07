<script>
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { getAllBlogPosts } from '$lib/utils/markdown';
    import { getAllPublications } from '$lib/utils/publications';
    import { getAllEvents } from '$lib/utils/events';
    import PageContainer from '$lib/components/layout/PageContainer.svelte';
    
    export let data;
    export let form;
    
    // Use form data if available, otherwise use data from URL
    let query = form?.query ?? data.query ?? '';
    let type = form?.type ?? data.type ?? 'all';
    let results = form?.results ?? data.results ?? [];
    let blogResults = form?.blogResults ?? data.blogResults ?? [];
    let publicationResults = form?.publicationResults ?? data.publicationResults ?? [];
    let eventResults = form?.eventResults ?? data.eventResults ?? [];
    let isSearchReady = false;
    
    // Total count for display
    $: totalResults = results.length;
    
    // Client-side search function
    function performSearch(searchQuery, searchType) {
        if (!browser) return;
        
        const lowerQuery = searchQuery.toLowerCase();
        
        // Search in blog posts
        const blogPosts = getAllBlogPosts().filter(post => {
            return (
                post.title.toLowerCase().includes(lowerQuery) ||
                post.excerpt.toLowerCase().includes(lowerQuery) ||
                (post.rawContent && post.rawContent.toLowerCase().includes(lowerQuery)) ||
                post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
            );
        }).map(post => ({
            ...post,
            type: 'blog'
        }));
        
        // Search in publications
        const publications = getAllPublications().filter(pub => {
            return (
                pub.title.toLowerCase().includes(lowerQuery) ||
                (pub.excerpt && pub.excerpt.toLowerCase().includes(lowerQuery)) ||
                (pub.abstract && pub.abstract.toLowerCase().includes(lowerQuery)) ||
                (pub.rawContent && pub.rawContent.toLowerCase().includes(lowerQuery)) ||
                (pub.content && pub.content.toLowerCase().includes(lowerQuery)) ||
                (pub.tags && pub.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
            );
        }).map(pub => ({
            ...pub,
            type: 'publication'
        }));
        
        // Search in events
        const events = getAllEvents().filter(event => {
            return (
                event.title.toLowerCase().includes(lowerQuery) ||
                event.event.toLowerCase().includes(lowerQuery) ||
                (event.excerpt && event.excerpt.toLowerCase().includes(lowerQuery)) ||
                (event.content && event.content.toLowerCase().includes(lowerQuery)) ||
                (event.location && event.location.toLowerCase().includes(lowerQuery)) ||
                (event.tags && event.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
            );
        }).map(event => ({
            ...event,
            searchType: 'event',
            eventType: event.type  // Store original event type
        }));
        
        // Filter by type and combine results
        if (searchType === 'blog') {
            results = blogPosts;
        } else if (searchType === 'publication') {
            results = publications;
        } else if (searchType === 'event') {
            results = events;
        } else {
            results = [...blogPosts, ...publications, ...events].sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        
        blogResults = blogPosts;
        publicationResults = publications;
        eventResults = events;
        
        // Update URL without reloading the page
        goto(`/search?query=${encodeURIComponent(searchQuery)}&type=${searchType}`, { 
            replaceState: true,
            noScroll: true
        });
    }
    
    // Handle search submission using client-side processing
    function handleSearchSubmit(event) {
        event.preventDefault();
        
        // Get form data
        const formData = new FormData(event.target);
        const searchQuery = formData.get('query') || '';
        const searchType = formData.get('type') || 'all';
        
        query = searchQuery;
        type = searchType;
        
        performSearch(searchQuery, searchType);
    }

    // Reference to search input for autofocus
    let searchInput;
    
    onMount(() => {
        // Set search as ready for rendering
        isSearchReady = true;
        
        // Auto-focus the search input when no query is present
        if (!query && searchInput) {
            searchInput.focus();
        }
        
        // If there's a query in the URL when the page loads, perform search
        if (query) {
            performSearch(query, type);
        }
        
        // Ensure search works when loaded directly (for static sites)
        const urlParams = new URLSearchParams(window.location.search);
        const urlQuery = urlParams.get('query');
        const urlType = urlParams.get('type') || 'all';
        
        if (urlQuery && urlQuery !== query) {
            query = urlQuery;
            type = urlType;
            performSearch(urlQuery, urlType);
        }
    });
    
    // Function to get proper URL for a search result
    function getResultUrl(result) {
        if (result.type === 'blog') {
            return `/blog/${result.slug}`;
        } else if (result.type === 'publication') {
            return `/publications/${result.slug}`;
        } else if (result.searchType === 'event') {
            return `/events/${result.eventType}/${result.slug}`;
        }
        return '#';
    }
    
    // Function to get proper display type for a search result
    function getResultTypeDisplay(result) {
        if (result.type === 'blog') {
            return 'Blog Post';
        } else if (result.type === 'publication') {
            return 'Publication';
        } else if (result.searchType === 'event') {
            // Map event types to display names
            const eventTypeDisplay = {
                'speaking': 'Speaking Engagement',
                'organizing': 'Organizing Event',
                'media': 'Media Appearance'
            };
            return eventTypeDisplay[result.eventType] || 'Event';
        }
        return 'Content';
    }
    
    // Function to get type-specific badge colors for search results
    function getResultTypeBadgeClass(result) {
        if (result.type === 'blog') {
            return 'bg-primary/10 text-primary dark:bg-blue-900/50 dark:text-blue-300';
        } else if (result.type === 'publication') {
            return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
        } else if (result.searchType === 'event') {
            if (result.eventType === 'speaking') {
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
            } else if (result.eventType === 'organizing') {
                return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            } else if (result.eventType === 'media') {
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
            }
            return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300';
        }
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
</script>

{#if browser && isSearchReady}
<PageContainer heroSection={true}>
    <!-- Background decorative elements, set to lower z-index to avoid interaction issues -->
    <div class="absolute top-20 right-10 opacity-10 w-64 h-64 bg-primary rounded-full blur-3xl -z-10 pointer-events-none"></div>
    <div class="absolute bottom-40 left-10 opacity-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl -z-10 pointer-events-none"></div>
    
    <h1 class="text-5xl font-bold mb-4 text-center text-primary dark:text-[#3b82f6]">Search</h1>
    
    <form on:submit={handleSearchSubmit} class="search-form relative z-10 text-black dark:text-gray-100">
        <div class="search-input-wrapper relative z-10 text-black dark:text-gray-100">
            <input 
                type="text" 
                name="query" 
                placeholder="Search for blog posts, publications, events..." 
                value={query} 
                class="search-input w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 relative z-10 text-black dark:text-gray-100"
                aria-label="Search query"
                bind:this={searchInput}
            />
            <button type="submit" class="search-button flex-shrink-0 relative z-10 bg-primary dark:bg-[#3b82f6] hover:bg-primary-hover dark:hover:bg-blue-600">
                <span>Search</span>
            </button>
        </div>
        
        <div class="search-filters">
            <label class="filter-option">
                <input type="radio" name="type" value="all" checked={type === 'all'} />
                <span class="filter-label text-black dark:text-gray-100">All Content</span>
            </label>
            <label class="filter-option">
                <input type="radio" name="type" value="blog" checked={type === 'blog'} />
                <span class="filter-label text-black dark:text-gray-100">Blog Posts</span>
            </label>
            <label class="filter-option">
                <input type="radio" name="type" value="publication" checked={type === 'publication'} />
                <span class="filter-label text-black dark:text-gray-100">Publications</span>
            </label>
            <label class="filter-option">
                <input type="radio" name="type" value="event" checked={type === 'event'} />
                <span class="filter-label text-black dark:text-gray-100">Events</span>
            </label>
        </div>
    </form>
    
    {#if query}
        <div class="search-results-header">
            <h2 class="search-results-heading text-black dark:text-gray-100">
                {#if totalResults === 0}
                    No results found
                {:else if totalResults === 1}
                    1 result found
                {:else}
                    {totalResults} results found
                {/if}
                {#if query} for "<span class="query-text">{query}</span>"{/if}
                {#if type !== 'all'} in {type === 'blog' ? 'blog posts' : type === 'publication' ? 'publications' : 'events'}{/if}
            </h2>
        </div>
        
        <div class="search-results space-y-12">
            {#if totalResults === 0}
                <div class="no-results bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                    <p class="text-lg text-gray-600 dark:text-gray-300">No matching content found. Try adjusting your search terms or filters.</p>
                </div>
            {:else}
                {#each results as result}
                    <div class="search-result-item bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                        <div class="result-meta mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                            <div class="flex flex-wrap justify-between items-center">
                                <span class="result-type {getResultTypeBadgeClass(result)} px-3 py-1 rounded-full text-sm">
                                    {getResultTypeDisplay(result)}
                                </span>
                                <span class="result-date text-gray-500 dark:text-gray-400 text-sm italic">
                                    {new Date(result.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </span>
                            </div>
                        </div>
                        
                        <h3 class="result-title text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
                            <a href={getResultUrl(result)}>
                                {result.title}
                            </a>
                        </h3>
                        
                        {#if result.searchType === 'event' && result.event}
                            <div class="result-subtitle text-xl text-primary-600 dark:text-primary-400 mb-4">
                                {result.event}
                            </div>
                        {/if}
                        
                        {#if result.excerpt}
                            <p class="result-excerpt text-gray-600 dark:text-gray-300 mb-6">{result.excerpt}</p>
                        {/if}
                        
                        {#if result.searchType === 'event' && result.location}
                            <div class="result-meta text-gray-600 dark:text-gray-300 mb-4">
                                <span class="font-semibold">Location:</span> {result.location}
                            </div>
                        {/if}
                        
                        {#if result.tags && result.tags.length > 0}
                            <div class="result-tags flex flex-wrap gap-2 mb-6">
                                {#each result.tags as tag}
                                    <span class="tag bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                                        {tag}
                                    </span>
                                {/each}
                            </div>
                        {/if}
                    </div>
                {/each}
            {/if}
        </div>
    {:else}
        <div class="search-instructions bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            <p class="text-lg text-gray-600 dark:text-gray-300">Enter a search term above to find blog posts, publications, and events.</p>
        </div>
    {/if}
</PageContainer>
{:else}
<div class="search-loading">
    <p>Loading search functionality...</p>
</div>
{/if}

<style>
    .search-container {
        max-width: 800px;
        margin: 0 auto;
        position: relative;
    }
    
    .search-loading {
        max-width: 800px;
        margin: 4rem auto;
        text-align: center;
        color: #6b7280;
    }
    
    h1 {
        font-size: 2.5rem;
        font-weight: bold;
        margin-bottom: 1.5rem;
        text-align: center;
    }
    
    .search-form {
        margin-bottom: 2rem;
        width: 100%;
    }
    
    .search-input-wrapper {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        width: 100%;
        align-items: stretch;
        position: relative;
    }
    
    .search-input {
        flex: 1;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        border: 1px solid;
        border-radius: 8px;
        color: #1e293b;
        box-shadow: none;
        width: 100%;
        transition: all 0.3s ease;
        min-height: 48px;
        position: relative;
    }
    
    .search-input::placeholder {
        color: #9ca3af;
    }
    
    .search-input:focus {
        border-color: var(--primary, #1E3A8A);
        outline: none;
        box-shadow: 0 0 0 2px rgba(30, 58, 138, 0.1);
    }
    
    .search-button {
        /* Remove background-color since it's now handled by Tailwind classes */
        color: white;
        font-weight: 500;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 100px;
        min-height: 48px;
        transition: background-color 0.2s ease, transform 0.2s ease;
        position: relative;
        margin-left: 0.5rem;
    }
    
    .search-button:hover {
        background-color: var(--primary-hover, #1E40AF);
        transform: translateY(-2px);
    }
    
    .search-button:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(30, 58, 138, 0.3);
    }
    
    .search-filters {
        display: flex;
        gap: 1.5rem;
        margin-top: 0.75rem;
    }
    
    .filter-option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.95rem;
        cursor: pointer;
        transition: color 0.2s ease;
    }
    
    .filter-option:hover {
        color: var(--primary, #1E3A8A);
    }
    
    .filter-label {
        font-weight: 500;
        /* Let the Tailwind classes handle the color */
    }
    
    .search-results-header {
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .query-text {
        color: var(--primary, #1E3A8A);
        font-weight: 600;
    }
    
    .search-results {
        display: flex;
        flex-direction: column;
    }
    
    .search-result-item, .search-instructions, .no-results {
        transition: all 0.3s ease;
    }
    
    /* Overriding default styles with Tailwind utility classes applied directly in HTML */

    /* Dark mode styles */
    @media (prefers-color-scheme: dark) {
        .search-container {
            color: #f9fafb;
        }
        
        .search-loading {
            color: #9ca3af;
        }
        
        .search-input {
            color: #f9fafb;
            border-color: #374151;
        }
        
        .search-input:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }
        
        .search-input::placeholder {
            color: #9ca3af;
        }
        
        .search-button:focus {
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
        }
        
        .filter-option {
            color: #e5e7eb;
        }
        
        .filter-option:hover {
            color: #3b82f6;
        }
        
        .search-results-header {
            border-bottom-color: #374151;
        }
        
        .query-text {
            color: #3b82f6;
        }
        
        .search-results-heading {
            /* Remove the color property */
        }
    }
    
    @media (max-width: 768px) {
        .search-container {
            padding: 1.5rem 1rem;
        }
        
        .search-input-wrapper {
            flex-direction: column;
            gap: 0.75rem;
        }
        
        .search-button {
            width: 100%;
            margin-top: 0.5rem;
            min-height: 48px;
            z-index: 10;
            position: relative;
            margin-left: 0;
        }
        
        .search-input {
            width: 100%;
            min-height: 48px;
            z-index: 10;
            position: relative;
        }
        
        .search-filters {
            flex-direction: column;
            gap: 0.75rem;
            margin-top: 1rem;
        }
        
        h1 {
            font-size: 2rem;
        }
    }
    
    .search-results-heading {
        font-size: 1.25rem;
        font-weight: 500;
        /* Remove the color property */
    }
</style> 