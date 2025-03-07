import { getAllEvents, getEventYears, getEventTags, getEventLocations } from '$lib/utils/events';

// Enable prerendering
export const prerender = true;

/** @type {import('./$types').PageLoad} */
export async function load() {
  // Get all events
  const allEvents = getAllEvents();
  
  // Get unique years, tags, and locations for filtering
  const years = getEventYears();
  const tags = getEventTags();
  const locations = getEventLocations();
  
  // Return serializable data
  return {
    allEvents,
    years,
    tags,
    locations
  };
} 