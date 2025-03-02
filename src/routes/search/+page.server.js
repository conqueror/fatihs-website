import { searchContent } from '$lib/utils/markdown';

export const actions = {
  /**
   * Search form submission handler
   */
  default: async ({ request }) => {
    const formData = await request.formData();
    const query = formData.get('query') || '';
    const type = formData.get('type') || 'all';
    
    // Search options based on selected type
    const searchOptions = {
      searchBlog: type === 'all' || type === 'blog',
      searchPublications: type === 'all' || type === 'publication'
    };
    
    const results = searchContent(query, searchOptions);
    
    return {
      query,
      type,
      results: results.allResults,
      blogResults: results.blogPosts,
      publicationResults: results.publications
    };
  }
};

/**
 * Initial page load handler
 */
export function load({ url }) {
  // Handle direct access to search page with query params in URL
  const query = url.searchParams.get('query') || '';
  const type = url.searchParams.get('type') || 'all';
  
  if (!query) {
    return {
      query: '',
      type: 'all',
      results: [],
      blogResults: [],
      publicationResults: []
    };
  }
  
  // Perform search using the query parameters
  const searchOptions = {
    searchBlog: type === 'all' || type === 'blog',
    searchPublications: type === 'all' || type === 'publication'
  };
  
  const results = searchContent(query, searchOptions);
  
  return {
    query,
    type,
    results: results.allResults,
    blogResults: results.blogPosts,
    publicationResults: results.publications
  };
} 