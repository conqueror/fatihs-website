// Import the generated blog posts list
import { browser } from '$app/environment';
import blogPosts from '$lib/generated/blog-posts.json';

// Fallback data in case the JSON import fails
const FALLBACK_BLOG_POSTS = [
  {
    slug: 'getting-started-with-ai',
    title: 'Getting Started with AI: A Beginner\'s Guide',
    date: '2023-09-15',
    excerpt: 'A comprehensive introduction to artificial intelligence for beginners.',
    author: 'Fatih Nayebi',
    tags: ['AI', 'Beginners', 'Machine Learning'],
    image: '/images/blog/ai-intro.jpg',
    content: '<h1>Getting Started with AI</h1><p>This guide will help you understand the fundamentals of artificial intelligence.</p>'
  },
  {
    slug: 'future-of-llms',
    title: 'The Future of Large Language Models',
    date: '2023-08-20',
    excerpt: 'Exploring the potential and limitations of large language models.',
    author: 'Fatih Nayebi',
    tags: ['AI', 'NLP', 'Machine Learning'],
    image: '/images/blog/llm-future.jpg',
    content: '<h1>The Future of LLMs</h1><p>Large language models are transforming how we interact with computers.</p>'
  },
  {
    slug: 'svelte-for-data-scientists',
    title: 'Why Data Scientists Should Learn Svelte',
    date: '2023-07-10',
    excerpt: 'How Svelte can help data scientists build better interactive visualizations.',
    author: 'Fatih Nayebi',
    tags: ['Web Development', 'Data Science', 'Svelte'],
    image: '/images/blog/svelte-dataviz.jpg',
    content: '<h1>Svelte for Data Scientists</h1><p>Svelte offers a simple yet powerful way to create interactive data visualizations.</p>'
  }
];

/**
 * Process blog posts to ensure consistent format
 * @param {Array} posts - Array of blog post objects
 * @returns {Array} Processed blog posts
 */
function processBlogPosts(posts) {
  return posts.map(post => {
    const processedPost = { ...post };
    
    // Ensure dates are in ISO format
    if (processedPost.date && typeof processedPost.date === 'string') {
      try {
        const date = new Date(processedPost.date);
        if (!isNaN(date.getTime())) {
          processedPost.date = date.toISOString().split('T')[0];
        }
      } catch (error) {
        console.warn(`Invalid date format for post: ${processedPost.slug}`);
      }
    }
    
    // Ensure tags are always an array
    if (processedPost.tags) {
      if (typeof processedPost.tags === 'string') {
        // Check if it's a string that looks like an array
        if (processedPost.tags.startsWith('[') && processedPost.tags.endsWith(']')) {
          try {
            processedPost.tags = JSON.parse(processedPost.tags);
          } catch (error) {
            processedPost.tags = processedPost.tags
              .replace(/[\[\]"']/g, '')
              .split(',')
              .map(tag => tag.trim())
              .filter(Boolean);
          }
        } else {
          processedPost.tags = processedPost.tags
            .split(',')
            .map(tag => tag.trim())
            .filter(Boolean);
        }
      }
    } else {
      processedPost.tags = [];
    }
    
    // Set default author if missing
    if (!processedPost.author) {
      processedPost.author = 'Fatih Nayebi';
    }
    
    return processedPost;
  });
}

/**
 * Get all blog posts
 * @returns {Object[]} Array of blog posts
 */
export function getAllPosts() {
  try {
    return processBlogPosts(blogPosts);
  } catch (error) {
    console.warn('Falling back to hardcoded blog posts data', error);
    return processBlogPosts(FALLBACK_BLOG_POSTS);
  }
}

/**
 * Get a blog post by its slug
 * @param {string} slug - The slug of the blog post
 * @returns {Object|null} The blog post or null if not found
 */
export function getPostBySlug(slug) {
  try {
    const post = blogPosts.find(post => post.slug === slug);
    return post ? processBlogPosts([post])[0] : null;
  } catch (error) {
    console.warn('Falling back to hardcoded blog posts data');
    const post = FALLBACK_BLOG_POSTS.find(post => post.slug === slug);
    return post ? processBlogPosts([post])[0] : null;
  }
}

/**
 * Get recent blog posts
 * @param {number} count - Number of recent posts to return
 * @returns {Object[]} Array of recent blog posts
 */
export function getRecentPosts(count = 5) {
  try {
    const sortedPosts = [...processBlogPosts(blogPosts)].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    return sortedPosts.slice(0, count);
  } catch (error) {
    console.warn('Falling back to hardcoded blog posts data');
    const sortedPosts = [...processBlogPosts(FALLBACK_BLOG_POSTS)].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    return sortedPosts.slice(0, count);
  }
}

/**
 * Get posts by tag
 * @param {string} tag - Tag to filter by
 * @returns {Object[]} Array of blog posts with the specified tag
 */
export function getPostsByTag(tag) {
  try {
    const posts = processBlogPosts(blogPosts);
    return posts.filter(post => 
      post.tags && post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  } catch (error) {
    console.warn('Falling back to hardcoded blog posts data');
    const posts = processBlogPosts(FALLBACK_BLOG_POSTS);
    return posts.filter(post => 
      post.tags && post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }
}

/**
 * Get all tags from blog posts
 * @returns {string[]} Array of unique tags
 */
export function getAllTags() {
  try {
    const posts = processBlogPosts(blogPosts);
    const tags = new Set();
    
    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          tags.add(tag);
        });
      }
    });
    
    return [...tags].sort();
  } catch (error) {
    console.warn('Falling back to hardcoded blog posts data');
    const posts = processBlogPosts(FALLBACK_BLOG_POSTS);
    const tags = new Set();
    
    posts.forEach(post => {
      if (post.tags && Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          tags.add(tag);
        });
      }
    });
    
    return [...tags].sort();
  }
} 