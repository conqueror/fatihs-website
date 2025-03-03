import { getBlogPostBySlug } from '$lib/utils/markdown';
import { error } from '@sveltejs/kit';

// Disable prerendering for this page so we can access URL parameters
export const prerender = false;

/** @type {import('./$types').PageLoad} */
export function load({ url }) {
  // Check if we're being redirected from a blog post path
  const path = url.searchParams.get('path');
  
  if (path && path.startsWith('/blog/')) {
    // Extract the slug from the path
    const slug = path.replace('/blog/', '');
    
    // Get the blog post by slug
    const post = getBlogPostBySlug(slug);
    
    if (post) {
      return {
        redirectedBlogPost: post
      };
    } else {
      throw error(404, {
        message: 'Blog post not found'
      });
    }
  }
  
  // Normal home page load, don't do anything special
  return {};
} 