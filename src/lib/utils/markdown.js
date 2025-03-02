import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

// Path configurations
const BLOG_DIRECTORY = join(process.cwd(), 'src/content/blog');
const PUBLICATIONS_DIRECTORY = join(process.cwd(), 'src/content/publications');

/**
 * Get all Markdown files from a directory
 * @param {string} directory - Directory path
 * @returns {string[]} - Array of file names
 */
export function getMarkdownFiles(directory) {
  try {
    return readdirSync(directory).filter(file => file.endsWith('.md'));
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error);
    return [];
  }
}

/**
 * Parse a Markdown file with frontmatter
 * @param {string} filePath - Path to the Markdown file
 * @returns {Object} - Parsed content and frontmatter
 */
export function parseMarkdownFile(filePath) {
  try {
    const fileContents = readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Parse markdown content to HTML
    const htmlContent = marked(content);
    
    return {
      frontmatter: data,
      content: htmlContent,
      rawContent: content
    };
  } catch (error) {
    console.error(`Error parsing Markdown file ${filePath}:`, error);
    return {
      frontmatter: {},
      content: '',
      rawContent: ''
    };
  }
}

/**
 * Get all blog posts with their content and metadata
 * @param {boolean} featured - Filter by featured status
 * @returns {Array} - Array of blog posts
 */
export function getAllBlogPosts(featured = false) {
  const files = getMarkdownFiles(BLOG_DIRECTORY);
  
  const posts = files.map(filename => {
    const filePath = join(BLOG_DIRECTORY, filename);
    const { frontmatter, content } = parseMarkdownFile(filePath);
    
    return {
      slug: filename.replace('.md', ''),
      ...frontmatter,
      content
    };
  });
  
  // Sort posts by date (newest first)
  const sortedPosts = posts.sort((post1, post2) => {
    return new Date(post2.date) - new Date(post1.date);
  });
  
  // Filter by featured status if specified
  return featured ? sortedPosts.filter(post => post.featured) : sortedPosts;
}

/**
 * Get a single blog post by slug
 * @param {string} slug - Post slug
 * @returns {Object|null} - Blog post or null if not found
 */
export function getBlogPostBySlug(slug) {
  try {
    const filePath = join(BLOG_DIRECTORY, `${slug}.md`);
    const { frontmatter, content } = parseMarkdownFile(filePath);
    
    return {
      slug,
      ...frontmatter,
      content
    };
  } catch (error) {
    console.error(`Error getting blog post with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Get all publications with their content and metadata
 * @param {boolean} featured - Filter by featured status
 * @returns {Array} - Array of publications
 */
export function getAllPublications(featured = false) {
  const files = getMarkdownFiles(PUBLICATIONS_DIRECTORY);
  
  const publications = files.map(filename => {
    const filePath = join(PUBLICATIONS_DIRECTORY, filename);
    const { frontmatter, content } = parseMarkdownFile(filePath);
    
    return {
      slug: filename.replace('.md', ''),
      ...frontmatter,
      content
    };
  });
  
  // Sort publications by date (newest first)
  const sortedPublications = publications.sort((pub1, pub2) => {
    return new Date(pub2.date) - new Date(pub1.date);
  });
  
  // Filter by featured status if specified
  return featured 
    ? sortedPublications.filter(pub => pub.featured) 
    : sortedPublications;
}

/**
 * Get a single publication by slug
 * @param {string} slug - Publication slug
 * @returns {Object|null} - Publication or null if not found
 */
export function getPublicationBySlug(slug) {
  try {
    const filePath = join(PUBLICATIONS_DIRECTORY, `${slug}.md`);
    const { frontmatter, content } = parseMarkdownFile(filePath);
    
    return {
      slug,
      ...frontmatter,
      content
    };
  } catch (error) {
    console.error(`Error getting publication with slug ${slug}:`, error);
    return null;
  }
}

/**
 * Search for content across blog posts and publications
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @param {boolean} options.searchBlog - Whether to search blog posts
 * @param {boolean} options.searchPublications - Whether to search publications
 * @param {string[]} options.fields - Fields to search (title, excerpt, content, tags, etc.)
 * @returns {Object} - Search results categorized by type
 */
export function searchContent(query, options = {}) {
  const {
    searchBlog = true,
    searchPublications = true,
    fields = ['title', 'excerpt', 'rawContent', 'tags', 'author']
  } = options;
  
  if (!query) {
    return {
      blogPosts: [],
      publications: []
    };
  }
  
  // Normalize query for case-insensitive search
  const normalizedQuery = query.toLowerCase();
  
  // Search function that checks if any field contains the query
  const itemMatchesQuery = (item) => {
    return fields.some(field => {
      // Handle array fields like tags
      if (Array.isArray(item[field])) {
        return item[field].some(value => 
          String(value).toLowerCase().includes(normalizedQuery)
        );
      }
      
      // Handle regular string fields
      if (item[field] && typeof item[field] === 'string') {
        return item[field].toLowerCase().includes(normalizedQuery);
      }
      
      return false;
    });
  };
  
  let blogPosts = [];
  let publications = [];
  
  if (searchBlog) {
    const allPosts = getAllBlogPosts();
    blogPosts = allPosts.filter(itemMatchesQuery).map(post => ({
      ...post,
      type: 'blog'
    }));
  }
  
  if (searchPublications) {
    const allPublications = getAllPublications();
    publications = allPublications.filter(itemMatchesQuery).map(pub => ({
      ...pub,
      type: 'publication'
    }));
  }
  
  return {
    blogPosts,
    publications,
    // Combined results for mixed display
    allResults: [...blogPosts, ...publications].sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    })
  };
} 