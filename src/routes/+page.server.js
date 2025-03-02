import { getAllBlogPosts, getAllPublications } from '$lib/utils/markdown';

/**
 * Load function to fetch featured blog posts and publications for the home page
 */
export function load() {
  // Get featured blog posts
  const featuredPosts = getAllBlogPosts(true).slice(0, 2);
  
  // Get featured publications
  const featuredPublications = getAllPublications(true).slice(0, 2);
  
  return {
    featuredPosts,
    featuredPublications
  };
} 