<script>
    import { onMount } from 'svelte';
    import { fade, fly, scale } from 'svelte/transition';
    import AnimateInView from '$lib/AnimateInView.svelte';
    
    // Access the data loaded in +page.server.js
    export let data;
    const { posts } = data;
    
    let visible = false;
    
    onMount(() => {
        visible = true;
    });
</script>

<svelte:head>
    <title>Blog | Fatih Nayebi</title>
    <meta name="description" content="Thoughts and insights on AI, machine learning, and technology by Fatih Nayebi.">
</svelte:head>

{#if visible}
<div in:fade={{ duration: 800 }} class="py-12 container mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
    <!-- Background decorative elements -->
    <div class="absolute top-20 right-10 opacity-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
    <div class="absolute bottom-40 left-10 opacity-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
    
    <h1 class="text-5xl font-bold mb-4 text-center text-primary" in:fly={{ y: -30, duration: 800, delay: 300 }}>Blog</h1>
    <p class="text-lg text-center mb-12 max-w-3xl mx-auto" in:fly={{ y: 30, duration: 800, delay: 500 }}>
        Thoughts and insights on AI, machine learning, and technology.
    </p>
    
    <div class="space-y-12">
        {#if posts && posts.length > 0}
            {#each posts as post, i}
                <AnimateInView type="scale" delay={300 + (i * 150)}>
                    <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-500 hover:shadow-md">
                        <div class="post-meta flex justify-between items-center mb-4">
                            <span class="post-date text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                                {new Date(post.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                        
                        <h2 class="text-2xl font-semibold mb-3 text-gray-800">{post.title}</h2>
                        <p class="text-lg mb-6 text-gray-600">{post.excerpt}</p>
                        
                        {#if post.tags && post.tags.length > 0}
                            <div class="flex flex-wrap gap-2 mb-6">
                                {#each post.tags as tag, j}
                                    <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm" 
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
            <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <p class="text-lg text-gray-600">No blog posts available yet. Check back soon!</p>
            </div>
        {/if}
    </div>
</div>
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