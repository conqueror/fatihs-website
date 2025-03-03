<script>
    import { onMount } from 'svelte';
    import { fade, fly } from 'svelte/transition';
    import { page } from '$app/stores';
    
    export let data;
    const { researchArea } = data;
    
    let visible = false;
    
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
        </svg>`
    };
</script>

<style>
    /* Custom styling for markdown content */
    .markdown-content :global(h1) {
        font-size: 2rem;
        font-weight: 700;
        margin-top: 1.5rem;
        margin-bottom: 1rem;
        color: #1E3A8A;
    }
    
    .markdown-content :global(h2) {
        font-size: 1.5rem;
        font-weight: 600;
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
        color: #1E3A8A;
    }
    
    .markdown-content :global(h3) {
        font-size: 1.25rem;
        font-weight: 600;
        margin-top: 1.25rem;
        margin-bottom: 0.5rem;
        color: #1E3A8A;
    }
    
    .markdown-content :global(p) {
        margin-bottom: 1rem;
        line-height: 1.6;
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
    
    .markdown-content :global(a) {
        color: #1E3A8A;
        text-decoration: underline;
    }
    
    .markdown-content :global(blockquote) {
        border-left: 4px solid #E5E7EB;
        padding-left: 1rem;
        font-style: italic;
        margin: 1rem 0;
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
</style>

<svelte:head>
    <title>{researchArea.title} | Research | Fatih Nayebi</title>
    <meta name="description" content={researchArea.excerpt || `Details about ${researchArea.title} research by Fatih Nayebi`}>
</svelte:head>

{#if visible}
<div in:fade={{ duration: 800 }} class="py-12 container mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
    <!-- Background decorative elements -->
    <div class="absolute top-20 right-10 opacity-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
    <div class="absolute bottom-40 left-10 opacity-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
    
    <div class="mb-8" in:fly={{ y: -20, duration: 800, delay: 200 }}>
        <a href="/research" class="inline-flex items-center text-primary hover:text-primary-dark transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Research
        </a>
    </div>
    
    <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100" in:fly={{ y: 30, duration: 800, delay: 400 }}>
        <h1 class="text-4xl font-bold mb-6 text-primary flex items-center">
            {#if researchArea.icon && icons[researchArea.icon]}
                {@html icons[researchArea.icon]}
            {/if}
            {researchArea.title}
        </h1>
        
        <div class="flex flex-col md:flex-row justify-between text-sm text-gray-600 mb-6 p-4 bg-gray-50 rounded-lg">
            <span class="mb-2 md:mb-0 font-medium">{researchArea.timeframe}</span>
            <span>Collaborators: {researchArea.collaborators}</span>
        </div>
        
        <div class="markdown-content max-w-none mb-8">
            {@html researchArea.content}
        </div>
        
        <div class="flex flex-wrap gap-3 mt-8">
            {#if researchArea.paperUrl}
                <a href={researchArea.paperUrl} target="_blank" rel="noopener noreferrer" 
                   class="px-4 py-2 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-colors duration-300">
                   <span class="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m2 2v-6a2 2 0 00-2-2h-6" />
                        </svg>
                        Published Paper
                   </span>
                </a>
            {/if}
            
            {#if researchArea.codeUrl}
                <a href={researchArea.codeUrl} target="_blank" rel="noopener noreferrer" 
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
</div>
{/if} 