import matter from 'gray-matter';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true,
  mangle: false
});

// Import all markdown files from the blog directory
const blogFiles = import.meta.glob('../../content/blog/*.md', { 
  eager: true,
  as: 'raw'
});

// Process blog posts at build time
const BLOG_POSTS = Object.entries(blogFiles).map(([filepath, content]) => {
  try {
    // Parse frontmatter and content
    const { data, content: markdownContent } = matter(content);
    
    // Extract slug from filepath
    const slug = filepath.split('/').pop().replace('.md', '');
    
    // Parse markdown to HTML and sanitize
    const html = DOMPurify.sanitize(marked(markdownContent));
    
    return {
      slug,
      title: data.title,
      date: new Date(data.date),
      excerpt: data.excerpt,
      tags: data.tags || [],
      author: data.author || 'Fatih Nayebi',
      featured: data.featured || false,
      content: html,
      rawContent: markdownContent
    };
  } catch (error) {
    console.error(`Error processing markdown file ${filepath}:`, error);
    return null;
  }
}).filter(Boolean).sort((a, b) => b.date - a.date);

/**
 * Get all blog posts
 * @param {boolean} featured - Whether to only return featured posts
 * @returns {Array} Array of blog posts
 */
export function getAllBlogPosts(featured = false) {
  const posts = BLOG_POSTS.map(post => ({
    ...post,
    date: post.date.toISOString() // Convert Date to string for serialization
  }));
  
  if (featured) {
    return posts.filter(post => post.featured);
  }
  return posts;
}

/**
 * Get a blog post by its slug
 * @param {string} slug - The slug of the blog post
 * @returns {Object|null} The blog post or null if not found
 */
export function getBlogPostBySlug(slug) {
  const post = BLOG_POSTS.find(post => post.slug === slug);
  if (!post) return null;
  
  return {
    ...post,
    date: post.date.toISOString() // Convert Date to string for serialization
  };
}

// Pre-loaded publications data
const PUBLICATIONS = [
  {
    slug: 'neural-networks-paper',
    title: 'Neural Network Architectures for Computer Vision',
    date: '2022-03-18',
    excerpt: 'A comprehensive review of neural network architectures for computer vision tasks.',
    tags: ['Neural Networks', 'Computer Vision', 'Deep Learning'],
    author: 'Fatih Nayebi',
    featured: true,
    content: '<h1>Neural Network Architectures for Computer Vision</h1><p>Sample content.</p>',
    rawContent: 'Sample content.'
  },
  {
    slug: 'ml-interpretability',
    title: 'Advances in Machine Learning Interpretability',
    date: '2023-01-05',
    excerpt: 'Investigating methods to make machine learning models more interpretable and transparent.',
    tags: ['Machine Learning', 'Interpretability', 'XAI'],
    author: 'Fatih Nayebi',
    featured: false,
    content: '<h1>Advances in Machine Learning Interpretability</h1><p>Sample content.</p>',
    rawContent: 'Sample content.'
  },
  {
    slug: 'transformer-optimization-techniques',
    title: 'Optimization Techniques for Transformer Models',
    date: '2023-04-12',
    excerpt: 'A detailed analysis of techniques to optimize transformer-based models for improved performance and efficiency.',
    tags: ['Transformers', 'Optimization', 'Deep Learning'],
    author: 'Fatih Nayebi',
    featured: true,
    content: '<h1>Optimization Techniques for Transformer Models</h1><p>Sample content.</p>',
    rawContent: 'Sample content.'
  }
];

/**
 * Get all publications
 * @param {boolean} featured - Filter by featured status
 * @returns {Object[]} Array of publications
 */
export function getAllPublications(featured = false) {
  if (featured) {
    return PUBLICATIONS.filter(pub => pub.featured);
  }
  return PUBLICATIONS;
}

/**
 * Get a publication by its slug
 * @param {string} slug - The slug of the publication
 * @returns {Object|null} The publication or null if not found
 */
export function getPublicationBySlug(slug) {
  return PUBLICATIONS.find(pub => pub.slug === slug) || null;
}

/**
 * Search for content in blog posts and publications
 * @param {string} query - The search query
 * @returns {Object} Search results
 */
export function searchContent(query) {
  if (!query) {
    return {
      blogPosts: [],
      publications: []
    };
  }
  
  const lowerQuery = query.toLowerCase();
  
  const filteredBlogPosts = BLOG_POSTS.map(post => ({
    ...post,
    date: post.date.toISOString()
  })).filter(post => {
    return (
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.rawContent.toLowerCase().includes(lowerQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  });
  
  const publications = PUBLICATIONS.filter(pub => {
    return (
      pub.title.toLowerCase().includes(lowerQuery) ||
      pub.excerpt.toLowerCase().includes(lowerQuery) ||
      pub.rawContent.toLowerCase().includes(lowerQuery) ||
      pub.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  });
  
  return {
    blogPosts: filteredBlogPosts,
    publications
  };
} 