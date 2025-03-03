import { getAllBlogPosts } from '$lib/utils/markdown';

// Enable prerendering for blog index
export const prerender = true;

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  // Get all blog posts, not just featured ones
  const blogPosts = getAllBlogPosts(false);
  
  return {
    blogPosts
  };
} 