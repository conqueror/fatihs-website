import { browser } from '$app/environment';
import blogPosts from '$lib/generated/blog-posts.json';
import conferencesData from '$lib/generated/conferences.json';

export function getAllBlogPosts() {
  return blogPosts;
}

export function getBlogPostBySlug(slug) {
  return blogPosts.find(post => post.slug === slug);
}

export function getFilteredBlogPosts({ tag = null, featured = false } = {}) {
  let filteredPosts = blogPosts;

  if (tag) {
    filteredPosts = filteredPosts.filter(post => post.tags.includes(tag));
  }

  if (featured) {
    filteredPosts = filteredPosts.filter(post => post.featured);
  }

  return filteredPosts;
}

export function getAllConferences() {
  return conferencesData;
}

export function getConferenceBySlug(slug) {
  return conferencesData.find(conference => conference.slug === slug);
}

export function getFilteredConferences({ year = null, featured = false } = {}) {
  let filteredConferences = conferencesData;

  if (year) {
    filteredConferences = filteredConferences.filter(conference => 
      conference.date.includes(year));
  }

  if (featured) {
    filteredConferences = filteredConferences.filter(conference => conference.featured);
  }

  return filteredConferences;
} 