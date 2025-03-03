import { getAllBlogPosts, getAllPublications } from '$lib/utils/markdown';

/**
 * Load function to fetch featured blog posts and publications for the home page
 */
export function load() {
  // Get featured blog posts - increased to show more posts on homepage
  const featuredPosts = getAllBlogPosts(true).slice(0, 6);
  
  // Get featured publications
  const featuredPublications = getAllPublications(true).slice(0, 2);
  
  return {
    featuredPosts,
    featuredPublications
  };
} 