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
    <title>Research | Dr. Fatih Nayebi</title>
    <meta name="description" content="Explore Dr. Fatih Nayebi's research in machine learning, AI, and their applications in various domains.">
</svelte:head>

{#if visible}
<div in:fade={{ duration: 800 }} class="container mx-auto px-4 py-12">
    <div class="mx-auto">
        <!-- Page title -->
        <div class="mb-12 text-center">
            <h1 class="text-4xl md:text-5xl font-bold mb-4 text-primary dark:text-blue-400" in:fly={{ y: -30, duration: 800, delay: 300 }}>Research</h1>
            <p class="text-xl text-gray-600 dark:text-gray-300" in:fly={{ y: 30, duration: 800, delay: 500 }}>My academic contributions and research interests</p>
        </div>
        
        <!-- Research sections -->
        <div class="space-y-16">
            <!-- Research interests -->
            <AnimateInView type="fade" delay={300}>
                <section>
                    <h2 class="text-3xl font-bold mb-6 text-primary dark:text-blue-400 border-b pb-2 border-primary/20 dark:border-blue-500/30">Research Interests</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {#each [
                            {
                                title: "Artificial Intelligence & Machine Learning",
                                desc: "Deep learning, neural networks, and advanced prediction models for business decision-making.",
                                icon: "brain"
                            },
                            {
                                title: "Data Science & Analytics",
                                desc: "Advanced analytics workflows, statistical methods, and data-driven strategy development.",
                                icon: "chart"
                            },
                            {
                                title: "Big Data Architecture",
                                desc: "Designing scalable data pipelines and analytics infrastructure for enterprise applications.",
                                icon: "server"
                            },
                            {
                                title: "Software Engineering",
                                desc: "Software metrics, development methodologies, and effort estimation models.",
                                icon: "code"
                            }
                        ] as interest, i}
                            <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1" style="transition-delay: {i * 100}ms">
                                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">{interest.title}</h3>
                                <p class="text-gray-600 dark:text-gray-300">{interest.desc}</p>
                            </div>
                        {/each}
                    </div>
                </section>
            </AnimateInView>
            
            <!-- Current research -->
            <AnimateInView type="fly" x={-20} delay={500}>
                <section>
                    <h2 class="text-3xl font-bold mb-6 text-primary dark:text-blue-400 border-b pb-2 border-primary/20 dark:border-blue-500/30">Current Research</h2>
                    <div class="space-y-6">
                        {#each [
                            {
                                title: "AI-Driven Decision Support Systems",
                                desc: "Developing frameworks for integrating AI capabilities into business decision-making processes, with a focus on interpretability and actionable insights.",
                                tags: ["AI", "Decision Support", "Business Intelligence"]
                            },
                            {
                                title: "Multi-Modal Deep Learning for Retail Applications",
                                desc: "Exploring how deep learning models can integrate visual, textual, and behavioral data to enhance customer experience and operational efficiency in retail environments.",
                                tags: ["Deep Learning", "Computer Vision", "NLP", "Retail"]
                            },
                            {
                                title: "Responsible AI Governance Frameworks",
                                desc: "Researching and developing governance models that ensure ethical implementation of AI in enterprise contexts, with particular emphasis on transparency, fairness, and accountability.",
                                tags: ["AI Ethics", "Governance", "Enterprise AI"]
                            }
                        ] as project, i}
                            <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1" style="transition-delay: {i * 150}ms">
                                <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{project.title}</h3>
                                <p class="text-gray-600 dark:text-gray-300 mb-4">{project.desc}</p>
                                <div class="flex flex-wrap gap-2">
                                    {#each project.tags as tag, j}
                                        <span class="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-sm rounded-full" style="transition-delay: {j * 50}ms">{tag}</span>
                                    {/each}
                                </div>
                            </div>
                        {/each}
                    </div>
                </section>
            </AnimateInView>
            
            <!-- Past research projects -->
            <AnimateInView type="fly" x={20} delay={700}>
                <section>
                    <h2 class="text-3xl font-bold mb-6 text-primary dark:text-blue-400 border-b pb-2 border-primary/20 dark:border-blue-500/30">Past Research Projects</h2>
                    <div class="space-y-6">
                        {#each [
                            {
                                title: "Mobile Application Usability Evaluation",
                                desc: "Developed and validated a comprehensive framework for evaluating iOS application usability, incorporating both expert-based heuristics and user-centered metrics.",
                                year: "2014-2015",
                                outcome: "Published in international journals and contributed to industry standards for mobile UX evaluation."
                            },
                            {
                                title: "Software Effort Estimation Models",
                                desc: "Researched and created algorithms for automated selection of software effort estimation models based on project characteristics, accuracy requirements, and uncertainty tolerance.",
                                year: "2012-2014",
                                outcome: "Implemented in enterprise project management systems, resulting in 28% improvement in estimation accuracy."
                            },
                            {
                                title: "Functional Programming Paradigms in Mobile Development",
                                desc: "Investigated the application of functional programming concepts in Swift for iOS development, focusing on code quality, maintainability, and developer productivity.",
                                year: "2015-2016",
                                outcome: "Published two books on Swift Functional Programming that have been adopted in university curricula and professional training programs."
                            }
                        ] as project, i}
                            <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1" style="transition-delay: {i * 150}ms">
                                <div class="flex flex-col md:flex-row md:items-start justify-between">
                                    <div class="md:w-3/4">
                                        <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">{project.title}</h3>
                                        <p class="text-gray-600 dark:text-gray-300 mb-3">{project.desc}</p>
                                        <p class="text-gray-700 dark:text-gray-200 font-medium">Outcome: <span class="font-normal text-gray-600 dark:text-gray-300">{project.outcome}</span></p>
                                    </div>
                                    <div class="md:w-1/4 md:text-right mt-4 md:mt-0">
                                        <span class="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full text-sm font-medium">{project.year}</span>
                                    </div>
                                </div>
                            </div>
                        {/each}
                    </div>
                </section>
            </AnimateInView>
        </div>
    </div>
</div>
{/if} 