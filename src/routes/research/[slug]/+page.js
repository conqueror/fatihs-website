import { getResearchAreaBySlug, getAllResearchAreas } from '$lib/utils/research.js';
import { error } from '@sveltejs/kit';

export const prerender = true;

// Generate entries for all research areas
export function entries() {
  const researchAreas = getAllResearchAreas();
  return researchAreas.map(area => ({
    slug: area.slug
  }));
}

export function load({ params }) {
    const { slug } = params;
    const researchArea = getResearchAreaBySlug(slug);
    
    if (!researchArea) {
        throw error(404, 'Research area not found');
    }
    
    return {
        researchArea
    };
} 