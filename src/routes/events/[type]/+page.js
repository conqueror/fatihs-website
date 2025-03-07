import { error } from '@sveltejs/kit';
import { getAllEvents } from '$lib/utils/events.js';

// Enable prerendering
export const prerender = true;

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  const { type } = params;
  
  // Validate event type
  const validTypes = ['speaking', 'organizing', 'media'];
  if (!validTypes.includes(type)) {
    throw error(404, `Event type '${type}' not found`);
  }
  
  try {
    // Get all events and filter by type
    const allEvents = getAllEvents();
    const events = allEvents.filter(event => event.type === type);
    
    // Sort events by date, newest first
    events.sort((a, b) => {
      if (!a.date) return 1;
      if (!b.date) return -1;
      return new Date(b.date) - new Date(a.date);
    });
    
    return {
      events,
      type
    };
  } catch (err) {
    console.error('Error loading events:', err);
    throw error(500, 'Failed to load events data');
  }
} 