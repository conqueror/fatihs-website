import { getAllPosts } from '$lib/utils/blog';
import { getAllPublications } from '$lib/utils/publications';
import { getAllResearchAreas } from '$lib/utils/research';

/**
 * Generate XML sitemap for better SEO
 * This creates a dynamic sitemap.xml endpoint that search engines can access
 */
export async function GET({ url }) {
  const website = url.origin;
  const currentDate = new Date().toISOString();
  
  // Get all content from the site
  const blogPosts = await getAllPosts();
  const publications = await getAllPublications();
  const researchAreas = await getAllResearchAreas();
  
  // Create the sitemap XML structure
  const sitemap = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="https://www.w3.org/1999/xhtml"
  xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
  xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
  <!-- Static pages -->
  <url>
    <loc>${website}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${website}/about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${website}/publications</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${website}/blog</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${website}/research</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${website}/contact</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${website}/search</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  
  <!-- Blog posts -->
  ${blogPosts
    .map(
      (post) => `
  <url>
    <loc>${website}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt || post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('')}
  
  <!-- Publications -->
  ${publications
    .map(
      (pub) => `
  <url>
    <loc>${website}/publications/${pub.slug}</loc>
    <lastmod>${pub.date}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('')}
    
  <!-- Research Areas -->
  ${researchAreas
    .map(
      (area) => `
  <url>
    <loc>${website}/research/${area.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'max-age=3600, s-maxage=86400'
    }
  });
} 