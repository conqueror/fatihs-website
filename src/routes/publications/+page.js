import { getAllPublications } from '$lib/utils/publications';

// Enable prerendering
export const prerender = true;

/** @type {import('./$types').PageLoad} */
export function load() {
  const publications = getAllPublications();
  
  return {
    publications
  };
} 