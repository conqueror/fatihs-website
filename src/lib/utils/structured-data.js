/**
 * Generate JSON-LD markup for a blog post
 * @param {Object} post - Blog post data
 * @param {string} siteUrl - The base site URL
 * @returns {Object} - JSON-LD structured data
 */
export function generateBlogPostSchema(post, siteUrl = 'https://fatihnayebi.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${siteUrl}/blog/${post.slug}`
    },
    'headline': post.title,
    'description': post.excerpt,
    'image': post.image ? `${siteUrl}${post.image}` : `${siteUrl}/images/default-blog.jpg`,
    'author': {
      '@type': 'Person',
      'name': post.author || 'Fatih Nayebi',
      'url': siteUrl,
      'jobTitle': 'VP of Data & AI',
      'affiliation': 'ALDO Group',
      'knowsAbout': ['Artificial Intelligence', 'Machine Learning', 'Retail AI', 'Agentic AI', 'Data Science']
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Fatih Nayebi',
      'logo': {
        '@type': 'ImageObject',
        'url': `${siteUrl}/images/logo.png`
      }
    },
    'datePublished': post.date,
    'dateModified': post.updatedAt || post.date,
    'keywords': post.tags ? post.tags.join(', ') : 'AI, Retail, Machine Learning, Data Science',
    'inLanguage': 'en-US',
    'about': post.tags && post.tags.includes('Retail AI') ? {
      '@type': 'Thing',
      'name': 'Retail AI',
      'description': 'Artificial Intelligence applications in retail industry'
    } : null
  };
}

/**
 * Generate JSON-LD markup for a research publication
 * @param {Object} publication - Publication data
 * @param {string} siteUrl - The base site URL
 * @returns {Object} - JSON-LD structured data
 */
export function generatePublicationSchema(publication, siteUrl = 'https://fatihnayebi.com') {
  const authors = Array.isArray(publication.authors) 
    ? publication.authors 
    : [publication.authors || 'Fatih Nayebi'];
  
  return {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    'headline': publication.title,
    'author': authors.map(name => ({
      '@type': 'Person',
      'name': name,
      'affiliation': name === 'Fatih Nayebi' ? {
        '@type': 'Organization',
        'name': 'ALDO Group',
        'sameAs': 'https://www.aldogroup.com/'
      } : undefined
    })),
    'publisher': {
      '@type': 'Organization',
      'name': publication.journal || 'Scientific Journal'
    },
    'datePublished': publication.date,
    'description': publication.abstract || publication.excerpt || `Research publication by ${authors.join(', ')} on ${publication.title}`,
    'url': publication.url || `${siteUrl}/publications/${publication.slug}`,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${siteUrl}/publications/${publication.slug}`
    },
    'keywords': publication.tags ? publication.tags.join(', ') : 'AI, Research, Machine Learning',
    'inLanguage': 'en-US',
    'isAccessibleForFree': true,
    'identifier': publication.doi ? `DOI:${publication.doi}` : undefined
  };
}

/**
 * Generate JSON-LD markup for a person/researcher
 * @param {Object} person - Person data
 * @param {string} siteUrl - The base site URL
 * @returns {Object} - JSON-LD structured data
 */
export function generatePersonSchema(person = {}, siteUrl = 'https://fatihnayebi.com') {
  const defaultPerson = {
    name: 'Fatih Nayebi',
    jobTitle: 'VP of Data & AI',
    email: 'fatih@gradientdivergence.com',
    description: 'AI researcher and leader focused on retail AI, machine learning and agentic systems',
    image: '/images/profile.avif',
    sameAs: [
      'https://twitter.com/FatihNayebi',
      'https://github.com/conqueror',
      'https://linkedin.com/in/FatihNayebi'
    ]
  };

  const data = { ...defaultPerson, ...person };

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': data.name,
    'jobTitle': data.jobTitle,
    'worksFor': {
      '@type': 'Organization',
      'name': 'ALDO Group',
      'sameAs': 'https://www.aldogroup.com/'
    },
    'email': data.email,
    'description': data.description,
    'image': `${siteUrl}${data.image}`,
    'url': siteUrl,
    'sameAs': data.sameAs,
    'alumniOf': [
      {
        '@type': 'CollegeOrUniversity',
        'name': 'École de Technologie Supérieure',
        'sameAs': 'https://www.etsmtl.ca/'
      },
      {
        '@type': 'CollegeOrUniversity',
        'name': 'McGill University',
        'sameAs': 'https://www.mcgill.ca/'
      }
    ],
    'knowsAbout': [
      'Artificial Intelligence',
      'Machine Learning',
      'Retail AI',
      'Agentic AI',
      'Reinforcement Learning',
      'Assortment Planning',
      'Inventory Optimization'
    ],
    'teachingFor': {
      '@type': 'CollegeOrUniversity',
      'name': 'McGill University',
      'department': 'School of Continuing Studies',
      'sameAs': 'https://www.mcgill.ca/continuingstudies/'
    }
  };
}

/**
 * Generate JSON-LD markup for a website
 * @param {string} siteUrl - The base site URL
 * @returns {Object} - JSON-LD structured data
 */
export function generateWebsiteSchema(siteUrl = 'https://fatihnayebi.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'url': siteUrl,
    'name': 'Fatih Nayebi',
    'description': 'Personal website of Fatih Nayebi, VP of Data & AI at ALDO Group. Expert in retail AI, machine learning, and agentic systems.',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${siteUrl}/search?query={search_term_string}`,
      'query-input': 'required name=search_term_string'
    },
    'about': [
      {
        '@type': 'Thing',
        'name': 'Artificial Intelligence',
        'description': 'Theory and application of AI systems'
      },
      {
        '@type': 'Thing',
        'name': 'Retail AI',
        'description': 'AI applications in retail industry'
      },
      {
        '@type': 'Thing',
        'name': 'Agentic AI',
        'description': 'Autonomous AI systems that can act on behalf of users'
      }
    ],
    'keywords': 'Fatih Nayebi, AI, Retail AI, Machine Learning, Data Science, Agentic AI, AI Ethics, ALDO Group'
  };
}

/**
 * Generate JSON-LD markup for a retail AI content
 * @param {Object} content - Content data
 * @param {string} siteUrl - The base site URL
 * @returns {Object} - JSON-LD structured data
 */
export function generateRetailAIContentSchema(content, siteUrl = 'https://fatihnayebi.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    'headline': content.title,
    'description': content.description || content.excerpt,
    'image': content.image ? `${siteUrl}${content.image}` : `${siteUrl}/images/retail-ai.jpg`,
    'author': {
      '@type': 'Person',
      'name': 'Fatih Nayebi',
      'jobTitle': 'VP of Data & AI',
      'worksFor': {
        '@type': 'Organization',
        'name': 'ALDO Group',
        'sameAs': 'https://www.aldogroup.com/'
      }
    },
    'datePublished': content.date,
    'dateModified': content.updatedAt || content.date,
    'publisher': {
      '@type': 'Organization',
      'name': 'Fatih Nayebi',
      'logo': {
        '@type': 'ImageObject',
        'url': `${siteUrl}/images/logo.png`
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': content.url || `${siteUrl}/${content.slug}`
    },
    'about': {
      '@type': 'Thing',
      'name': 'Retail AI',
      'description': 'Artificial Intelligence applications in retail industry'
    },
    'keywords': content.tags ? content.tags.join(', ') : 'Retail AI, Inventory Optimization, Assortment Planning, Machine Learning, Agentic AI',
    'specialty': 'Retail Technology',
    'inLanguage': 'en-US'
  };
}

/**
 * Convert JSON-LD object to string for HTML insertion
 * @param {Object} data - JSON-LD object
 * @returns {string} - Stringified JSON-LD
 */
export function jsonLdToString(data) {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
} 