// Import the generated publications list
import { browser } from '$app/environment';
import publicationsList from '$lib/generated/publications.json';

// Fallback data in case the JSON import fails
const FALLBACK_PUBLICATIONS = [
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
  try {
    if (featured) {
      return publicationsList.filter(pub => pub.featured);
    }
    return publicationsList;
  } catch (error) {
    console.warn('Falling back to hardcoded publications data');
    if (featured) {
      return FALLBACK_PUBLICATIONS.filter(pub => pub.featured);
    }
    return FALLBACK_PUBLICATIONS;
  }
}

/**
 * Get a publication by its slug
 * @param {string} slug - The slug of the publication
 * @returns {Object|null} The publication or null if not found
 */
export function getPublicationBySlug(slug) {
  try {
    return publicationsList.find(pub => pub.slug === slug) || null;
  } catch (error) {
    console.warn('Falling back to hardcoded publications data');
    return FALLBACK_PUBLICATIONS.find(pub => pub.slug === slug) || null;
  }
}

/**
 * Search publications
 * @param {string} query - The search query
 * @returns {Object[]} Array of matching publications
 */
export function searchPublications(query) {
  if (!query) {
    return [];
  }
  
  const lowerQuery = query.toLowerCase();
  
  try {
    return publicationsList.filter(pub => {
      return (
        pub.title.toLowerCase().includes(lowerQuery) ||
        pub.excerpt.toLowerCase().includes(lowerQuery) ||
        pub.rawContent.toLowerCase().includes(lowerQuery) ||
        pub.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    });
  } catch (error) {
    console.warn('Falling back to hardcoded publications data');
    return FALLBACK_PUBLICATIONS.filter(pub => {
      return (
        pub.title.toLowerCase().includes(lowerQuery) ||
        pub.excerpt.toLowerCase().includes(lowerQuery) ||
        pub.rawContent.toLowerCase().includes(lowerQuery) ||
        pub.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    });
  }
}

/**
 * Get filtered publications
 * @param {Object} options - Filter options
 * @param {string|null} options.tag - Filter by tag
 * @param {boolean} options.featured - Filter by featured status
 * @returns {Object[]} Array of filtered publications
 */
export function getFilteredPublications({ tag = null, featured = false } = {}) {
  try {
    let filteredPublications = publicationsList;

    if (tag) {
      filteredPublications = filteredPublications.filter(pub => pub.tags.includes(tag));
    }

    if (featured) {
      filteredPublications = filteredPublications.filter(pub => pub.featured);
    }

    return filteredPublications;
  } catch (error) {
    console.warn('Falling back to hardcoded publications data');
    let filteredPublications = FALLBACK_PUBLICATIONS;

    if (tag) {
      filteredPublications = filteredPublications.filter(pub => pub.tags.includes(tag));
    }

    if (featured) {
      filteredPublications = filteredPublications.filter(pub => pub.featured);
    }

    return filteredPublications;
  }
} 