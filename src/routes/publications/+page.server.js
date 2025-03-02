import { getAllPublications } from '$lib/utils/markdown';

/**
 * Load function to fetch publications data during server-side rendering
 */
export function load() {
  const publications = getAllPublications();
  
  return {
    publications
  };
} 