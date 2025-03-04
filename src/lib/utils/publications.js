// Import the generated publications list
import { browser } from '$app/environment';
import publicationsList from '$lib/generated/publications.json';

// Fallback data in case the JSON import fails
const FALLBACK_PUBLICATIONS = [
  {
    slug: 'neural-networks-paper',
    title: 'Neural Network Architectures for Computer Vision',
    date: '2022-03-18',
    abstract: 'A comprehensive review of neural network architectures for computer vision tasks.',
    tags: ['Neural Networks', 'Computer Vision', 'Deep Learning'],
    authors: ['Fatih Nayebi'],
    featured: true,
    content: '<h1>Neural Network Architectures for Computer Vision</h1><p>Sample content.</p>',
    html: '<h1>Neural Network Architectures for Computer Vision</h1><p>Sample content.</p>'
  },
  {
    slug: 'ml-interpretability',
    title: 'Advances in Machine Learning Interpretability',
    date: '2023-01-05',
    abstract: 'Investigating methods to make machine learning models more interpretable and transparent.',
    tags: ['Machine Learning', 'Interpretability', 'XAI'],
    authors: ['Fatih Nayebi'],
    featured: false,
    content: '<h1>Advances in Machine Learning Interpretability</h1><p>Sample content.</p>',
    html: '<h1>Advances in Machine Learning Interpretability</h1><p>Sample content.</p>'
  },
  {
    slug: 'transformer-optimization-techniques',
    title: 'Optimization Techniques for Transformer Models',
    date: '2023-04-12',
    abstract: 'A detailed analysis of techniques to optimize transformer-based models for improved performance and efficiency.',
    tags: ['Transformers', 'Optimization', 'Deep Learning'],
    authors: ['Fatih Nayebi'],
    featured: true,
    content: '<h1>Optimization Techniques for Transformer Models</h1><p>Sample content.</p>',
    html: '<h1>Optimization Techniques for Transformer Models</h1><p>Sample content.</p>'
  }
];

/**
 * Process publications data to ensure proper formatting
 * @param {Object[]} publications - Raw publications data
 * @returns {Object[]} Processed publications data
 */
function processPublications(publications) {
  return publications.map(pub => {
    // Create a new object to avoid modifying the original
    const processedPub = { ...pub };
    
    // Process authors field if it's a string that looks like an array
    if (typeof processedPub.authors === 'string' && processedPub.authors.startsWith('[')) {
      try {
        processedPub.authors = JSON.parse(processedPub.authors);
      } catch (error) {
        console.warn(`Failed to parse authors for publication ${processedPub.slug}:`, error);
        // Fallback to an array with the string value
        processedPub.authors = [processedPub.authors];
      }
    } else if (processedPub.author && !processedPub.authors) {
      // If there's an author field but no authors, use it
      processedPub.authors = processedPub.author.split(',').map(a => a.trim());
    } else if (!processedPub.authors) {
      // Default if no authors field exists
      processedPub.authors = ['Fatih Nayebi'];
    }
    
    return processedPub;
  });
}

/**
 * Get all publications
 * @param {boolean} featured - Filter by featured status
 * @returns {Object[]} Array of publications
 */
export function getAllPublications(featured = false) {
  try {
    let pubs = processPublications(publicationsList);
    
    if (featured) {
      return pubs.filter(pub => pub.featured);
    }
    return pubs;
  } catch (error) {
    console.warn('Falling back to hardcoded publications data');
    let pubs = processPublications(FALLBACK_PUBLICATIONS);
    
    if (featured) {
      return pubs.filter(pub => pub.featured);
    }
    return pubs;
  }
}

/**
 * Get a publication by its slug
 * @param {string} slug - The slug of the publication
 * @returns {Object|null} The publication or null if not found
 */
export function getPublicationBySlug(slug) {
  try {
    const pub = publicationsList.find(pub => pub.slug === slug) || null;
    return pub ? processPublications([pub])[0] : null;
  } catch (error) {
    console.warn('Falling back to hardcoded publications data');
    const pub = FALLBACK_PUBLICATIONS.find(pub => pub.slug === slug) || null;
    return pub ? processPublications([pub])[0] : null;
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
        (pub.abstract && pub.abstract.toLowerCase().includes(lowerQuery)) ||
        (pub.content && pub.content.toLowerCase().includes(lowerQuery)) ||
        (pub.tags && pub.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
      );
    });
  } catch (error) {
    console.warn('Falling back to hardcoded publications data');
    return FALLBACK_PUBLICATIONS.filter(pub => {
      return (
        pub.title.toLowerCase().includes(lowerQuery) ||
        (pub.abstract && pub.abstract.toLowerCase().includes(lowerQuery)) ||
        (pub.content && pub.content.toLowerCase().includes(lowerQuery)) ||
        (pub.tags && pub.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
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