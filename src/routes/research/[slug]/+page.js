import { getResearchAreaBySlug } from '$lib/utils/research.js';
import { error } from '@sveltejs/kit';

export const prerender = true;

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