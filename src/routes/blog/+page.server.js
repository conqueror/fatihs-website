import { getAllBlogPosts } from '$lib/utils/markdown';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  // Get all blog posts, not just featured ones
  const blogPosts = getAllBlogPosts(false);
  
  return {
    blogPosts
  };
} 