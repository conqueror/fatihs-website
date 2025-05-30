import { getAllBlogPosts } from '$lib/utils/markdown';

// Enable prerendering for blog index
export const prerender = true;

/** @type {import('./$types').PageLoad} */
export async function load() {
  // Get all blog posts, not just featured ones
  const blogPosts = getAllBlogPosts();
  
  // Return serializable data
  return {
    blogPosts
  };
} 