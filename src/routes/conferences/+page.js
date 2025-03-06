import { getAllConferences } from '$lib/utils/markdown';

export const prerender = true;

/** @type {import('./$types').PageLoad} */
export function load() {
  // Get all conferences
  const conferences = getAllConferences();
  
  // Sort conferences by date (most recent first)
  if (conferences && conferences.length) {
    conferences.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  
  // Return serializable data
  return {
    conferences
  };
} 