<script>
    import { onMount } from 'svelte';
    import AnimateInView from '$lib/components/ui/AnimateInView.svelte';
    import { browser } from '$app/environment';
    import { fade, fly } from 'svelte/transition';
    import PageContainer from '$lib/components/layout/PageContainer.svelte';
    import { jsonLdToString } from '$lib/utils/structured-data';
    
    // Access the data loaded in +page.js
    export let data;
    const { blogPosts } = data;
    
    let visible = false;
    
    // Generate structured data for blog list
    const getBlogListSchema = () => {
        return {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            'name': 'Retail AI & Agentic Systems Blog | Dr. Fatih Nayebi',
            'description': 'Articles and insights on AI for Retail, Agentic AI systems, and data science applications by Dr. Fatih Nayebi',
            'mainEntity': {
                '@type': 'ItemList',
                'itemListElement': blogPosts.map((post, index) => ({
                    '@type': 'ListItem',
                    'position': index + 1,
                    'item': {
                        '@type': 'BlogPosting',
                        'headline': post.title,
                        'author': {
                            '@type': 'Person',
                            'name': 'Fatih Nayebi',
                            'jobTitle': 'VP of Data & AI',
                            'affiliation': 'ALDO Group'
                        },
                        'datePublished': post.date,
                        'description': post.excerpt,
                        'keywords': post.tags ? post.tags.join(', ') : '',
                        'url': `https://fatihnayebi.com/blog/${post.slug}`
                    }
                }))
            }
        };
    };
    
    onMount(() => {
        visible = true;
    });
</script>

<svelte:head>
    <title>Retail AI & Agentic Systems Blog | Dr. Fatih Nayebi</title>
    <meta name="description" content="Insights and analysis on AI for Retail, Agentic AI systems, machine learning applications, inventory optimization, and retail technology innovation.">
    <meta name="keywords" content="Retail AI blog, Agentic AI insights, inventory optimization, AI ethics, retail machine learning, assortment planning, Fatih Nayebi">
    
    <!-- Open Graph -->
    <meta property="og:title" content="Retail AI & Agentic Systems Blog | Dr. Fatih Nayebi">
    <meta property="og:description" content="Expert insights on AI for Retail, Agentic AI systems, and retail technology innovation from Dr. Fatih Nayebi, VP of Data & AI at ALDO Group.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://fatihnayebi.com/blog">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Retail AI & Agentic Systems Blog | Dr. Fatih Nayebi">
    <meta name="twitter:description" content="Expert insights on AI for Retail, Agentic AI systems, and retail technology innovation.">
    
    <!-- Structured data for blog collection -->
    {#if blogPosts && blogPosts.length > 0}
        {@html jsonLdToString(getBlogListSchema())}
    {/if}
</svelte:head>

{#if visible}
<PageContainer heroSection={true}>
    <!-- Background decorative elements -->
    <div class="absolute top-20 right-10 opacity-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
    <div class="absolute bottom-40 left-10 opacity-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
    
    <h1 class="text-5xl font-bold mb-4 text-center text-primary" in:fly={{ y: -30, duration: 800, delay: 300 }}>Retail AI & Agentic Systems Insights</h1>
    <p class="text-lg text-center mb-12 max-w-3xl mx-auto text-gray-700 dark:text-white" in:fly={{ y: 30, duration: 800, delay: 500 }}>
        Expert perspectives on AI for retail innovation, inventory optimization, assortment planning, and autonomous agentic systems that are transforming the retail industry.
    </p>
    
    <div class="space-y-12">
        {#if blogPosts && blogPosts.length > 0}
            {#each blogPosts as post, i}
                <AnimateInView type="fly" x={-20} delay={300 + (i * 150)}>
                    <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transform transition-all duration-300 hover:shadow-md hover:-translate-y-1" style="transition-delay: {i * 150}ms">
                        <div class="post-meta flex justify-between items-center mb-4">
                            <span class="post-date text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 px-3 py-1 rounded-full">
                                {new Date(post.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                        
                        <h2 class="text-2xl font-semibold mb-3 text-gray-800 dark:text-white">{post.title}</h2>
                        <p class="text-lg mb-6 text-gray-600 dark:text-white">{post.excerpt}</p>
                        
                        {#if post.tags && post.tags.length > 0}
                            <div class="flex flex-wrap gap-2 mb-6">
                                {#each post.tags as tag, j}
                                    <span class="bg-primary/10 text-primary dark:bg-blue-900/50 dark:text-blue-300 px-3 py-1 rounded-full text-sm" 
                                          style="transition-delay: {j * 50}ms">
                                        {tag}
                                    </span>
                                {/each}
                            </div>
                        {/if}
                        
                        <a href={`/blog/${post.slug}`} 
                            class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300 transform hover:scale-105">
                            <span>Read article</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    </div>
                </AnimateInView>
            {/each}
        {:else}
            <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                <p class="text-lg text-gray-600 dark:text-white">No blog posts available yet. Check back soon!</p>
            </div>
        {/if}
    </div>
</PageContainer>
{/if}

<style>
    h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }
    
    .post-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
    }
    
    .post-date {
        color: #666;
        font-size: 0.9rem;
    }
    
    @media (max-width: 768px) {
        h1 {
            font-size: 2rem;
        }
        
        .post-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
    }
</style> 