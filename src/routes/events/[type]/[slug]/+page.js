import { error } from '@sveltejs/kit';
import { getAllEvents } from '$lib/utils/events.js';

// Enable prerendering
export const prerender = true;

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  const { type, slug } = params;
  
  // Validate event type
  const validTypes = ['speaking', 'organizing', 'media'];
  if (!validTypes.includes(type)) {
    throw error(404, `Event type '${type}' not found`);
  }
  
  try {
    // Get all events and filter directly
    const events = getAllEvents().filter(event => event.type === type);
    
    // Find the specific event by slug
    const event = events.find(e => e.slug === slug);
    
    if (!event) {
      throw error(404, `Event with slug '${slug}' not found`);
    }
    
    return {
      event
    };
  } catch (err) {
    console.error('Error loading event:', err);
    throw error(500, 'Failed to load event data');
  }
} 