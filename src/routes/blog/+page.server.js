import { getAllBlogPosts } from '$lib/utils/markdown';

/**
 * Load function to fetch blog posts data during server-side rendering
 */
export function load() {
  const posts = getAllBlogPosts();
  
  return {
    posts
  };
} 