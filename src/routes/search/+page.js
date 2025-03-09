// Enable prerendering
export const prerender = true;

import { getAllBlogPosts } from '$lib/utils/markdown';
import { getAllPublications } from '$lib/utils/publications';
import { getAllEvents } from '$lib/utils/events';

/** @type {import('./$types').PageLoad} */
export function load({ url }) {
  // Get query parameters
  const query = url.searchParams.get('query') || '';
  const type = url.searchParams.get('type') || 'all';
  
  // If there's no query, return empty results
  if (!query) {
    return {
      query,
      type,
      results: [],
      blogResults: [],
      publicationResults: [],
      eventResults: []
    };
  }
  
  // Perform server-side search
  const lowerQuery = query.toLowerCase();
  
  // Search in blog posts
  const blogResults = getAllBlogPosts().filter(post => {
    return (
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      (post.rawContent && post.rawContent.toLowerCase().includes(lowerQuery)) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }).map(post => ({
    ...post,
    type: 'blog'
  }));
  
  // Search in publications
  const publicationResults = getAllPublications().filter(pub => {
    return (
      pub.title.toLowerCase().includes(lowerQuery) ||
      (pub.excerpt && pub.excerpt.toLowerCase().includes(lowerQuery)) ||
      (pub.abstract && pub.abstract.toLowerCase().includes(lowerQuery)) ||
      (pub.rawContent && pub.rawContent.toLowerCase().includes(lowerQuery)) ||
      (pub.content && pub.content.toLowerCase().includes(lowerQuery)) ||
      (pub.tags && pub.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  }).map(pub => ({
    ...pub,
    type: 'publication'
  }));
  
  // Search in events
  const eventResults = getAllEvents().filter(event => {
    return (
      event.title.toLowerCase().includes(lowerQuery) ||
      event.event.toLowerCase().includes(lowerQuery) ||
      (event.excerpt && event.excerpt.toLowerCase().includes(lowerQuery)) ||
      (event.content && event.content.toLowerCase().includes(lowerQuery)) ||
      (event.location && event.location.toLowerCase().includes(lowerQuery)) ||
      (event.tags && event.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
    );
  }).map(event => ({
    ...event,
    searchType: 'event',
    eventType: event.type  // Store original event type
  }));
  
  // Filter by type and combine results
  let results = [];
  if (type === 'blog') {
    results = blogResults;
  } else if (type === 'publication') {
    results = publicationResults;
  } else if (type === 'event') {
    results = eventResults;
  } else {
    // All results, sorted by date
    results = [...blogResults, ...publicationResults, ...eventResults]
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  
  // Return all data
  return {
    query,
    type,
    results,
    blogResults,
    publicationResults,
    eventResults
  };
} 