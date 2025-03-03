<script>
    import { onMount } from 'svelte';
    import DOMPurify from 'dompurify';
    import { storage } from '$lib/utils/storage';
    import { browser } from '$app/environment';
    import { highlightAll } from '$lib/utils/prism';
    import '$lib/utils/prism-theme.css';
    
    export let data;
    // Ensure post is always at least an empty object to prevent undefined errors
    const post = data?.post || {};
    let isLoading = true;
    let hasError = false;
    let sanitizedContent = '';
    let contentContainer;

    onMount(() => {
        try {
            if (post?.content) {
                console.log('Processing blog post content');
                
                // Only sanitize if DOMPurify is available (it should be in browser context)
                if (browser && typeof DOMPurify !== 'undefined') {
                    // Set sanitize options to allow classes and data attributes for syntax highlighting
                    const sanitizeOptions = {
                        ADD_TAGS: ['pre', 'code'],
                        ADD_ATTR: ['class', 'data-language'],
                        ALLOW_DATA_ATTR: true
                    };
                    
                    sanitizedContent = DOMPurify.sanitize(post.content, sanitizeOptions);
                    console.log('Content sanitized');
                } else {
                    // Fallback: just use the raw content if DOMPurify is unavailable
                    sanitizedContent = post.content;
                    console.log('Using unsanitized content (no DOMPurify)');
                }
                
                // Only attempt to store history if we're in the browser context
                if (browser && post?.slug) {
                    try {
                        // No need to wrap this in try/catch as our storage utility already handles errors
                        storage.setItem('lastViewedPost', post.slug);
                        
                        // Update recently viewed posts list if possible
                        try {
                            const recentPostsJSON = storage.getItem('recentPosts') || '[]';
                            const recentPosts = JSON.parse(recentPostsJSON);
                            
                            // Add current post to the recent list if not already there
                            if (!recentPosts.includes(post.slug)) {
                                // Keep only the 5 most recent posts
                                recentPosts.unshift(post.slug);
                                if (recentPosts.length > 5) {
                                    recentPosts.pop();
                                }
                                
                                storage.setItem('recentPosts', JSON.stringify(recentPosts));
                            }
                        } catch (e) {
                            // Silently ignore any JSON parsing errors
                            console.debug('Could not update recent posts list:', e);
                        }
                    } catch (storageError) {
                        // Completely ignore any storage errors
                        console.debug('Storage error ignored:', storageError);
                    }
                }
            }
        } catch (error) {
            console.error('Error processing content:', error);
            hasError = true;
        } finally {
            isLoading = false;
            
            // Apply syntax highlighting after the DOM has been updated with the content
            setTimeout(() => {
                if (browser && contentContainer) {
                    console.log('Applying syntax highlighting');
                    highlightAll();
                }
            }, 100);
        }
    });
</script>

{#if isLoading}
    <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading post...</p>
    </div>
{:else if hasError}
    <div class="error-container">
        <h1>Error Loading Content</h1>
        <p>Sorry, there was an error loading this blog post.</p>
        <a href="/blog" class="back-link">← Back to all posts</a>
    </div>
{:else if post?.title}
    <div class="container">
        <div class="blog-header">
            <h1>{post.title}</h1>
            <div class="post-meta">
                {#if post.date}
                    <span class="post-date">{new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</span>
                {/if}
                <span class="post-author">By {post.author || 'Fatih Nayebi'}</span>
            </div>
            
            {#if post.tags && post.tags.length > 0}
                <div class="post-tags">
                    {#each post.tags as tag}
                        <span class="tag">{tag}</span>
                    {/each}
                </div>
            {/if}
        </div>
        
        <div class="blog-content" bind:this={contentContainer}>
            {@html sanitizedContent || post.content || '<p>No content available</p>'}
        </div>
        
        <div class="blog-footer">
            <a href="/blog" class="back-link">← Back to all posts</a>
        </div>
    </div>
{:else}
    <div class="error-container">
        <h1>Post Not Found</h1>
        <p>Sorry, we couldn't find the blog post you're looking for.</p>
        <a href="/blog" class="back-link">← Back to all posts</a>
    </div>
{/if}

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 1rem;
    }
    
    .error-container {
        max-width: 600px;
        margin: 4rem auto;
        text-align: center;
        padding: 2rem 1rem;
    }
    
    .error-container h1 {
        color: #e74c3c;
        margin-bottom: 1rem;
    }
    
    .error-container p {
        color: #666;
        margin-bottom: 2rem;
    }
    
    .blog-header {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid #eee;
    }
    
    h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        line-height: 1.2;
    }
    
    .post-meta {
        display: flex;
        gap: 1rem;
        color: #666;
        margin-bottom: 1rem;
    }
    
    .post-tags {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    
    .tag {
        background-color: #f0f0f0;
        color: #555;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
    }
    
    .blog-content {
        line-height: 1.8;
        color: #333;
    }
    
    .blog-content :global(h2) {
        font-size: 1.8rem;
        margin: 2rem 0 1rem;
        color: #222;
    }
    
    .blog-content :global(h3) {
        font-size: 1.4rem;
        margin: 1.75rem 0 0.75rem;
        color: #333;
    }
    
    .blog-content :global(p) {
        margin-bottom: 1.25rem;
    }
    
    .blog-content :global(ul), 
    .blog-content :global(ol) {
        margin: 1rem 0 1.5rem 1.5rem;
    }
    
    .blog-content :global(li) {
        margin-bottom: 0.5rem;
    }
    
    .blog-content :global(blockquote) {
        border-left: 4px solid #3273dc;
        padding-left: 1rem;
        font-style: italic;
        color: #555;
        margin: 1.5rem 0;
    }
    
    /* Non-highlighted code (inline code) */
    .blog-content :global(code:not([class*="language-"])) {
        background-color: #f5f5f5;
        padding: 0.1rem 0.3rem;
        border-radius: 3px;
        font-family: monospace;
    }
    
    /* These styles will be overridden for syntax highlighted code blocks by prism-theme.css */
    .blog-content :global(pre:not([class*="language-"])) {
        background-color: #f5f5f5;
        padding: 1rem;
        border-radius: 5px;
        overflow-x: auto;
        margin: 1.5rem 0;
    }
    
    .blog-content :global(pre:not([class*="language-"]) code) {
        background-color: transparent;
        padding: 0;
    }
    
    .blog-content :global(a) {
        color: #3273dc;
        text-decoration: none;
    }
    
    .blog-content :global(a:hover) {
        text-decoration: underline;
    }
    
    .blog-content :global(img) {
        max-width: 100%;
        height: auto;
        border-radius: 5px;
        margin: 1.5rem 0;
    }
    
    .blog-footer {
        margin-top: 3rem;
        padding-top: 1.5rem;
        border-top: 1px solid #eee;
    }
    
    .back-link {
        display: inline-block;
        padding: 0.5rem 1rem;
        background-color: #f8f8f8;
        color: #333;
        text-decoration: none;
        border-radius: 4px;
        transition: background-color 0.2s;
    }
    
    .back-link:hover {
        background-color: #efefef;
        text-decoration: none;
    }
    
    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        text-align: center;
    }
    
    .loading-spinner {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #3273dc;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
        margin-bottom: 1rem;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style> 