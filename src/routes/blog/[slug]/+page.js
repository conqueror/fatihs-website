import { getBlogPostBySlug, getAllBlogPosts } from '$lib/utils/markdown';
import { error } from '@sveltejs/kit';

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
export function load({ params }) {
  const post = getBlogPostBySlug(params.slug);
  
  if (!post) {
    throw error(404, {
      message: 'Blog post not found'
    });
  }

  // Return serializable data
  return {
    post: {
      ...post,
      date: post.date.toString() // Ensure date is serializable
    }
  };
} 