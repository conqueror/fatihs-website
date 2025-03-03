import { error } from '@sveltejs/kit';
import blogPosts from '$lib/generated/blog-posts.json';

// Enable prerendering for blog posts
export const prerender = true;

// Generate entries for all blog posts
export function entries() {
  return blogPosts.map(post => ({
    slug: post.slug
  }));
}

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  const post = blogPosts.find(post => post.slug === params.slug);
  
  if (!post) {
    throw error(404, {
      message: 'Post not found'
    });
  }

  return {
    post
  };
} 