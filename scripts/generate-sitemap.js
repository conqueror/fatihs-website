/**
 * Script to generate a static sitemap.xml file
 * This is run during the build process to create a sitemap that is placed in the static directory
 * This ensures proper static site generation for Kinsta hosting
 * 
 * Since we can't access SvelteKit-specific imports like $app in Node.js scripts outside of SvelteKit,
 * we create a basic sitemap with just the static pages.
 */
 
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSitemap() {
  console.log('Generating sitemap.xml...');
  
  // Set base URL for the site
  const website = 'https://fatihnayebi.com';
  const currentDate = new Date().toISOString();
  
  // Create the sitemap XML structure with static pages
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
    <image:image>
      <image:loc>${website}/images/profile-photo.jpg</image:loc>
      <image:title>Dr. Fatih Nayebi</image:title>
      <image:caption>AI Researcher and Developer</image:caption>
    </image:image>
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
  <url>
    <loc>${website}/privacy</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  
  <!-- Note: Dynamic content pages like blog posts, publications, and research areas
       will be built by SvelteKit during static site generation -->
</urlset>`;

  // Write the sitemap to the static directory
  const staticDir = path.join(__dirname, '../static');
  fs.writeFileSync(path.join(staticDir, 'sitemap.xml'), sitemap);
  
  console.log('Successfully generated sitemap.xml');
}

// Run the generator
generateSitemap().catch(console.error); 