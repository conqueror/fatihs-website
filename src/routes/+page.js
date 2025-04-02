import { getBlogPostBySlug, getFilteredBlogPosts } from '$lib/utils/markdown';
import { getFilteredPublications } from '$lib/utils/publications';
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
  
  // Get featured blog posts and publications for the home page
  const featuredPosts = getFilteredBlogPosts({ featured: true });
  const featuredPublications = getFilteredPublications({ featured: true });
  
  // Return the featured content
  return {
    featuredPosts,
    featuredPublications
  };
} 