// Disable prerendering for dynamic publication pages
export const prerender = false;

/** @type {import('./$types').PageLoad} */
export function load({ params, data }) {
  return {
    ...data
  };
} 