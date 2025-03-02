<script>
    // Access the data loaded in +page.server.js
    export let data;
    const { posts } = data;
</script>

<div class="container">
    <h1>Blog</h1>
    <p class="subtitle">Thoughts and insights on AI, machine learning, and technology.</p>
    
    <div class="blog-posts">
        {#if posts && posts.length > 0}
            {#each posts as post}
                <div class="blog-card">
                    <div class="post-meta">
                        <span class="post-date">{new Date(post.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</span>
                        {#if post.tags && post.tags.length > 0}
                            <div class="post-tags">
                                {#each post.tags as tag}
                                    <span class="tag">{tag}</span>
                                {/each}
                            </div>
                        {/if}
                    </div>
                    <h2 class="post-title">{post.title}</h2>
                    <p class="post-excerpt">{post.excerpt}</p>
                    <a href={`/blog/${post.slug}`} class="read-more">Read more →</a>
                </div>
            {/each}
        {:else}
            <p>No blog posts available yet. Check back soon!</p>
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
        margin-bottom: 0.5rem;
    }
    
    .subtitle {
        color: #666;
        margin-bottom: 2rem;
    }
    
    .blog-posts {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }
    
    .blog-card {
        padding: 1.5rem;
        border: 1px solid #eee;
        border-radius: 8px;
        transition: all 0.3s ease;
    }
    
    .blog-card:hover {
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        transform: translateY(-3px);
    }
    
    .post-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
    }
    
    .post-date {
        color: #666;
        font-size: 0.9rem;
    }
    
    .post-tags {
        display: flex;
        gap: 0.5rem;
    }
    
    .tag {
        background-color: #f0f0f0;
        color: #555;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
    }
    
    .post-title {
        font-size: 1.5rem;
        margin-bottom: 0.75rem;
        color: #333;
    }
    
    .post-excerpt {
        color: #555;
        margin-bottom: 1rem;
        line-height: 1.6;
    }
    
    .read-more {
        color: #3273dc;
        text-decoration: none;
        font-weight: 500;
        display: inline-block;
    }
    
    .read-more:hover {
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
            align-items: flex-start;
            gap: 0.5rem;
        }
    }
</style> 