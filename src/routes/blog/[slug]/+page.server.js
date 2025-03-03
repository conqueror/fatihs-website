import { getBlogPostBySlug } from '$lib/utils/markdown';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  try {
    const { slug } = params;
    const post = getBlogPostBySlug(slug);
    
    if (!post) {
      throw error(404, {
        message: 'Blog post not found',
        code: 'POST_NOT_FOUND'
      });
    }
    
    return {
      post
    };
  } catch (err) {
    console.error('Error loading blog post:', err);
    throw error(500, {
      message: 'Failed to load blog post',
      code: 'POST_LOAD_ERROR'
    });
  }
} 