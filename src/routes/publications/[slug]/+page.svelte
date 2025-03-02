<script>
    export let data;
    const { publication } = data;
</script>

<div class="container">
    <div class="publication-header">
        <h1>{publication.title}</h1>
        
        <div class="publication-meta">
            <div class="publication-authors">
                {#if publication.authors}
                    {publication.authors.join(', ')}
                {:else}
                    Fatih Nayebi
                {/if}
            </div>
            
            <div class="publication-journal">
                {publication.journal || ''}
                {#if publication.date}
                    <span class="publication-date">{new Date(publication.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                    })}</span>
                {/if}
            </div>
            
            {#if publication.doi}
                <div class="publication-doi">
                    DOI: <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer">{publication.doi}</a>
                </div>
            {/if}
        </div>
        
        {#if publication.tags && publication.tags.length > 0}
            <div class="publication-tags">
                {#each publication.tags as tag}
                    <span class="tag">{tag}</span>
                {/each}
            </div>
        {/if}
    </div>
    
    <div class="publication-content">
        {@html publication.content}
    </div>
    
    <div class="publication-footer">
        <a href="/publications" class="back-link">← Back to all publications</a>
    </div>
</div>

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 0;
    }
    
    .publication-header {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid #eee;
    }
    
    h1 {
        font-size: 2.5rem;
        margin-bottom: 1.5rem;
        line-height: 1.2;
    }
    
    .publication-meta {
        margin-bottom: 1.5rem;
    }
    
    .publication-authors {
        font-weight: 500;
        margin-bottom: 0.75rem;
        font-size: 1.1rem;
    }
    
    .publication-journal {
        font-style: italic;
        color: #555;
        margin-bottom: 0.75rem;
    }
    
    .publication-date {
        font-weight: bold;
        margin-left: 0.5rem;
    }
    
    .publication-doi {
        font-size: 0.9rem;
    }
    
    .publication-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .tag {
        background-color: #f0f0f0;
        color: #555;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
    }
    
    .publication-content {
        line-height: 1.8;
        color: #333;
    }
    
    .publication-content :global(h2) {
        font-size: 1.8rem;
        margin: 2rem 0 1rem;
        color: #222;
    }
    
    .publication-content :global(h3) {
        font-size: 1.4rem;
        margin: 1.75rem 0 0.75rem;
        color: #333;
    }
    
    .publication-content :global(p) {
        margin-bottom: 1.25rem;
    }
    
    .publication-content :global(ul), 
    .publication-content :global(ol) {
        margin: 1rem 0 1.5rem 1.5rem;
    }
    
    .publication-content :global(li) {
        margin-bottom: 0.5rem;
    }
    
    .publication-content :global(pre) {
        background-color: #f5f5f5;
        padding: 1rem;
        border-radius: 5px;
        overflow-x: auto;
        margin: 1.5rem 0;
        font-family: monospace;
    }
    
    .publication-content :global(code) {
        font-family: monospace;
    }
    
    .publication-content :global(a) {
        color: #3273dc;
        text-decoration: none;
    }
    
    .publication-content :global(a:hover) {
        text-decoration: underline;
    }
    
    .publication-footer {
        margin-top: 3rem;
        padding-top: 1.5rem;
        border-top: 1px solid #eee;
    }
    
    .back-link {
        color: #3273dc;
        text-decoration: none;
        font-weight: 500;
    }
    
    .back-link:hover {
        text-decoration: underline;
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