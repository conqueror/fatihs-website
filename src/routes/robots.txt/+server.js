/**
 * Dedicated endpoint for serving robots.txt
 * This ensures the file is always accessible regardless of static file configuration
 */
export function GET() {
  return new Response(`# www.robotstxt.org
# Allow crawling of all content
User-agent: *
Allow: /

# Disallow utility and internal paths
Disallow: /api/
Disallow: /_app/
Disallow: /admin/
Disallow: /dashboard/

# Sitemap location
Sitemap: https://fatihnayebi.com/sitemap.xml

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
`, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600'
    }
  });
} 