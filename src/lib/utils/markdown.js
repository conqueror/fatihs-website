import { browser } from '$app/environment';
import blogPosts from '$lib/generated/blog-posts.json';

export function getAllBlogPosts() {
  return blogPosts;
}

export function getBlogPostBySlug(slug) {
  return blogPosts.find(post => post.slug === slug);
}

export function getFilteredBlogPosts({ tag = null, featured = false } = {}) {
  let filteredPosts = blogPosts;

  if (tag) {
    filteredPosts = filteredPosts.filter(post => post.tags.includes(tag));
  }

  if (featured) {
    filteredPosts = filteredPosts.filter(post => post.featured);
  }

  return filteredPosts;
} 