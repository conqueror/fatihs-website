<script>
    import { onMount } from 'svelte';
    import { fade, fly, scale } from 'svelte/transition';
    import AnimateInView from '$lib/AnimateInView.svelte';

    let visible = false;

    onMount(() => {
        visible = true;
    });
</script>

<svelte:head>
    <title>Research | Fatih Nayebi</title>
    <meta name="description" content="Explore Fatih Nayebi's research in machine learning, AI, and their applications in various domains.">
</svelte:head>

{#if visible}
<div in:fade={{ duration: 800 }} class="py-12 container mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
    <!-- Background decorative elements -->
    <div class="absolute top-20 right-10 opacity-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
    <div class="absolute bottom-40 left-10 opacity-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
    
    <h1 class="text-5xl font-bold mb-8 text-center text-primary" in:fly={{ y: -30, duration: 800, delay: 300 }}>Research</h1>
    <p class="text-lg text-center mb-12 max-w-3xl mx-auto" in:fly={{ y: 30, duration: 800, delay: 500 }}>
        My research focuses on machine learning, AI, and their applications in various domains.
    </p>
    
    <div class="space-y-12">
        <AnimateInView type="fade" delay={300}>
            <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-500 hover:shadow-md">
                <h3 class="text-2xl font-semibold mb-4 text-primary flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AI for Developer Productivity
                </h3>
                <p class="text-lg mb-6">Investigating how AI can enhance software development workflows and improve developer productivity through intelligent code assistance.</p>
                <div class="flex flex-col md:flex-row justify-between text-sm text-gray-600 mb-6 p-4 bg-gray-50 rounded-lg">
                    <span class="mb-2 md:mb-0 font-medium">2021 - Present</span>
                    <span>Collaborators: Research Team at Anthropic</span>
                </div>
                <div class="flex flex-wrap gap-3">
                    <a href="https://arxiv.org/abs/example-paper-1" target="_blank" rel="noopener noreferrer" 
                       class="px-4 py-2 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-colors duration-300">
                       <span class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m2 2v-6a2 2 0 00-2-2h-6" />
                            </svg>
                            Published Paper
                       </span>
                    </a>
                    <a href="https://github.com/fatihnayebi/ai-dev-tools" target="_blank" rel="noopener noreferrer" 
                       class="px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition-colors duration-300">
                       <span class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            GitHub Repository
                       </span>
                    </a>
                </div>
            </div>
        </AnimateInView>
        
        <AnimateInView type="fly" x={-20} delay={600}>
            <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-500 hover:shadow-md">
                <h3 class="text-2xl font-semibold mb-4 text-primary flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                    Natural Language Processing for Code
                </h3>
                <p class="text-lg mb-6">Exploring how large language models can understand and generate code, with applications in automated code review and documentation.</p>
                <div class="flex flex-col md:flex-row justify-between text-sm text-gray-600 mb-6 p-4 bg-gray-50 rounded-lg">
                    <span class="mb-2 md:mb-0 font-medium">2020 - 2022</span>
                    <span>Collaborators: GitHub Next Research Team</span>
                </div>
                <div class="flex flex-wrap gap-3">
                    <a href="https://arxiv.org/abs/example-paper-2" target="_blank" rel="noopener noreferrer" 
                       class="px-4 py-2 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-colors duration-300">
                       <span class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m2 2v-6a2 2 0 00-2-2h-6" />
                            </svg>
                            Published Paper
                       </span>
                    </a>
                    <a href="https://github.com/fatihnayebi/nlp-code-analysis" target="_blank" rel="noopener noreferrer" 
                       class="px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition-colors duration-300">
                       <span class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            GitHub Repository
                       </span>
                    </a>
                </div>
            </div>
        </AnimateInView>
        
        <AnimateInView type="fly" x={-20} delay={900}>
            <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100 transform transition-all duration-500 hover:shadow-md">
                <h3 class="text-2xl font-semibold mb-4 text-primary flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                    Neural Networks for Time Series Prediction
                </h3>
                <p class="text-lg mb-6">Developed novel neural network architectures optimized for predicting complex time series data in financial markets.</p>
                <div class="flex flex-col md:flex-row justify-between text-sm text-gray-600 mb-6 p-4 bg-gray-50 rounded-lg">
                    <span class="mb-2 md:mb-0 font-medium">2019 - 2021</span>
                    <span>Collaborators: Quantitative Research Group at JPMorgan</span>
                </div>
                <div class="flex flex-wrap gap-3">
                    <a href="https://arxiv.org/abs/example-paper-3" target="_blank" rel="noopener noreferrer" 
                       class="px-4 py-2 bg-primary/10 text-primary rounded-full hover:bg-primary hover:text-white transition-colors duration-300">
                       <span class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v10m2 2v-6a2 2 0 00-2-2h-6" />
                            </svg>
                            Published Paper
                       </span>
                    </a>
                    <a href="https://github.com/fatihnayebi/time-series-nn" target="_blank" rel="noopener noreferrer" 
                       class="px-4 py-2 bg-gray-100 text-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition-colors duration-300">
                       <span class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            GitHub Repository
                       </span>
                    </a>
                </div>
            </div>
        </AnimateInView>
    </div>
</div>
{/if} 