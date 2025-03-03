// Enable prerendering
export const prerender = true;

/** @type {import('./$types').PageLoad} */
export function load({ url }) {
  // Initial empty state for search
  return {
    query: '',
    type: 'all',
    results: [],
    blogResults: [],
    publicationResults: []
  };
} 