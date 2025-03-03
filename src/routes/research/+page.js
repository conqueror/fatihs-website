import { getOrderedResearchAreas } from '$lib/utils/research';

// Enable prerendering
export const prerender = true;

/** @type {import('./$types').PageLoad} */
export function load() {
  const researchAreas = getOrderedResearchAreas();
  
  return {
    researchAreas
  };
} 