import { getAllBlogPosts } from '$lib/utils/markdown';

// Enable prerendering for blog posts
export const prerender = true;

// Generate entries for all blog posts
export function entries() {
  const posts = getAllBlogPosts();
  return posts.map(post => ({
    slug: post.slug
  }));
}

// Forward server data
export function load({ data }) {
  return {
    ...data
  };
} 