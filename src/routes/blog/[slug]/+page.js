import { getBlogPostBySlug } from '$lib/utils/markdown';

// Use load to ensure the client knows how to handle the route
export function load({ params }) {
  return {
    post: getBlogPostBySlug(params.slug)
  };
} 