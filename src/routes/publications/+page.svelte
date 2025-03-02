<script>
    export let data;
    const { publications } = data;
</script>

<div class="container">
    <h1>Publications</h1>
    <p>A collection of my published academic papers, articles, and books.</p>
    
    <div class="publications-list">
        {#if publications && publications.length > 0}
            {#each publications as publication}
                <div class="publication-item">
                    <h2 class="publication-title">{publication.title}</h2>
                    
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
                                <span class="publication-date">{new Date(publication.date).getFullYear()}</span>
                            {/if}
                        </div>
                        
                        {#if publication.doi}
                            <div class="publication-doi">
                                DOI: <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer">{publication.doi}</a>
                            </div>
                        {/if}
                    </div>
                    
                    <div class="publication-tags">
                        {#if publication.tags && publication.tags.length > 0}
                            {#each publication.tags as tag}
                                <span class="tag">{tag}</span>
                            {/each}
                        {/if}
                    </div>
                    
                    <div class="publication-content">
                        {@html publication.content}
                    </div>
                    
                    <a href={`/publications/${publication.slug}`} class="publication-link">
                        View details
                    </a>
                </div>
            {/each}
        {:else}
            <p>No publications available yet.</p>
        {/if}
    </div>
</div>

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 0;
    }
    
    h1 {
        font-size: 2.5rem;
        margin-bottom: 1.5rem;
    }
    
    .publications-list {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
    }
    
    .publication-item {
        padding: 1.5rem;
        border: 1px solid #eee;
        border-radius: 8px;
        transition: all 0.3s ease;
    }
    
    .publication-item:hover {
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    
    .publication-title {
        font-size: 1.5rem;
        margin: 0 0 1rem;
        color: #333;
    }
    
    .publication-meta {
        margin-bottom: 1rem;
        border-bottom: 1px solid #eee;
        padding-bottom: 1rem;
    }
    
    .publication-authors {
        font-weight: 500;
        margin-bottom: 0.5rem;
    }
    
    .publication-journal {
        font-style: italic;
        color: #555;
        margin-bottom: 0.5rem;
    }
    
    .publication-date {
        font-weight: bold;
        margin-left: 0.5rem;
    }
    
    .publication-doi {
        font-size: 0.9rem;
        margin-top: 0.5rem;
    }
    
    .publication-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
    }
    
    .tag {
        background-color: #f0f0f0;
        color: #555;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
    }
    
    .publication-content {
        margin: 1rem 0;
        position: relative;
        max-height: 200px;
        overflow: hidden;
    }
    
    .publication-content::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 80px;
        background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1));
    }
    
    .publication-content :global(h2),
    .publication-content :global(h3) {
        font-size: 1.25rem;
        margin: 1rem 0 0.5rem;
        border: none;
        padding: 0;
    }
    
    .publication-content :global(p) {
        margin-bottom: 0.75rem;
        line-height: 1.6;
    }
    
    .publication-link {
        display: inline-block;
        color: #3273dc;
        text-decoration: none;
        font-weight: 500;
        margin-top: 0.5rem;
    }
    
    .publication-link:hover {
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