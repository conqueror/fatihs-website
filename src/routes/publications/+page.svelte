<script>
    import { onMount } from 'svelte';
    import { fade, fly, scale } from 'svelte/transition';
    import AnimateInView from '$lib/AnimateInView.svelte';
    
    export let data;
    const { publications } = data;
    
    let visible = false;
    
    onMount(() => {
        visible = true;
    });
</script>

<svelte:head>
    <title>Publications | Fatih Nayebi</title>
    <meta name="description" content="Explore Fatih Nayebi's published academic papers, articles, and books on AI, machine learning, and technology.">
</svelte:head>

{#if visible}
<div in:fade={{ duration: 800 }} class="py-12 container mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
    <!-- Background decorative elements -->
    <div class="absolute top-20 right-10 opacity-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
    <div class="absolute bottom-40 left-10 opacity-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
    
    <h1 class="text-5xl font-bold mb-4 text-center text-primary" in:fly={{ y: -30, duration: 800, delay: 300 }}>Publications</h1>
    <p class="text-lg text-center mb-12 max-w-3xl mx-auto" in:fly={{ y: 30, duration: 800, delay: 500 }}>
        A collection of my published academic papers, articles, and books.
    </p>
    
    <div class="space-y-12">
        {#if publications && publications.length > 0}
            {#each publications as publication, i}
                <AnimateInView type="fly" x={-20} delay={300 + (i * 200)}>
                    <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-500 hover:shadow-md">
                        <h2 class="text-2xl font-semibold mb-4 text-primary">{publication.title}</h2>
                        
                        <div class="publication-meta mb-6 pb-4 border-b border-gray-100">
                            <div class="publication-authors text-gray-800 font-medium mb-2">
                                {#if publication.authors}
                                    {publication.authors.join(', ')}
                                {:else}
                                    Fatih Nayebi
                                {/if}
                            </div>
                            
                            <div class="flex flex-wrap justify-between items-center">
                                <div class="publication-journal text-gray-600 italic">
                                    {publication.journal || ''}
                                    {#if publication.date}
                                        <span class="publication-date ml-2 font-semibold">{new Date(publication.date).getFullYear()}</span>
                                    {/if}
                                </div>
                                
                                {#if publication.doi}
                                    <div class="publication-doi mt-2 text-sm">
                                        DOI: <a href={`https://doi.org/${publication.doi}`} 
                                               class="text-primary hover:underline"
                                               target="_blank" rel="noopener noreferrer">{publication.doi}</a>
                                    </div>
                                {/if}
                            </div>
                        </div>
                        
                        <div class="publication-tags flex flex-wrap gap-2 mb-6">
                            {#if publication.tags && publication.tags.length > 0}
                                {#each publication.tags as tag, j}
                                    <span class="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm" 
                                          style="transition-delay: {j * 50}ms">
                                        {tag}
                                    </span>
                                {/each}
                            {/if}
                        </div>
                        
                        <div class="publication-content relative max-h-28 overflow-hidden mb-6">
                            <div class="prose prose-sm max-w-none">
                                {@html publication.content}
                            </div>
                            <div class="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent"></div>
                        </div>
                        
                        <a href={`/publications/${publication.slug}`} 
                           class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300 transform hover:scale-105">
                            <span>View details</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    </div>
                </AnimateInView>
            {/each}
        {:else}
            <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                <p class="text-lg text-gray-600">No publications available yet. Check back soon!</p>
            </div>
        {/if}
    </div>
</div>
{/if}

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 0;
    }
    
    h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
    }
    
    .publication-meta {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .publication-authors {
        font-weight: 500;
    }
    
    .publication-journal {
        font-style: italic;
        color: #666;
    }
    
    .publication-date {
        font-weight: 600;
    }
    
    .publication-content {
        line-height: 1.6;
    }
    
    @media (max-width: 768px) {
        .container {
            padding: 1.5rem 1rem;
        }
        
        h1 {
            font-size: 2rem;
        }
    }
</style> 