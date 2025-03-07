import { error } from '@sveltejs/kit';

export const prerender = false;  // Set prerender to false instead of true

export async function load({ params, fetch }) {
  // Instead of importing a utility that doesn't exist,
  // let's use fetch to get the data
  const response = await fetch('/data/conferences.json');
  if (!response.ok) {
    throw error(500, 'Failed to load conferences data');
  }
  
  const conferences = await response.json();
  const conference = conferences.find(c => c.slug === params.slug);
  
  if (!conference) {
    throw error(404, 'Conference not found');
  }
  
  return {
    conference
  };
} 