<script>
    import { onMount } from 'svelte';
    import { fade, fly, scale } from 'svelte/transition';
    import AnimateInView from '$lib/components/ui/AnimateInView.svelte';

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
<div in:fade={{ duration: 800 }} class="container mx-auto px-4 pt-24 md:pt-32 pb-12">
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
                                desc: "Deep learning, gradient boosting, and reinforcement learning for advanced predictive and prescriptive modelling that can be used for business decision-making.",
                                icon: "brain"
                            },
                            {
                                title: "Data Science & Analytics",
                                desc: "Advanced analytics workflows, statistical methods, and data-driven strategy development.",
                                icon: "chart"
                            },
                            {
                                title: "Agentic AI",
                                desc: "Designing and deploying agentic AI systems for decision-making and problem-solving.",
                                icon: "server"
                            },
                            {
                                title: "Software Engineering",
                                desc: "Software metrics, development methodologies, mining software repositories, defect prediction, and effort estimation models.",
                                icon: "code"
                            }
                        ] as interest, i}
                            <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1" style="transition-delay: {i * 100}ms">
                                <h3 class="text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100 flex items-center">
                                    <span class="inline-flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-blue-100/70 dark:bg-blue-900/30 text-primary dark:text-blue-400 transition-all duration-300 group-hover:scale-110">
                                        {#if interest.icon === "brain"}
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-1.04Z"></path>
                                                <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-1.04Z"></path>
                                            </svg>
                                        {:else if interest.icon === "chart"}
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M3 3v18h18"></path>
                                                <path d="m19 9-5 5-4-4-3 3"></path>
                                            </svg>
                                        {:else if interest.icon === "server"}
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M5 9c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v1c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V9Z"></path>
                                                <path d="M5 14c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v1c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2v-1Z"></path>
                                                <path d="M6 18h12"></path>
                                                <path d="M6 6h12"></path>
                                            </svg>
                                        {:else if interest.icon === "code"}
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="m18 16 4-4-4-4"></path>
                                                <path d="m6 8-4 4 4 4"></path>
                                                <path d="m14.5 4-5 16"></path>
                                            </svg>
                                        {/if}
                                    </span>
                                    {interest.title}
                                </h3>
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
                                tags: ["AI", "Decision Support", "Business Intelligence"],
                                icon: "lightbulb"
                            },
                            {
                                title: "Multi-Modal Deep Learning for Retail Applications",
                                desc: "Exploring how deep learning models can integrate visual, textual, and behavioral data to enhance customer experience and operational efficiency in retail environments.",
                                tags: ["Deep Learning", "Computer Vision", "NLP", "Retail"],
                                icon: "eye"
                            },
                            {
                                title: "Responsible & Ethical AI Governance Frameworks",
                                desc: "Researching and developing governance models that ensure ethical implementation of AI in enterprise contexts, with particular emphasis on transparency, fairness, and accountability.",
                                tags: ["AI Ethics", "Governance", "Enterprise AI"],
                                icon: "shield"
                            }
                        ] as project, i}
                            <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group" style="transition-delay: {i * 150}ms">
                                <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100 flex items-center">
                                    <span class="inline-flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-blue-100/70 dark:bg-blue-900/30 text-primary dark:text-blue-400 transition-all duration-300 group-hover:scale-110">
                                        {#if project.icon === "lightbulb"}
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M12 2v1"></path>
                                                <path d="M12 16v1"></path>
                                                <path d="M4.93 4.93l.7.7"></path>
                                                <path d="M18.36 18.36l.7.7"></path>
                                                <path d="M2 12h1"></path>
                                                <path d="M21 12h1"></path>
                                                <path d="M4.93 19.07l.7-.7"></path>
                                                <path d="M18.36 5.64l.7-.7"></path>
                                                <path d="M9 16a5 5 0 1 1 6 0 3.5 3.5 0 0 0-1 3 2 2 0 0 1-4 0 3.5 3.5 0 0 0-1-3"></path>
                                                <path d="M9.8 20.4a1.94 1.94 0 0 0 4.4 0"></path>
                                            </svg>
                                        {:else if project.icon === "eye"}
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                                <circle cx="12" cy="12" r="3"></circle>
                                            </svg>
                                        {:else if project.icon === "shield"}
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                                                <path d="m9 12 2 2 4-4"></path>
                                            </svg>
                                        {/if}
                                    </span>
                                    {project.title}
                                </h3>
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
                                title: "Human-Computer Interaction & Machine Learning",
                                desc: "Researched and created a bayesian machine learning model to predict success of mobile apps based on a developed and validated comprehensive framework for evaluating iOS application usability, incorporating both expert-based heuristics and user-centered metrics.",
                                year: "2014-2015",
                                outcome: "Published in international journals and contributed to industry standards for mobile UX evaluation.",
                                icon: "smartphone"
                            },
                            {
                                title: "Machine Learning for Software Effort Estimation",
                                desc: "Researched and created algorithms for automated selection of software effort estimation models based on project characteristics, accuracy requirements, and uncertainty tolerance.",
                                year: "2012-2014",
                                outcome: "Published in Artificial Intelligence Journal",
                                icon: "calculator"
                            },
                            {
                                title: "Functional Programming Paradigms",
                                desc: "Investigated the application of functional programming concepts in Swift for iOS development, focusing on code quality, maintainability, and developer productivity.",
                                year: "2015-2016",
                                outcome: "Published two books on Swift Functional Programming that have been adopted in university curricula and professional training programs.",
                                icon: "function-square"
                            }
                        ] as project, i}
                            <div class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 group" style="transition-delay: {i * 150}ms">
                                <div class="flex flex-col md:flex-row md:items-start justify-between">
                                    <div class="md:w-3/4">
                                        <h3 class="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100 flex items-center">
                                            <span class="inline-flex items-center justify-center w-8 h-8 mr-3 rounded-full bg-blue-100/70 dark:bg-blue-900/30 text-primary dark:text-blue-400 transition-all duration-300 group-hover:scale-110">
                                                {#if project.icon === "smartphone"}
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                        <rect width="14" height="20" x="5" y="2" rx="2" ry="2"></rect>
                                                        <path d="M12 18h.01"></path>
                                                    </svg>
                                                {:else if project.icon === "calculator"}
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                        <rect width="16" height="20" x="4" y="2" rx="2"></rect>
                                                        <line x1="8" x2="16" y1="6" y2="6"></line>
                                                        <line x1="16" x2="16" y1="14" y2="18"></line>
                                                        <path d="M8 14h.01"></path>
                                                        <path d="M12 14h.01"></path>
                                                        <path d="M8 18h.01"></path>
                                                        <path d="M12 18h.01"></path>
                                                    </svg>
                                                {:else if project.icon === "function-square"}
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                                                        <path d="M9 17c2 0 2.8-1 2.8-2.8V10c0-2 1-3 3-3"></path>
                                                        <path d="M9 11.2h5.7"></path>
                                                    </svg>
                                                {/if}
                                            </span>
                                            {project.title}
                                        </h3>
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