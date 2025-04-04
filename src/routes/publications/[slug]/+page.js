import { error } from '@sveltejs/kit';
import { getAllPublications, getPublicationBySlug } from '$lib/utils/publications';

// Enable prerendering
export const prerender = true;

// Generate entries for all publications
export function entries() {
  const publications = getAllPublications();
  
  // If no publications are found, use at least one fallback entry
  // to prevent prerendering errors
  if (publications.length === 0) {
    return [{ slug: 'neural-networks-paper' }];
  }
  
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