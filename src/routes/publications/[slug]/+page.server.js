import { getPublicationBySlug } from '$lib/utils/markdown';
import { error } from '@sveltejs/kit';

export function load({ params }) {
  const { slug } = params;
  const publication = getPublicationBySlug(slug);
  
  if (!publication) {
    throw error(404, {
      message: 'Publication not found'
    });
  }
  
  return {
    publication
  };
} 