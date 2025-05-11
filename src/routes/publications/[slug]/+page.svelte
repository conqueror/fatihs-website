<script>
    import { onMount } from 'svelte';
    import DOMPurify from 'isomorphic-dompurify';
    import { browser } from '$app/environment';
    import { marked } from 'marked';
    import SEO from '$lib/components/seo/SEO.svelte';
    import { generatePublicationSchema } from '$lib/utils/structured-data';
    import { page } from '$app/stores';
    import PageContainer from '$lib/components/layout/PageContainer.svelte';
    import { fade, fly } from 'svelte/transition';
    
    export let data;
    
    const publication = data.publication || {};
    let isLoading = true;
    let hasError = false;
    let sanitizedContent = '';
    let visible = false;
    
    // Generate structured data for the publication
    $: siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://fatihnayebi.com';
    $: publicationSchema = generatePublicationSchema(publication, siteUrl);
    
    // Prepare SEO metadata
    $: title = publication?.title ? `${publication.title} | Fatih Nayebi Publications` : 'Research Publication | Fatih Nayebi';
    $: description = publication?.abstract || 'Research publication by Fatih Nayebi on topics in AI, machine learning, and computational research.';
    $: keywords = `publication, research, ${publication?.journal || ''}, ${publication?.authors || 'Fatih Nayebi'}, academic paper`;
    $: canonical = publication?.slug ? `${siteUrl}/publications/${publication.slug}` : '';
    $: ogImage = publication?.image ? `${siteUrl}${publication.image}` : `${siteUrl}/images/publication-og.jpg`;
    
    onMount(() => {
        try {
            console.log('Processing publication content');
            if (publication?.content) {
                // Check if content is already HTML (starts with <)
                if (publication.content.trim().startsWith('<')) {
                    console.log('Content appears to be HTML');
                    // Sanitize the HTML
                    if (typeof DOMPurify !== 'undefined') {
                        // Set sanitize options to allow required HTML elements and attributes for code
                        const sanitizeOptions = {
                            ADD_TAGS: ['pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
                            ADD_ATTR: ['class', 'language-*'],
                            ALLOW_DATA_ATTR: true
                        };
                        
                        sanitizedContent = DOMPurify.sanitize(publication.content, sanitizeOptions);
                        console.log('HTML content sanitized successfully');
                    } else {
                        // Fallback
                        sanitizedContent = publication.content;
                        console.warn('DOMPurify not available, using raw HTML (not recommended)');
                    }
                } else {
                    // Content is markdown, parse it
                    console.log('Content appears to be markdown, parsing...');
                    const rawHtml = marked.parse(publication.content);
                    
                    // Sanitize the parsed HTML
                    if (typeof DOMPurify !== 'undefined') {
                        const sanitizeOptions = {
                            ADD_TAGS: ['pre', 'code', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
                            ADD_ATTR: ['class', 'language-*'],
                            ALLOW_DATA_ATTR: true
                        };
                        
                        sanitizedContent = DOMPurify.sanitize(rawHtml, sanitizeOptions);
                        console.log('Markdown parsed and sanitized successfully');
                    } else {
                        sanitizedContent = rawHtml;
                        console.warn('DOMPurify not available, using parsed HTML without sanitization (not recommended)');
                    }
                }
            } else {
                console.log('No content available for this publication');
            }
            
            isLoading = false;
            visible = true;
        } catch (error) {
            console.error('Error processing publication content:', error);
            hasError = true;
            isLoading = false;
            visible = true;
        }
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
    title="{publication ? `${publication.title} | Publications` : 'Publication'} | Fatih Nayebi"
    description={publication?.abstract || "Details about a publication by Fatih Nayebi."}
    keywords={publication?.keywords?.join(', ') || "research, publication, academic"}
    canonical={publication ? `https://fatihnayebi.com/publications/${publication.slug}` : undefined}
    type="article"
    structuredData={publicationSchema}
    openGraph={{
        title: publication ? `${publication.title} | Publications` : 'Publication',
        description: publication?.abstract || "Details about a publication by Fatih Nayebi.",
        url: `https://fatihnayebi.com/publications/${publication?.slug}`,
        type: 'article',
        article: {
            publishedTime: publication?.date,
            tags: publication?.tags || publication?.keywords
        }
    }}
    twitter={{
        card: 'summary_large_image',
        title: publication ? publication.title : 'Publication',
        description: publication?.abstract || "Details about a publication by Fatih Nayebi."
    }}
/>

{#if !publication}
    <PageContainer>
        <div class="text-center">
            <h1 class="text-3xl font-bold mb-4">Publication Not Found</h1>
            <p class="mb-8">The publication you're looking for could not be found.</p>
            <a href="/publications" class="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Back to Publications
            </a>
        </div>
    </PageContainer>
{:else if visible}
    <PageContainer>
        <!-- Background decorative elements -->
        <div class="absolute top-20 right-10 -z-10 opacity-10 w-64 h-64 bg-primary-600/30 dark:bg-primary-400/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-40 left-20 -z-10 opacity-10 w-96 h-96 bg-indigo-400/30 dark:bg-indigo-300/5 rounded-full blur-3xl"></div>
        
        <!-- Breadcrumb -->
        <div class="mb-4" in:fly={{ y: -30, duration: 500 }}>
            <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <a href="/" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</a>
                <svg class="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
                <a href="/publications" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Publications</a>
                <svg class="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
                <span class="text-gray-800 dark:text-gray-300 truncate max-w-[180px] sm:max-w-none">{publication.title}</span>
            </div>
        </div>
        
        <!-- Publication Header -->
        <div class="mb-8">
            <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white leading-tight" in:fly={{ y: 20, duration: 500, delay: 200 }}>
                {publication.title}
            </h1>
            
            <!-- Publication Metadata -->
            <div class="flex flex-wrap gap-y-3 gap-x-6 mb-6" in:fly={{ y: 20, duration: 500, delay: 300 }}>
                {#if publication.authors}
                    <div class="flex items-center text-gray-700 dark:text-gray-300 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{publication.authors}</span>
                    </div>
                {/if}
                
                {#if publication.date}
                    <div class="flex items-center text-gray-700 dark:text-gray-300 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDate(publication.date)}</span>
                    </div>
                {/if}
                
                {#if publication.venue || publication.journal}
                    <div class="flex items-center text-gray-700 dark:text-gray-300 text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>{publication.venue || publication.journal}</span>
                    </div>
                {/if}
            </div>
            
            <!-- Publication Types -->
            {#if publication.type}
                <div class="mb-6" in:fly={{ y: 20, duration: 500, delay: 400 }}>
                    <span class="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-medium">
                        {publication.type}
                    </span>
                </div>
            {/if}
        </div>
        
        <!-- Main Content -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 mb-10 w-full" in:fly={{ y: 30, duration: 500, delay: 500 }}>
            {#if isLoading}
                <div class="flex justify-center items-center py-12">
                    <div class="loading-spinner"></div>
                </div>
            {:else if hasError}
                <div class="text-center py-12 text-red-600 dark:text-red-400">
                    <p>There was an error loading this publication's content.</p>
                </div>
            {:else}
                <!-- Abstract Section -->
                {#if publication.abstract}
                    <div class="mb-10">
                        <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Abstract</h2>
                        <div class="prose dark:prose-invert max-w-none w-full text-gray-700 dark:text-gray-300">
                            <p>{publication.abstract}</p>
                        </div>
                    </div>
                {/if}
                
                <!-- Publication Details -->
                {#if sanitizedContent}
                    <div class="markdown-content prose dark:prose-invert max-w-none w-full mb-10 text-gray-800 dark:text-gray-200">
                        {@html sanitizedContent}
                    </div>
                {/if}
                
                <!-- Citation -->
                {#if publication.citation}
                    <div class="mt-8 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                        <h2 class="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">Citation</h2>
                        <div class="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                            <pre class="whitespace-pre-wrap break-words text-sm text-gray-800 dark:text-gray-200 font-mono">{publication.citation}</pre>
                        </div>
                    </div>
                {/if}
            {/if}
        </div>
        
        <!-- Links Section -->
        {#if publication.pdf || publication.doi || publication.code || publication.demo}
            <div class="mb-10" in:fly={{ y: 30, duration: 500, delay: 600 }}>
                <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Resources</h2>
                <div class="flex flex-wrap gap-4">
                    {#if publication.pdf}
                        <a href={publication.pdf} target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            PDF
                        </a>
                    {/if}
                    
                    {#if publication.doi}
                        <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.172 13.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
                            </svg>
                            DOI
                        </a>
                    {/if}
                    
                    {#if publication.code}
                        <a href={publication.code} target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            Code
                        </a>
                    {/if}
                    
                    {#if publication.demo}
                        <a href={publication.demo} target="_blank" rel="noopener noreferrer" class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Demo
                        </a>
                    {/if}
                </div>
            </div>
        {/if}
        
        <!-- Navigation Link -->
        <div class="text-center" in:fly={{ y: 30, duration: 500, delay: 700 }}>
            <a href="/publications" class="inline-block text-primary-600 dark:text-primary-400 hover:underline">
                ← Back to All Publications
            </a>
        </div>
    </PageContainer>
{/if}

<style>
    /* Custom styling for markdown content */
    .markdown-content :global(h1) {
        font-size: 2rem;
        font-weight: 700;
        margin-top: 1.5rem;
        margin-bottom: 1rem;
        color: var(--heading-color, #1a202c);
    }
    
    .markdown-content :global(h2) {
        font-size: 1.5rem;
        font-weight: 700;
        margin-top: 1.25rem;
        margin-bottom: 0.75rem;
        color: var(--heading-color, #1a202c);
    }
    
    .markdown-content :global(h3) {
        font-size: 1.25rem;
        font-weight: 600;
        margin-top: 1rem;
        margin-bottom: 0.5rem;
        color: var(--heading-color, #1a202c);
    }
    
    .markdown-content :global(h4) {
        font-size: 1.15rem;
        font-weight: 600;
        margin-top: 1rem;
        margin-bottom: 0.25rem;
        color: var(--heading-color, #1a202c);
    }
    
    .markdown-content :global(p) {
        margin-bottom: 0.75rem;
        line-height: 1.6;
    }
    
    .markdown-content :global(ul), .markdown-content :global(ol) {
        margin-left: 1.5rem;
        margin-bottom: 0.75rem;
    }
    
    .markdown-content :global(li) {
        margin-bottom: 0.25rem;
    }
    
    .markdown-content :global(blockquote) {
        border-left: 4px solid #E5E7EB;
        padding-left: 1rem;
        font-style: italic;
        margin: 0.75rem 0;
    }
    
    .markdown-content :global(code) {
        background-color: #F3F4F6;
        padding: 0.2rem 0.4rem;
        border-radius: 0.25rem;
        font-family: monospace;
    }
    
    .markdown-content :global(pre) {
        background-color: #F3F4F6;
        padding: 1rem;
        border-radius: 0.25rem;
        overflow-x: auto;
        margin: 1rem 0;
    }
    
    /* Dark mode adjustments */
    :global(.dark) .markdown-content :global(blockquote) {
        border-left-color: #4B5563;
    }
    
    :global(.dark) .markdown-content :global(code), 
    :global(.dark) .markdown-content :global(pre) {
        background-color: #374151;
    }
    
    /* Publication metadata styling */
    .publication-date {
        font-size: 0.875rem;
        color: #6B7280;
    }
    
    .publication-venue {
        font-style: italic;
    }
    
    .publication-authors {
        font-weight: 500;
    }
    
    /* Loading and error states */
    .loading-spinner {
        border: 4px solid rgba(0, 0, 0, 0.1);
        border-left-color: #3B82F6;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style> 