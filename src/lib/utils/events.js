import { browser } from '$app/environment';
import eventsData from '$lib/generated/events.json';

/**
 * Get all events
 * @returns {Array} All events 
 */
export function getAllEvents() {
  return eventsData;
}

/**
 * Get a specific event by slug
 * @param {string} slug - The event slug
 * @returns {Object|undefined} The event or undefined if not found
 */
export function getEventBySlug(slug) {
  return eventsData.find(event => event.slug === slug);
}

/**
 * Get events by type
 * @param {string} type - The event type (speaking, organizing, media)
 * @returns {Array} Events of the specified type
 */
export function getEventsByType(type) {
  return eventsData.filter(event => event.type === type);
}

/**
 * Get filtered events
 * @param {Object} options - Filter options
 * @param {string|null} options.type - Filter by event type
 * @param {string|null} options.year - Filter by year
 * @param {boolean} options.featured - Filter to featured events only
 * @param {Array} options.tags - Filter by tags (matches any)
 * @param {string|null} options.location - Filter by location
 * @returns {Array} Filtered events
 */
export function getFilteredEvents({
  type = null,
  year = null,
  featured = false,
  tags = [],
  location = null
} = {}) {
  let filteredEvents = eventsData;
  
  if (type) {
    filteredEvents = filteredEvents.filter(event => event.type === type);
  }
  
  if (year) {
    filteredEvents = filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear().toString() === year.toString();
    });
  }
  
  if (featured) {
    filteredEvents = filteredEvents.filter(event => event.featured);
  }
  
  if (tags && tags.length > 0) {
    filteredEvents = filteredEvents.filter(event => 
      tags.some(tag => event.tags && event.tags.includes(tag)));
  }
  
  if (location) {
    filteredEvents = filteredEvents.filter(event => 
      event.location && event.location.includes(location));
  }
  
  return filteredEvents;
}

/**
 * Get unique years from events
 * @returns {Array} Unique years in descending order
 */
export function getEventYears() {
  const years = eventsData
    .map(event => {
      if (!event.date) return null;
      try {
        return new Date(event.date).getFullYear();
      } catch (e) {
        return null;
      }
    })
    .filter(Boolean);
  
  return [...new Set(years)].sort((a, b) => b - a);
}

/**
 * Get unique tags from events
 * @returns {Array} Unique tags in alphabetical order
 */
export function getEventTags() {
  const allTags = eventsData
    .flatMap(event => event.tags || []);
  
  return [...new Set(allTags)].sort();
}

/**
 * Get unique locations from events
 * @returns {Array} Unique locations in alphabetical order
 */
export function getEventLocations() {
  const locations = eventsData
    .map(event => event.location)
    .filter(Boolean);
  
  return [...new Set(locations)].sort();
} 