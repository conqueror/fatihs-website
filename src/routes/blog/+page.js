import { getAllBlogPosts } from '$lib/utils/markdown';

// Enable prerendering for blog index
export const prerender = true;

/** @type {import('./$types').PageLoad} */
export function load() {
  // Get all blog posts, not just featured ones
  const blogPosts = getAllBlogPosts();
  
  // Return serializable data
  return {
    blogPosts: blogPosts.map(post => ({
      ...post,
      date: post.date.toString() // Ensure date is serializable
    }))
  };
} 