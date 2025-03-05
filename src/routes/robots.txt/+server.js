/**
 * Generate robots.txt dynamically
 * This allows customization based on environment or other conditions
 * 
 * Following SEO best practices to properly instruct search engine crawlers
 */
export function GET({ url }) {
  const website = url.origin;
  
  // Define the robots.txt content
  const robotsTxt = `# www.robotstxt.org

# Allow crawling of all content
User-agent: *
Allow: /

# Disallow utility and internal paths
Disallow: /api/
Disallow: /_app/
Disallow: /admin/
Disallow: /dashboard/

# Sitemap location
Sitemap: ${website}/sitemap.xml

# Additional instructions for specific bots
User-agent: GPTBot
Allow: /blog/
Allow: /publications/
Allow: /research/
Allow: /about/

User-agent: Bingbot
Crawl-delay: 5

User-agent: Googlebot-Image
Allow: /images/
`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'max-age=3600'
    }
  });
} 