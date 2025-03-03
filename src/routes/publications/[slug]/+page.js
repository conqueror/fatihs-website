import { error } from '@sveltejs/kit';
import { getAllPublications, getPublicationBySlug } from '$lib/utils/publications';

// Enable prerendering
export const prerender = true;

// Generate entries for all publications
export function entries() {
  const publications = getAllPublications();
  return publications.map(pub => ({
    slug: pub.slug
  }));
}

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
  const { slug } = params;
  const publication = getPublicationBySlug(slug);
  
  if (!publication) {
    throw error(404, 'Publication not found');
  }
  
  return {
    publication
  };
} 