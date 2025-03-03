import { getPublicationBySlug, getAllPublications } from '$lib/utils/markdown';
import { error } from '@sveltejs/kit';

// Enable prerendering for publications
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
  const publication = getPublicationBySlug(params.slug);
  
  if (!publication) {
    throw error(404, {
      message: 'Publication not found'
    });
  }

  return {
    publication: {
      ...publication,
      date: publication.date.toString() // Ensure date is serializable
    }
  };
} 