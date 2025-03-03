import { error } from '@sveltejs/kit';
import { getAllBlogPosts, getBlogPostBySlug } from '$lib/utils/markdown';

// Enable prerendering for blog posts
export const prerender = true;

// Generate entries for all blog posts
export function entries() {
  const posts = getAllBlogPosts();
  return posts.map(post => ({
    slug: post.slug
  }));
}

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  const post = getBlogPostBySlug(params.slug);
  
  if (!post) {
    throw error(404, 'Blog post not found');
  }

  return {
    post
  };
} 