import { getBlogPostBySlug } from '$lib/utils/markdown';
import { error } from '@sveltejs/kit';

export function load({ params }) {
  const { slug } = params;
  const post = getBlogPostBySlug(slug);
  
  if (!post) {
    throw error(404, {
      message: 'Blog post not found'
    });
  }
  
  return {
    post
  };
} 