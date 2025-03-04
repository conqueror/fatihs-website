/**
 * Generate robots.txt dynamically
 * This allows customization based on environment or other conditions
 */
export function GET({ url }) {
  const website = url.origin;
  
  // Define the robots.txt content
  const robotsTxt = `# www.robotstxt.org

# Allow crawling of all content
User-agent: *
Allow: /

# Disallow admin paths 
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/

# Sitemap location
Sitemap: ${website}/sitemap.xml
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
} 