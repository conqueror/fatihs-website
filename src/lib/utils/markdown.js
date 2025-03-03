import { browser } from '$app/environment';
import { dev } from '$app/environment';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

// Pre-loaded blog posts data for client-side and static builds
const BLOG_POSTS = [
  {
    slug: 'optimizing-for-ai-agents',
    title: 'Optimizing Applications, Websites, and Services for Discoverability and Usability by AI Agents',
    date: '2025-02-23',
    excerpt: 'How to make your digital products more discoverable and usable by AI agents in an increasingly AI-driven world.',
    tags: ['AI', 'UX Design', 'Web Development'],
    author: 'Fatih Nayebi',
    featured: true,
    content: '<h1>Optimizing Applications, Websites, and Services for Discoverability and Usability by AI Agents</h1><p>Sample content.</p>',
    rawContent: 'Sample content.'
  },
  {
    slug: 'assortment-planning-optimization-rl',
    title: 'Assortment Planning and Optimization with Reinforcement Learning',
    date: '2025-02-16',
    excerpt: 'How reinforcement learning is revolutionizing retail assortment planning and optimization strategies.',
    tags: ['Reinforcement Learning', 'Retail', 'Optimization'],
    author: 'Fatih Nayebi',
    featured: true,
    content: '<h1>Assortment Planning and Optimization with Reinforcement Learning</h1><p>Sample content.</p>',
    rawContent: 'Sample content.'
  },
  {
    slug: 'agentic-ai-future-automation',
    title: 'Agentic AI and the Future of Automation',
    date: '2025-01-10',
    excerpt: 'Exploring how agentic AI systems are reshaping automation and creating new possibilities for human-machine collaboration.',
    tags: ['AI', 'Automation', 'Future of Work'],
    author: 'Fatih Nayebi',
    featured: true,
    content: '<h1>Agentic AI and the Future of Automation</h1><p>Sample content.</p>',
    rawContent: 'Sample content.'
  },
  {
    slug: 'aws-reinvent-2024',
    title: 'AWS re:Invent 2024 Keynote Announcements',
    date: '2024-12-03',
    excerpt: 'A comprehensive overview of the major announcements and new services revealed at AWS re:Invent 2024.',
    tags: ['AWS', 'Cloud Computing', 'Technology'],
    author: 'Fatih Nayebi',
    featured: false,
    content: '<h1>AWS re:Invent 2024 Keynote Announcements</h1><p>Sample content.</p>',
    rawContent: 'Sample content.'
  },
  {
    slug: 'assortment-planning-optimization',
    title: 'Assortment Planning and Optimization with AI',
    date: '2024-11-06',
    excerpt: 'How artificial intelligence is transforming retail assortment planning and enabling data-driven inventory decisions.',
    tags: ['AI', 'Retail', 'Optimization'],
    author: 'Fatih Nayebi',
    featured: false,
    content: '<h1>Assortment Planning and Optimization with AI</h1><p>Sample content.</p>',
    rawContent: 'Sample content.'
  },
  {
    slug: 'decision-making-digital-age',
    title: 'Decision Making in the Digital Age: Navigating Complexity with Data and AI',
    date: '2024-06-05',
    excerpt: 'How data analytics and artificial intelligence are transforming decision-making processes in modern organizations.',
    tags: ['Decision Making', 'AI', 'Data Analytics'],
    author: 'Fatih Nayebi',
    featured: false,
    content: '<h1>Decision Making in the Digital Age</h1><p>Sample content.</p>',
    rawContent: 'Sample content.'
  },
  {
    slug: 'ai-for-decarbonization',
    title: 'Harnessing AI for Decarbonization: A Pathway to Sustainability and Environmental Stewardship',
    date: '2024-05-30',
    excerpt: 'Exploring how artificial intelligence technologies are accelerating decarbonization efforts across industries.',
    tags: ['AI', 'Sustainability', 'Climate Change'],
    author: 'Fatih Nayebi',
    featured: false,
    content: '<h1>Harnessing AI for Decarbonization</h1><p>Sample content.</p>',
    rawContent: 'Sample content.'
  },
  {
    slug: 'trust-digital-age',
    title: 'Trust in the Digital Age: Navigating AI and Information Integrity in Democracies',
    date: '2024-05-27',
    excerpt: 'How artificial intelligence is challenging traditional notions of trust in information and what it means for democratic societies.',
    tags: ['AI Ethics', 'Democracy', 'Digital Trust'],
    author: 'Fatih Nayebi',
    featured: false,
    content: '<h1>Trust in the Digital Age</h1><p>Sample content.</p>',
    rawContent: 'Sample content.'
  },
  {
    slug: 'decoding-ai-math-theorems',
    title: 'Decoding AI with Mathematical Theorems: From Predictions to Neural Networks',
    date: '2024-05-21',
    excerpt: 'An exploration of the fundamental mathematical principles that power modern AI systems and neural networks.',
    tags: ['AI', 'Mathematics', 'Neural Networks'],
    author: 'Fatih Nayebi',
    featured: false,
    content: '<h1>Decoding AI with Mathematical Theorems</h1><p>Sample content.</p>',
    rawContent: 'Sample content.'
  },
  {
    slug: 'statistical-experimentation-soccer-analytics',
    title: 'A Guide to Statistical Experimentation and Testing in Soccer (real football) Analytics',
    date: '2024-05-15',
    excerpt: 'How statistical experimentation and rigorous testing methodologies are revolutionizing soccer analytics and performance measurement.',
    tags: ['Sports Analytics', 'Statistics', 'Soccer'],
    author: 'Fatih Nayebi',
    featured: false,
    content: '<h1>Statistical Experimentation in Soccer Analytics</h1><p>Sample content.</p>',
    rawContent: 'Sample content.'
  },
  {
    slug: 'ai-healthcare',
    title: 'AI in Healthcare: Current Applications and Future Possibilities',
    date: '2023-06-15',
    excerpt: 'Exploring how artificial intelligence is transforming healthcare diagnosis, treatment, and patient care.',
    tags: ['AI', 'Healthcare', 'Machine Learning'],
    author: 'Fatih Nayebi',
    featured: true,
    content: '<h1>AI in Healthcare</h1><p>Sample content.</p>',
    rawContent: 'Sample content.'
  },
  {
    slug: 'ethical-ai',
    title: 'Ethical Considerations in AI Development',
    date: '2023-05-10',
    excerpt: 'Discussing the ethical challenges and responsibilities in developing artificial intelligence systems.',
    tags: ['AI', 'Ethics', 'Technology'],
    author: 'Fatih Nayebi',
    featured: false,
    content: '<h1>Ethical Considerations in AI Development</h1><p>Sample content.</p>',
    rawContent: 'Sample content.'
  },
  {
    slug: 'exploring-large-language-models',
    title: 'Exploring Large Language Models: From GPT to Beyond',
    date: '2023-07-22',
    excerpt: 'An in-depth look at the evolution of large language models and their impact on natural language processing.',
    tags: ['NLP', 'AI', 'Machine Learning'],
    author: 'Fatih Nayebi',
    featured: true,
    content: '<h1>Exploring Large Language Models</h1><p>Sample content.</p>',
    rawContent: 'Sample content.'
  }
];

// Pre-loaded publications data for client-side and static builds
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
 * Get all blog posts
 * @param {boolean} featured - Filter by featured status
 * @returns {Object[]} Array of blog posts
 */
export function getAllBlogPosts(featured = false) {
  // For browser, use pre-loaded data
  if (browser) {
    const posts = [...BLOG_POSTS];
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (featured) {
      return posts.filter(post => post.featured);
    }
    
    return posts;
  }
  
  // For server-side, also use pre-loaded data
  const posts = [...BLOG_POSTS];
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
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
  // Always use pre-loaded data for static builds and browser
  return BLOG_POSTS.find(post => post.slug === slug) || null;
}

/**
 * Get all publications
 * @param {boolean} featured - Filter by featured status
 * @returns {Object[]} Array of publications
 */
export function getAllPublications(featured = false) {
  // Always use pre-loaded data for static builds and browser
  const publications = [...PUBLICATIONS];
  publications.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  if (featured) {
    return publications.filter(pub => pub.featured);
  }
  
  return publications;
}

/**
 * Get a publication by its slug
 * @param {string} slug - The slug of the publication
 * @returns {Object|null} The publication or null if not found
 */
export function getPublicationBySlug(slug) {
  // Always use pre-loaded data for static builds and browser
  return PUBLICATIONS.find(pub => pub.slug === slug) || null;
}

/**
 * Search for content in blog posts and publications
 * @param {string} query - The search query
 * @param {Object} options - Search options
 * @returns {Object} Search results
 */
export function searchContent(query, options = {}) {
  if (!query) {
    return {
      blogPosts: [],
      publications: []
    };
  }
  
  const lowerQuery = query.toLowerCase();
  
  // Search blog posts
  const blogPosts = BLOG_POSTS.filter(post => {
    return (
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.rawContent.toLowerCase().includes(lowerQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  });
  
  // Search publications
  const publications = PUBLICATIONS.filter(pub => {
    return (
      pub.title.toLowerCase().includes(lowerQuery) ||
      pub.excerpt.toLowerCase().includes(lowerQuery) ||
      pub.rawContent.toLowerCase().includes(lowerQuery) ||
      pub.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  });
  
  return {
    blogPosts,
    publications
  };
} 