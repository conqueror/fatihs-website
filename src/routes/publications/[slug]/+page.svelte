<script>
    import { onMount } from 'svelte';
    import DOMPurify from 'isomorphic-dompurify';
    import { browser } from '$app/environment';
    import { marked } from 'marked';
    
    export let data;
    
    const publication = data.publication || {};
    let isLoading = true;
    let hasError = false;
    let sanitizedContent = '';
    
    onMount(() => {
        try {
            console.log('Processing publication content');
            if (publication?.html) {
                // Using pre-rendered HTML from the JSON file
                console.log('Using pre-rendered HTML from JSON file');
                
                // Sanitize the HTML
                if (typeof DOMPurify !== 'undefined') {
                    // Set sanitize options to allow required HTML elements and attributes for code
                    const sanitizeOptions = {
                        ADD_TAGS: ['pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
                        ADD_ATTR: ['class', 'language-*'],
                        ALLOW_DATA_ATTR: true
                    };
                    
                    sanitizedContent = DOMPurify.sanitize(publication.html, sanitizeOptions);
                    console.log('HTML content sanitized successfully');
                } else {
                    // Fallback
                    sanitizedContent = publication.html;
                    console.warn('Using unsanitized content (no DOMPurify available)');
                }
            } else if (publication?.content) {
                // If for some reason we don't have pre-rendered HTML, 
                // fall back to rendering the markdown
                console.log('No pre-rendered HTML found, rendering markdown');
                
                // Configure marked with simpler renderer for code blocks
                const renderer = new marked.Renderer();
                
                // Override code rendering to use simple preformatted blocks without Prism.js
                renderer.code = function(code, language) {
                    // Use language-specific class for better styling
                    const languageClass = language ? ` language-${language}` : '';
                    
                    // Simple rendering with language class for better CSS targeting
                    return `<pre class="code-block${languageClass}"><code class="${languageClass}">${escapeHtml(code)}</code></pre>`;
                };
                
                // Helper function to escape HTML in code blocks
                function escapeHtml(text) {
                    return String(text)
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#039;');
                }
                
                marked.setOptions({
                    renderer: renderer,
                    gfm: true,           // GitHub Flavored Markdown
                    breaks: true,        // Convert \n to <br>
                    headerIds: true      // Add IDs to headers
                });
                
                // Ensure content is properly stringified if it contains objects
                let processedContent = publication.content;
                if (typeof processedContent === 'object') {
                    try {
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
                
                // Double-check to make sure we really have a string now
                if (typeof processedContent !== 'string') {
                    console.warn('Content is still not a string after processing, forcing conversion');
                    processedContent = '' + processedContent; // Force string conversion
                }
                
                // Parse markdown to HTML
                console.log('Parsing markdown content');
                const htmlContent = marked.parse(processedContent);
                
                // Sanitize the HTML
                if (typeof DOMPurify !== 'undefined') {
                    // Set sanitize options to allow required HTML elements and attributes for code
                    const sanitizeOptions = {
                        ADD_TAGS: ['pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
                        ADD_ATTR: ['class', 'language-*'],
                        ALLOW_DATA_ATTR: true
                    };
                    
                    sanitizedContent = DOMPurify.sanitize(htmlContent, sanitizeOptions);
                    console.log('Content sanitized successfully');
                } else {
                    // Fallback
                    sanitizedContent = htmlContent;
                    console.warn('Using unsanitized content (no DOMPurify available)');
                }
            } else {
                console.warn('No publication content available');
                sanitizedContent = '';
            }
        } catch (error) {
            console.error('Error processing publication content:', error);
            hasError = true;
        } finally {
            isLoading = false;
        }
    });
</script>

<svelte:head>
    <title>{publication.title || 'Publication'} | Dr. Fatih Nayebi</title>
    <meta name="description" content={publication.abstract || 'Publication details'} />
</svelte:head>

<div class="container mx-auto px-4 py-12">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        {#if isLoading}
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p>Loading publication...</p>
            </div>
        {:else if hasError}
            <div class="error-container">
                <h1>Error Loading Content</h1>
                <p>Sorry, there was an error loading this publication.</p>
                <a href="/publications" class="back-link svelte-1kqzfjj">← Back to all publications</a>
            </div>
        {:else}
            <div class="publication-header svelte-1kqzfjj">
                <h1 class="svelte-1kqzfjj">{publication.title || 'Untitled Publication'}</h1>
                <div class="publication-meta svelte-1kqzfjj">
                    {#if publication.date}
                        <span class="publication-date svelte-1kqzfjj">{publication.date}</span>
                    {/if}
                    {#if publication.journal}
                        <span class="publication-journal svelte-1kqzfjj">{publication.journal}</span>
                    {/if}
                </div>
                {#if publication.authors}
                    <div class="publication-authors svelte-1kqzfjj">
                        {publication.authors}
                    </div>
                {/if}
            </div>
            
            {#if publication.abstract}
                <div class="publication-abstract svelte-1kqzfjj">
                    <h2 class="svelte-1kqzfjj">Abstract</h2>
                    <p class="svelte-1kqzfjj">{publication.abstract}</p>
                </div>
            {/if}
            
            <div class="publication-content markdown-content svelte-1kqzfjj">
                {@html sanitizedContent || '<p>No content available</p>'}
            </div>
            
            <div class="publication-footer svelte-1kqzfjj">
                <a href="/publications" class="back-link svelte-1kqzfjj">← Back to all publications</a>
            </div>
        {/if}
    </div>
</div>

<style>
    .publication-container {
        max-width: 800px;
        margin: 0 auto;
    }
    
    .publication-header {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid #eee;
    }
    
    h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        line-height: 1.2;
        color: #222;
    }
    
    h2 {
        font-size: 1.8rem;
        margin: 2rem 0 1rem;
        color: #222;
    }

    :global(.dark) h1,
    :global(.dark) h2 {
        color: #fff;
    }
    
    .publication-meta {
        display: flex;
        gap: 1rem;
        color: #666;
        margin-bottom: 0.5rem;
    }
    
    .publication-authors {
        font-style: italic;
        color: #555;
    }

    :global(.dark) .publication-meta,
    :global(.dark) .publication-authors {
        color: #fff;
    }
    
    .publication-abstract {
        margin-bottom: 2rem;
        padding: 1.5rem;
        background-color: #f9f9f9;
        border-left: 4px solid #3273dc;
    }

    :global(.dark) .publication-abstract {
        background-color: #1e293b;
        border-left: 4px solid #4b76c5;
    }

    :global(.dark) .publication-abstract p {
        color: #fff;
    }
    
    .publication-content {
        line-height: 1.8;
        color: #333;
    }

    :global(.dark) .publication-content {
        color: #fff;
    }
    
    /* Markdown styling */
    .markdown-content :global(h1) {
        font-size: 2rem;
        font-weight: 700;
        margin-top: 1.5rem;
        margin-bottom: 1rem;
    }
    
    .markdown-content :global(h2) {
        font-size: 1.5rem;
        font-weight: 600;
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
    }
    
    .markdown-content :global(h3) {
        font-size: 1.25rem;
        font-weight: 600;
        margin-top: 1.25rem;
        margin-bottom: 0.5rem;
    }
    
    .markdown-content :global(p) {
        margin-bottom: 1rem;
    }

    :global(.dark) .markdown-content :global(h1),
    :global(.dark) .markdown-content :global(h2),
    :global(.dark) .markdown-content :global(h3),
    :global(.dark) .markdown-content :global(p),
    :global(.dark) .markdown-content :global(li) {
        color: #fff;
    }
    
    .markdown-content :global(ul), .markdown-content :global(ol) {
        margin-left: 1.5rem;
        margin-bottom: 1rem;
    }
    
    .markdown-content :global(ul) {
        list-style-type: disc;
    }
    
    .markdown-content :global(ol) {
        list-style-type: decimal;
    }
    
    .markdown-content :global(li) {
        margin-bottom: 0.5rem;
    }
    
    .markdown-content :global(pre) {
        background-color: #f5f5f5;
        padding: 1rem;
        border-radius: 5px;
        overflow-x: auto;
        margin: 1rem 0;
        font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
        font-size: 0.9rem;
        line-height: 1.5;
        border: 1px solid #e0e0e0;
    }

    :global(.dark) .markdown-content :global(pre) {
        background-color: #111827;
        border-color: #374151;
    }
    
    .markdown-content :global(code) {
        background-color: #f5f5f5;
        padding: 0.2rem 0.4rem;
        border-radius: 3px;
        font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
        font-size: 0.9rem;
        color: #e83e8c; /* Inline code color */
    }

    :global(.dark) .markdown-content :global(code) {
        background-color: #1e293b;
        color: #f472b6;
    }
    
    .markdown-content :global(pre code) {
        background-color: transparent;
        padding: 0;
        color: #333; /* Reset color for code inside pre blocks */
    }

    :global(.dark) .markdown-content :global(pre code) {
        color: #e2e8f0;
    }
    
    /* Syntax highlighting classes */
    .markdown-content :global(.language-javascript .keyword),
    .markdown-content :global(.language-typescript .keyword),
    .markdown-content :global(.language-python .keyword) {
        color: #0033b3; /* Keywords */
    }
    
    .markdown-content :global(.language-javascript .string),
    .markdown-content :global(.language-typescript .string),
    .markdown-content :global(.language-python .string) {
        color: #067d17; /* Strings */
    }
    
    .markdown-content :global(.language-javascript .comment),
    .markdown-content :global(.language-typescript .comment),
    .markdown-content :global(.language-python .comment) {
        color: #8c8c8c; /* Comments */
        font-style: italic;
    }
    
    :global(.dark) .markdown-content :global(.language-javascript .keyword),
    :global(.dark) .markdown-content :global(.language-typescript .keyword),
    :global(.dark) .markdown-content :global(.language-python .keyword) {
        color: #79b8ff; /* Keywords in dark mode */
    }
    
    :global(.dark) .markdown-content :global(.language-javascript .string),
    :global(.dark) .markdown-content :global(.language-typescript .string),
    :global(.dark) .markdown-content :global(.language-python .string) {
        color: #9ecbff; /* Strings in dark mode */
    }
    
    :global(.dark) .markdown-content :global(.language-javascript .comment),
    :global(.dark) .markdown-content :global(.language-typescript .comment),
    :global(.dark) .markdown-content :global(.language-python .comment) {
        color: #959da5; /* Comments in dark mode */
    }
    
    /* Add support for Shiki highlighting */
    .markdown-content :global(.shiki) {
        background-color: #f5f5f5 !important;
        border-radius: 5px;
        padding: 1rem !important;
        margin: 1rem 0;
        overflow-x: auto;
        font-family: 'Menlo', 'Monaco', 'Courier New', monospace !important;
        font-size: 0.9rem !important;
        line-height: 1.5 !important;
        border: 1px solid #e0e0e0;
    }

    :global(.dark) .markdown-content :global(.shiki) {
        background-color: #111827 !important;
        border-color: #374151;
    }
    
    .markdown-content :global(blockquote) {
        border-left: 4px solid #3273dc;
        padding-left: 1rem;
        font-style: italic;
        margin: 1rem 0;
    }

    :global(.dark) .markdown-content :global(blockquote) {
        border-left-color: #4b76c5;
        color: #fff;
    }
    
    .markdown-content :global(a) {
        color: #3273dc;
        text-decoration: underline;
    }

    :global(.dark) .markdown-content :global(a) {
        color: #60a5fa;
    }
    
    .publication-footer {
        margin-top: 3rem;
        padding-top: 1.5rem;
        border-top: 1px solid #eee;
    }

    :global(.dark) .publication-footer {
        border-top-color: #374151;
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

    :global(.dark) .back-link {
        background-color: #1e293b;
        color: #fff;
    }
    
    .back-link:hover {
        background-color: #efefef;
        text-decoration: none;
    }

    :global(.dark) .back-link:hover {
        background-color: #2d3748;
    }

    .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 200px;
        text-align: center;
    }

    :global(.dark) .loading-container p {
        color: #fff;
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

    :global(.dark) .loading-spinner {
        border-color: #1e293b;
        border-top-color: #4b76c5;
    }
    
    .error-container {
        text-align: center;
        padding: 2rem;
    }

    :global(.dark) .error-container h1,
    :global(.dark) .error-container p {
        color: #fff;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style> 