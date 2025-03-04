<script>
    import { onMount } from 'svelte';
    import { fade, fly, scale } from 'svelte/transition';
    import AnimateInView from '$lib/AnimateInView.svelte';

    let visible = false;
    export let data;
    const researchAreas = data.researchAreas;

    onMount(() => {
        visible = true;
    });

    // Map of icon names to their SVG content
    const icons = {
        lightbulb: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>`,
        code: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>`,
        chart: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>`,
        eye: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>`
    };
</script>

<svelte:head>
    <title>Research | Fatih Nayebi</title>
    <meta name="description" content="Explore Fatih Nayebi's research in machine learning, AI, and their applications in various domains.">
</svelte:head>

{#if visible}
<div in:fade={{ duration: 800 }} class="py-12 relative z-0">
    <!-- Background decorative elements -->
    <div class="absolute top-20 right-10 opacity-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
    <div class="absolute bottom-40 left-10 opacity-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
    
    <h1 class="text-5xl font-bold mb-8 text-center text-primary" in:fly={{ y: -30, duration: 800, delay: 300 }}>Research</h1>
    <p class="text-lg text-center mb-12 max-w-3xl mx-auto" in:fly={{ y: 30, duration: 800, delay: 500 }}>
        My research focuses on machine learning, AI, and their applications in various domains.
    </p>
    
    <div class="space-y-12">
        {#each researchAreas as area, index}
            <AnimateInView type={index === 0 ? "fade" : "fly"} x={index === 0 ? 0 : -20} delay={300 + (index * 300)}>
                <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-500 hover:shadow-md">
                    <h3 class="text-2xl font-semibold mb-4 text-primary flex items-center">
                        {#if area.icon && icons[area.icon]}
                            {@html icons[area.icon]}
                        {/if}
                        {area.title}
                    </h3>
                    
                    <!-- Truncated content with gradient fade-out -->
                    <div class="relative max-h-28 overflow-hidden mb-6">
                        <div class="prose prose-primary max-w-none">
                            {@html area.content}
                        </div>
                        <div class="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white to-transparent"></div>
                    </div>
                    
                    <div class="flex flex-col md:flex-row justify-between text-sm text-gray-600 mb-6 p-4 bg-gray-50 rounded-lg">
                        <span class="mb-2 md:mb-0 font-medium">{area.timeframe}</span>
                        <span>Collaborators: {area.collaboratorsDisplay || (Array.isArray(area.collaborators) ? area.collaborators.join(', ') : area.collaborators)}</span>
                    </div>
                    
                    <div class="flex flex-wrap gap-3">
                        <a href={`/research/${area.slug}`} 
                           class="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300 transform hover:scale-105">
                            <span>View details</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                        
                        {#if area.paperUrl}
                            <a href={area.paperUrl} target="_blank" rel="noopener noreferrer" 
                               class="px-4 py-2 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-colors duration-300">
                               <span class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m2 2v-6a2 2 0 00-2-2h-6" />
                                    </svg>
                                    Published Paper
                               </span>
                            </a>
                        {/if}
                        
                        {#if area.codeUrl}
                            <a href={area.codeUrl} target="_blank" rel="noopener noreferrer" 
                               class="px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition-colors duration-300">
                               <span class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                    GitHub Repository
                               </span>
                            </a>
                        {/if}
                    </div>
                </div>
            </AnimateInView>
        {/each}
    </div>
</div>
{/if} 