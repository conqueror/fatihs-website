<script>
    export let data;
    const { post } = data;
</script>

<div class="container">
    <div class="blog-header">
        <h1>{post.title}</h1>
        <div class="post-meta">
            <span class="post-date">{new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })}</span>
            <span class="post-author">By {post.author || 'Fatih Nayebi'}</span>
        </div>
        
        {#if post.tags && post.tags.length > 0}
            <div class="post-tags">
                {#each post.tags as tag}
                    <span class="tag">{tag}</span>
                {/each}
            </div>
        {/if}
    </div>
    
    <div class="blog-content">
        {@html post.content}
    </div>
    
    <div class="blog-footer">
        <a href="/blog" class="back-link">← Back to all posts</a>
    </div>
</div>

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem 0;
    }
    
    .blog-header {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid #eee;
    }
    
    h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        line-height: 1.2;
    }
    
    .post-meta {
        display: flex;
        gap: 1rem;
        color: #666;
        margin-bottom: 1rem;
    }
    
    .post-tags {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    
    .tag {
        background-color: #f0f0f0;
        color: #555;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
    }
    
    .blog-content {
        line-height: 1.8;
        color: #333;
    }
    
    .blog-content :global(h2) {
        font-size: 1.8rem;
        margin: 2rem 0 1rem;
        color: #222;
    }
    
    .blog-content :global(h3) {
        font-size: 1.4rem;
        margin: 1.75rem 0 0.75rem;
        color: #333;
    }
    
    .blog-content :global(p) {
        margin-bottom: 1.25rem;
    }
    
    .blog-content :global(ul), 
    .blog-content :global(ol) {
        margin: 1rem 0 1.5rem 1.5rem;
    }
    
    .blog-content :global(li) {
        margin-bottom: 0.5rem;
    }
    
    .blog-content :global(blockquote) {
        border-left: 4px solid #3273dc;
        padding-left: 1rem;
        font-style: italic;
        color: #555;
        margin: 1.5rem 0;
    }
    
    .blog-content :global(code) {
        background-color: #f5f5f5;
        padding: 0.1rem 0.3rem;
        border-radius: 3px;
        font-family: monospace;
    }
    
    .blog-content :global(pre) {
        background-color: #f5f5f5;
        padding: 1rem;
        border-radius: 5px;
        overflow-x: auto;
        margin: 1.5rem 0;
    }
    
    .blog-content :global(pre code) {
        background-color: transparent;
        padding: 0;
    }
    
    .blog-content :global(a) {
        color: #3273dc;
        text-decoration: none;
    }
    
    .blog-content :global(a:hover) {
        text-decoration: underline;
    }
    
    .blog-content :global(img) {
        max-width: 100%;
        height: auto;
        border-radius: 5px;
        margin: 1.5rem 0;
    }
    
    .blog-footer {
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
        
        .post-meta {
            flex-direction: column;
            gap: 0.5rem;
        }
    }
</style> 