<script>
    import { enhance } from '$app/forms';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { onMount } from 'svelte';
    
    export let data;
    export let form;
    
    // Use form data if available, otherwise use data from URL
    const query = form?.query ?? data.query;
    const type = form?.type ?? data.type;
    const results = form?.results ?? data.results;
    const blogResults = form?.blogResults ?? data.blogResults;
    const publicationResults = form?.publicationResults ?? data.publicationResults;
    
    // Total count for display
    const totalResults = results.length;
    
    // Handle search submission and update URL
    function handleSearchSubmit(event) {
        // Get form data
        const formData = new FormData(event.target);
        const searchQuery = formData.get('query');
        const searchType = formData.get('type');
        
        // Update URL with search parameters
        goto(`/search?query=${encodeURIComponent(searchQuery)}&type=${searchType}`, { replaceState: true });
    }

    // Reference to search input for autofocus
    let searchInput;

    onMount(() => {
        // Auto-focus the search input when no query is present
        if (!query && searchInput) {
            searchInput.focus();
        }
    });
</script>

<div class="search-container">
    <h1>Search</h1>
    
    <form method="POST" action="/search" use:enhance class="search-form" on:submit|preventDefault={handleSearchSubmit}>
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
                        
                        {#if result.excerpt}
                            <p class="result-excerpt">{result.excerpt}</p>
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
        transition: border-color 0.3s ease;
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
        transition: box-shadow 0.3s ease, transform 0.3s ease;
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
    }
    
    .result-date {
        font-size: 0.85rem;
        color: #666;
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
    }
    
    .search-instructions, .no-results {
        text-align: center;
        padding: 3rem 1rem;
        color: #666;
        background-color: #f9f9f9;
        border-radius: 8px;
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