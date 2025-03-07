import { getAllEvents, getEventYears, getEventTags, getEventLocations } from '$lib/utils/events.js';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
  try {
    // Get all events data directly from the utility functions
    const allEvents = getAllEvents();
    const years = getEventYears();
    const tags = getEventTags();
    const locations = getEventLocations();
    
    return {
      allEvents,
      years,
      tags,
      locations
    };
  } catch (err) {
    console.error('Error loading events data:', err);
    return {
      allEvents: [],
      years: [],
      tags: [],
      locations: []
    };
  }
} 