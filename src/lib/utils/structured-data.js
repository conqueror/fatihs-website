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
      'url': siteUrl
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
    'dateModified': post.updatedAt || post.date
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
      'name': name
    })),
    'publisher': {
      '@type': 'Organization',
      'name': publication.journal || 'Scientific Journal'
    },
    'datePublished': publication.date,
    'description': publication.abstract || publication.excerpt,
    'url': publication.paperUrl || `${siteUrl}/publications/${publication.slug}`,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${siteUrl}/publications/${publication.slug}`
    }
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
    jobTitle: 'AI Researcher and Developer',
    email: 'contact@fatihnayebi.com',
    description: 'AI researcher focusing on machine learning and natural language processing',
    image: '/images/profile.avif',
    sameAs: [
      'https://twitter.com/FatihNayebi',
      'https://github.com/fatihnayebi',
      'https://linkedin.com/in/fatihnayebi'
    ]
  };

  const data = { ...defaultPerson, ...person };

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': data.name,
    'jobTitle': data.jobTitle,
    'email': data.email,
    'description': data.description,
    'image': `${siteUrl}${data.image}`,
    'url': siteUrl,
    'sameAs': data.sameAs
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
    'description': 'Personal website of Fatih Nayebi, featuring research, publications, blog posts, and more on AI, machine learning, and software development.',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${siteUrl}/search?query={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
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