<script>
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    import { browser } from '$app/environment';
    import { getAllBlogPosts } from '$lib/utils/markdown';
    import { getAllPublications } from '$lib/utils/publications';
    
    export let data;
    export let form;
    
    // Use form data if available, otherwise use data from URL
    let query = form?.query ?? data.query ?? '';
    let type = form?.type ?? data.type ?? 'all';
    let results = form?.results ?? data.results ?? [];
    let blogResults = form?.blogResults ?? data.blogResults ?? [];
    let publicationResults = form?.publicationResults ?? data.publicationResults ?? [];
    
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
        
        // Filter by type and combine results
        if (searchType === 'blog') {
            results = blogPosts;
        } else if (searchType === 'publication') {
            results = publications;
        } else {
            results = [...blogPosts, ...publications].sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        
        blogResults = blogPosts;
        publicationResults = publications;
        
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
        // Auto-focus the search input when no query is present
        if (!query && searchInput) {
            searchInput.focus();
        }
        
        // If there's a query in the URL when the page loads, perform search
        if (query) {
            performSearch(query, type);
        }
    });
</script>

<div class="search-container">
    <h1>Search</h1>
    
    <form on:submit={handleSearchSubmit} class="search-form">
        <div class="search-input-wrapper">
            <input 
                type="text" 
                name="query" 
                placeholder="Search for blog posts, publications..." 
                value={query} 
                class="search-input"
                aria-label="Search query"
                bind:this={searchInput}
            />
            <button type="submit" class="search-button">Search</button>
        </div>
        
        <div class="search-filters">
            <label class="filter-option">
                <input type="radio" name="type" value="all" checked={type === 'all'} />
                <span>All Content</span>
            </label>
            <label class="filter-option">
                <input type="radio" name="type" value="blog" checked={type === 'blog'} />
                <span>Blog Posts</span>
            </label>
            <label class="filter-option">
                <input type="radio" name="type" value="publication" checked={type === 'publication'} />
                <span>Publications</span>
            </label>
        </div>
    </form>
    
    {#if query}
        <div class="search-results-header">
            <h2>
                {#if totalResults === 0}
                    No results found
                {:else if totalResults === 1}
                    1 result found
                {:else}
                    {totalResults} results found
                {/if}
                {#if query} for "{query}"{/if}
            </h2>
        </div>
        
        <div class="search-results">
            {#if totalResults === 0}
                <div class="no-results">
                    <p>No matching content found. Try adjusting your search terms or filters.</p>
                </div>
            {:else}
                {#each results as result}
                    <div class="search-result-item">
                        <div class="result-meta">
                            <span class="result-type">{result.type === 'blog' ? 'Blog Post' : 'Publication'}</span>
                            <span class="result-date">
                                {new Date(result.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                        
                        <h3 class="result-title">
                            <a href={result.type === 'blog' ? `/blog/${result.slug}` : `/publications/${result.slug}`}>
                                {result.title}
                            </a>
                        </h3>
                        
                        {#if result.type === 'blog' && result.excerpt}
                            <p class="result-excerpt">{result.excerpt}</p>
                        {/if}
                        
                        {#if result.type === 'publication' && (result.abstract || result.excerpt)}
                            <p class="result-excerpt">{result.abstract || result.excerpt}</p>
                        {/if}
                        
                        {#if result.tags && result.tags.length > 0}
                            <div class="result-tags">
                                {#each result.tags as tag}
                                    <span class="tag">{tag}</span>
                                {/each}
                            </div>
                        {/if}
                    </div>
                {/each}
            {/if}
        </div>
    {:else}
        <div class="search-instructions">
            <p>Enter a search term above to find blog posts and publications.</p>
        </div>
    {/if}
</div>

<style>
    .search-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 0;
    }
    
    h1 {
        font-size: 2.5rem;
        margin-bottom: 1.5rem;
    }
    
    .search-form {
        margin-bottom: 2rem;
    }
    
    .search-input-wrapper {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    
    .search-input {
        flex: 1;
        padding: 0.75rem 1rem;
        font-size: 1rem;
        border: 2px solid #eee;
        border-radius: 4px;
        transition: border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease;
    }
    
    .search-input:focus {
        border-color: #5333ed;
        outline: none;
    }
    
    .search-button {
        background-color: #5333ed;
        color: white;
        font-weight: 500;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }
    
    .search-button:hover {
        background-color: #4526c3;
    }
    
    .search-filters {
        display: flex;
        gap: 1.5rem;
        margin-top: 0.5rem;
    }
    
    .filter-option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
        cursor: pointer;
    }
    
    .search-results-header {
        margin-bottom: 1.5rem;
        padding-bottom: 0.75rem;
        border-bottom: 1px solid #eee;
    }
    
    .search-results-header h2 {
        font-size: 1.25rem;
        color: #555;
        font-weight: 500;
    }
    
    .search-results {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .search-result-item {
        padding: 1.25rem;
        border: 1px solid #eee;
        border-radius: 8px;
        transition: box-shadow 0.3s ease, transform 0.3s ease, background-color 0.3s ease;
    }
    
    .search-result-item:hover {
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
    }
    
    .result-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
    }
    
    .result-type {
        display: inline-block;
        padding: 0.25rem 0.5rem;
        background-color: #f0f0f0;
        border-radius: 4px;
        font-size: 0.8rem;
        font-weight: 500;
        color: #555;
        transition: background-color 0.3s ease, color 0.3s ease;
    }
    
    .result-date {
        font-size: 0.85rem;
        color: #666;
        transition: color 0.3s ease;
    }
    
    .result-title {
        font-size: 1.3rem;
        margin-bottom: 0.5rem;
    }
    
    .result-title a {
        color: #333;
        text-decoration: none;
        transition: color 0.3s ease;
    }
    
    .result-title a:hover {
        color: #5333ed;
    }
    
    .result-excerpt {
        margin-bottom: 0.75rem;
        color: #555;
        line-height: 1.6;
        transition: color 0.3s ease;
    }
    
    .result-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .tag {
        background-color: #f0f0f0;
        color: #555;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        transition: background-color 0.3s ease, color 0.3s ease;
    }
    
    .search-instructions, .no-results {
        text-align: center;
        padding: 3rem 1rem;
        color: #666;
        background-color: #f9f9f9;
        border-radius: 8px;
        transition: background-color 0.3s ease, color 0.3s ease;
    }
    
    /* Dark mode styles */
    @media (prefers-color-scheme: dark) {
        .search-container {
            color: #f0f0f0;
        }
        
        .search-input {
            background-color: #2a2a2a;
            color: #f0f0f0;
            border-color: #444;
        }
        
        .search-input:focus {
            border-color: #6b4dff;
        }
        
        .search-button {
            background-color: #6b4dff;
        }
        
        .search-button:hover {
            background-color: #7d61ff;
        }
        
        .search-results-header {
            border-bottom-color: #444;
        }
        
        .search-results-header h2 {
            color: #d0d0d0;
        }
        
        .search-result-item {
            background-color: #2a2a2a;
            border-color: #444;
        }
        
        .search-result-item:hover {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
        }
        
        .result-type {
            background-color: #333;
            color: #d0d0d0;
        }
        
        .result-date {
            color: #aaa;
        }
        
        .result-title a {
            color: #f0f0f0;
        }
        
        .result-title a:hover {
            color: #7d61ff;
        }
        
        .result-excerpt {
            color: #c0c0c0;
        }
        
        .tag {
            background-color: #333;
            color: #d0d0d0;
        }
        
        .search-instructions, .no-results {
            background-color: #222;
            color: #aaa;
        }
    }
    
    @media (max-width: 768px) {
        .search-container {
            padding: 1.5rem 1rem;
        }
        
        .search-input-wrapper {
            flex-direction: column;
        }
        
        .search-button {
            width: 100%;
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
</style> 