<script>
    import { onMount } from 'svelte';
    import DOMPurify from 'isomorphic-dompurify';
    import { highlightAll } from '$lib/utils/prism.js';
    
    export let data;
    
    const publication = data.publication;
    const sanitizedContent = DOMPurify.sanitize(publication.content);
    
    onMount(() => {
        highlightAll();
    });
</script>

<svelte:head>
    <title>{publication.title} | Fatih Nayebi</title>
    <meta name="description" content={publication.abstract} />
</svelte:head>

<div class="container mx-auto px-4 py-8">
    <div class="publication-container svelte-1kqzfjj">
        <div class="publication-header svelte-1kqzfjj">
            <h1 class="svelte-1kqzfjj">{publication.title}</h1>
            <div class="publication-meta svelte-1kqzfjj">
                <span class="publication-date svelte-1kqzfjj">{publication.date}</span>
                <span class="publication-journal svelte-1kqzfjj">{publication.journal}</span>
            </div>
            <div class="publication-authors svelte-1kqzfjj">
                {publication.authors}
            </div>
        </div>
        
        <div class="publication-abstract svelte-1kqzfjj">
            <h2 class="svelte-1kqzfjj">Abstract</h2>
            <p class="svelte-1kqzfjj">{publication.abstract}</p>
        </div>
        
        <div class="publication-content svelte-1kqzfjj">
            {@html sanitizedContent}
        </div>
        
        <div class="publication-footer svelte-1kqzfjj">
            <a href="/publications" class="back-link svelte-1kqzfjj">← Back to all publications</a>
        </div>
    </div>
</div>

<style>
    .publication-container {
        max-width: 800px;
        margin: 0 auto;
    }
    
    .publication-header {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid #eee;
    }
    
    h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        line-height: 1.2;
    }
    
    h2 {
        font-size: 1.8rem;
        margin: 2rem 0 1rem;
        color: #222;
    }
    
    .publication-meta {
        display: flex;
        gap: 1rem;
        color: #666;
        margin-bottom: 0.5rem;
    }
    
    .publication-authors {
        font-style: italic;
        color: #555;
    }
    
    .publication-abstract {
        margin-bottom: 2rem;
        padding: 1.5rem;
        background-color: #f9f9f9;
        border-left: 4px solid #3273dc;
    }
    
    .publication-content {
        line-height: 1.8;
        color: #333;
    }
    
    .publication-footer {
        margin-top: 3rem;
        padding-top: 1.5rem;
        border-top: 1px solid #eee;
    }
    
    .back-link {
        display: inline-block;
        padding: 0.5rem 1rem;
        background-color: #f8f8f8;
        color: #333;
        text-decoration: none;
        border-radius: 4px;
        transition: background-color 0.2s;
    }
    
    .back-link:hover {
        background-color: #efefef;
        text-decoration: none;
    }
</style> 