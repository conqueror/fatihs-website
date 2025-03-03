<script>
    import { fade } from 'svelte/transition';
</script>

<div in:fade={{ duration: 800 }} class="max-w-4xl mx-auto py-12 px-4">
    <h1 class="text-4xl font-bold mb-6 text-center text-primary">Research</h1>
    <p class="text-lg text-center mb-12">My research focuses on machine learning, AI, and their applications in various domains.</p>
    
    <div class="space-y-12">
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-2xl font-semibold mb-3 text-primary">AI for Developer Productivity</h3>
            <p class="text-lg mb-4">Investigating how AI can enhance software development workflows and improve developer productivity through intelligent code assistance.</p>
            <div class="flex flex-col md:flex-row justify-between text-sm text-gray-600 mb-4">
                <span class="mb-2 md:mb-0">2021 - Present</span>
                <span>Collaborators: Research Team at Anthropic</span>
            </div>
            <div class="flex flex-wrap gap-3">
                <a href="https://arxiv.org/abs/example-paper-1" target="_blank" rel="noopener noreferrer" 
                   class="text-primary hover:underline">Published Paper</a>
                <a href="https://github.com/fatihnayebi/ai-dev-tools" target="_blank" rel="noopener noreferrer" 
                   class="text-primary hover:underline">GitHub Repository</a>
            </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-2xl font-semibold mb-3 text-primary">Natural Language Processing for Code</h3>
            <p class="text-lg mb-4">Exploring how large language models can understand and generate code, with applications in automated code review and documentation.</p>
            <div class="flex flex-col md:flex-row justify-between text-sm text-gray-600 mb-4">
                <span class="mb-2 md:mb-0">2020 - 2022</span>
                <span>Collaborators: GitHub Next Research Team</span>
            </div>
            <div class="flex flex-wrap gap-3">
                <a href="https://arxiv.org/abs/example-paper-2" target="_blank" rel="noopener noreferrer" 
                   class="text-primary hover:underline">Published Paper</a>
                <a href="https://github.com/fatihnayebi/nlp-code-analysis" target="_blank" rel="noopener noreferrer" 
                   class="text-primary hover:underline">GitHub Repository</a>
            </div>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-2xl font-semibold mb-3 text-primary">Neural Networks for Time Series Prediction</h3>
            <p class="text-lg mb-4">Developed novel neural network architectures optimized for predicting complex time series data in financial markets.</p>
            <div class="flex flex-col md:flex-row justify-between text-sm text-gray-600 mb-4">
                <span class="mb-2 md:mb-0">2019 - 2021</span>
                <span>Collaborators: Quantitative Research Group at JPMorgan</span>
            </div>
            <div class="flex flex-wrap gap-3">
                <a href="https://arxiv.org/abs/example-paper-3" target="_blank" rel="noopener noreferrer" 
                   class="text-primary hover:underline">Published Paper</a>
                <a href="https://github.com/fatihnayebi/time-series-nn" target="_blank" rel="noopener noreferrer" 
                   class="text-primary hover:underline">GitHub Repository</a>
            </div>
        </div>
    </div>
</div> 