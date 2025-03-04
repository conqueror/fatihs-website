<script>
    import { onMount } from 'svelte';
    import DOMPurify from 'dompurify';
    import { storage } from '$lib/utils/storage';
    import { browser } from '$app/environment';
    import SEO from '$lib/components/SEO.svelte';
    import { generateBlogPostSchema } from '$lib/utils/structured-data';
    import { page } from '$app/stores';
    
    export let data;
    // Ensure post is always at least an empty object to prevent undefined errors
    const post = data?.post || {};
    let isLoading = true;
    let hasError = false;
    let sanitizedContent = '';
    let contentContainer;

    // Generate structured data for the blog post
    $: siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://fatihnayebi.com';
    $: blogPostSchema = generateBlogPostSchema(post, siteUrl);
    
    // Prepare SEO metadata
    $: title = post?.title ? `${post.title} | Fatih Nayebi Blog` : 'Blog Post | Fatih Nayebi';
    $: description = post?.excerpt || post?.description || 'Read this insightful blog post by Fatih Nayebi on AI, machine learning, and software development.';
    $: keywords = post?.tags?.join(', ') || 'AI, machine learning, research, blog';
    $: canonical = post?.slug ? `${siteUrl}/blog/${post.slug}` : '';
    $: publishedDate = post?.date || '';
    $: modifiedDate = post?.updatedAt || post?.date || '';
    $: author = post?.author || 'Fatih Nayebi';
    $: ogImage = post?.image ? `${siteUrl}${post.image}` : `${siteUrl}/images/og-image.jpg`;
    $: articleProps = {
        publishedTime: publishedDate,
        modifiedTime: modifiedDate,
        author: author,
        section: 'Technology',
        tags: post?.tags || []
    };

    onMount(() => {
        try {
            if (post?.html) {
                console.log('Processing pre-rendered HTML from blog post');
                
                // Only sanitize if DOMPurify is available (it should be in browser context)
                if (browser && typeof DOMPurify !== 'undefined') {
                    // Set sanitize options to allow classes for code blocks and tables
                    const sanitizeOptions = {
                        ADD_TAGS: ['pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
                        ADD_ATTR: ['class', 'language-*'],
                        ALLOW_DATA_ATTR: true
                    };
                    
                    sanitizedContent = DOMPurify.sanitize(post.html, sanitizeOptions);
                    console.log('HTML content sanitized');
                } else {
                    // Fallback: just use the HTML if DOMPurify is unavailable
                    sanitizedContent = post.html;
                    console.warn('Using unsanitized HTML content (no DOMPurify available)');
                }
            } else if (post?.content) {
                console.log('No pre-rendered HTML found, processing raw content');
                
                // Ensure content is properly stringified if it contains objects
                let processedContent = post.content;
                if (typeof processedContent === 'object') {
                    try {
                        // Try to stringify any objects properly
                        if (processedContent.toString !== Object.prototype.toString) {
                            processedContent = processedContent.toString();
                        } else {
                            processedContent = JSON.stringify(processedContent, null, 2);
                        }
                        console.log('Content was an object, converted to string');
                    } catch (e) {
                        console.error('Failed to stringify content object:', e);
                        processedContent = String(processedContent);
                    }
                }
                
                // Only sanitize if DOMPurify is available (it should be in browser context)
                if (browser && typeof DOMPurify !== 'undefined') {
                    // Set sanitize options to allow classes for code blocks
                    const sanitizeOptions = {
                        ADD_TAGS: ['pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
                        ADD_ATTR: ['class', 'language-*'],
                        ALLOW_DATA_ATTR: true
                    };
                    
                    sanitizedContent = DOMPurify.sanitize(processedContent, sanitizeOptions);
                    console.log('Content sanitized');
                } else {
                    // Fallback: just use the processed content if DOMPurify is unavailable
                    sanitizedContent = processedContent;
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
        }
    });
</script>

<!-- Add SEO component with blog post specific metadata -->
<SEO
    title={title}
    description={description}
    keywords={keywords}
    canonical={canonical}
    type="article"
    structuredData={blogPostSchema}
    article={articleProps}
    openGraph={{
        title: post?.title,
        description: description,
        image: ogImage
    }}
    twitter={{
        title: post?.title,
        description: description,
        image: ogImage
    }}
/>

{#if isLoading}
    <div class="loading-container">
        <div class="loading-spinner"></div>
        <p class="dark:text-white">Loading post...</p>
    </div>
{:else if hasError}
    <div class="error-container">
        <h1 class="dark:text-white">Error Loading Content</h1>
        <p class="dark:text-white">Sorry, there was an error loading this blog post.</p>
        <a href="/blog" class="back-link dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">← Back to all posts</a>
    </div>
{:else if post?.title}
    <div class="container mx-auto px-4 py-12">
        <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div class="blog-header">
                <h1 class="dark:text-white">{post.title}</h1>
                <div class="post-meta">
                    {#if post.date}
                        <span class="post-date dark:text-gray-300">{new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                    {/if}
                    <span class="post-author dark:text-gray-300">By {post.author || 'Dr. Fatih Nayebi'}</span>
                </div>
                
                {#if post.tags && post.tags.length > 0}
                    <div class="post-tags">
                        {#each post.tags as tag}
                            <span class="tag dark:bg-blue-900 dark:text-blue-200">{tag}</span>
                        {/each}
                    </div>
                {/if}
            </div>
            
            <div class="blog-content dark:text-white" bind:this={contentContainer}>
                {@html sanitizedContent || post.content || '<p>No content available</p>'}
            </div>
            
            <div class="blog-footer">
                <a href="/blog" class="back-link dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">← Back to all posts</a>
            </div>
        </div>
    </div>
{:else}
    <div class="error-container">
        <h1 class="dark:text-white">Post Not Found</h1>
        <p class="dark:text-white">Sorry, we couldn't find the blog post you're looking for.</p>
        <a href="/blog" class="back-link dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">← Back to all posts</a>
    </div>
{/if}

<style>
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
    
    /* Code (inline code) */
    .blog-content :global(code) {
        background-color: #f5f5f5;
        padding: 0.1rem 0.3rem;
        border-radius: 3px;
        font-family: monospace;
    }
    
    /* Code blocks */
    .blog-content :global(pre) {
        background-color: #f5f5f5;
        padding: 1rem;
        border-radius: 5px;
        overflow-x: auto;
        margin: 1.5rem 0;
    }
    
    .blog-content :global(pre code) {
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

    /* Add dark mode styles at the end of the style section */
    :global(.dark) .blog-content {
        color: white;
    }

    :global(.dark) .blog-content :global(h2),
    :global(.dark) .blog-content :global(h3),
    :global(.dark) .blog-content :global(p),
    :global(.dark) .blog-content :global(li),
    :global(.dark) .blog-content :global(ul),
    :global(.dark) .blog-content :global(ol) {
        color: white;
    }

    :global(.dark) .blog-content :global(blockquote) {
        color: #e0e0e0;
        border-left-color: #4f83e3;
    }

    :global(.dark) .blog-content :global(code) {
        background-color: #2d3748;
        color: #e2e8f0;
    }

    :global(.dark) .blog-content :global(pre) {
        background-color: #2d3748;
    }

    :global(.dark) .blog-content :global(a) {
        color: #63b3ed;
    }

    :global(.dark) .blog-content :global(a:hover) {
        color: #90cdf4;
    }
</style> 