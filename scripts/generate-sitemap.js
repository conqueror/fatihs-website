/**
 * Simple sitemap generator for fatihnayebi.com
 * This script creates a basic sitemap.xml file with the main pages of the site
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the base URL for your site
const BASE_URL = 'https://fatihnayebi.com';

// Define the main pages of your site
const PAGES = [
  { url: '/', changefreq: 'weekly', priority: '1.0' },
  { url: '/about', changefreq: 'monthly', priority: '0.8' },
  { url: '/blog', changefreq: 'weekly', priority: '0.9' },
  { url: '/publications', changefreq: 'monthly', priority: '0.8' },
  { url: '/events', changefreq: 'weekly', priority: '0.9' },
  { url: '/events/speaking', changefreq: 'weekly', priority: '0.8' },
  { url: '/events/organizing', changefreq: 'weekly', priority: '0.8' },
  { url: '/events/media', changefreq: 'weekly', priority: '0.8' },
  { url: '/contact', changefreq: 'monthly', priority: '0.7' }
];

// Get current date in ISO format for lastmod
const currentDate = new Date().toISOString();

// Generate the sitemap XML content
function generateSitemap() {
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
  sitemap += '      xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\n';
  sitemap += '      xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9\n';
  sitemap += '            http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';

  // Add each page to the sitemap
  PAGES.forEach(page => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${BASE_URL}${page.url}</loc>\n`;
    sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
    sitemap += `    <changefreq>${page.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${page.priority}</priority>\n`;
    sitemap += '  </url>\n';
  });

  // Try to add dynamic pages from JSON data
  try {
    // Add blog posts
    if (fs.existsSync(path.join(__dirname, '../src/lib/generated/blog-posts.json'))) {
      const blogPostsData = fs.readFileSync(path.join(__dirname, '../src/lib/generated/blog-posts.json'), 'utf8');
      const blogPosts = JSON.parse(blogPostsData);
      
      blogPosts.forEach(post => {
        sitemap += '  <url>\n';
        sitemap += `    <loc>${BASE_URL}/blog/${post.slug}</loc>\n`;
        sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
        sitemap += `    <changefreq>monthly</changefreq>\n`;
        sitemap += `    <priority>0.7</priority>\n`;
        sitemap += '  </url>\n';
      });
    }
    
    // Add publications
    if (fs.existsSync(path.join(__dirname, '../src/lib/generated/publications.json'))) {
      const publicationsData = fs.readFileSync(path.join(__dirname, '../src/lib/generated/publications.json'), 'utf8');
      const publications = JSON.parse(publicationsData);
      
      publications.forEach(pub => {
        sitemap += '  <url>\n';
        sitemap += `    <loc>${BASE_URL}/publications/${pub.slug}</loc>\n`;
        sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
        sitemap += `    <changefreq>monthly</changefreq>\n`;
        sitemap += `    <priority>0.7</priority>\n`;
        sitemap += '  </url>\n';
      });
    }
    
    // Add events
    if (fs.existsSync(path.join(__dirname, '../src/lib/generated/events.json'))) {
      const eventsData = fs.readFileSync(path.join(__dirname, '../src/lib/generated/events.json'), 'utf8');
      const events = JSON.parse(eventsData);
      
      events.forEach(event => {
        // Make sure the event has both type and slug
        if (event.type && event.slug) {
          sitemap += '  <url>\n';
          sitemap += `    <loc>${BASE_URL}/events/${event.type}/${event.slug}</loc>\n`;
          sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
          sitemap += `    <changefreq>monthly</changefreq>\n`;
          sitemap += `    <priority>0.7</priority>\n`;
          sitemap += '  </url>\n';
        }
      });
    }
  } catch (error) {
    console.error('Error adding dynamic pages to sitemap:', error);
  }

  sitemap += '</urlset>';
  return sitemap;
}

// Write the sitemap to a file
function writeSitemap() {
  try {
    // Create the static directory if it doesn't exist
    const staticDir = path.join(__dirname, '../static');
    if (!fs.existsSync(staticDir)) {
      fs.mkdirSync(staticDir, { recursive: true });
    }

    // Generate and write the sitemap
    const sitemap = generateSitemap();
    fs.writeFileSync(path.join(staticDir, 'sitemap.xml'), sitemap);
    console.log('✅ Sitemap generated successfully');
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
  }
}

// Run the script
writeSitemap(); 