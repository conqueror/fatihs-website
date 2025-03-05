# Search Engine Verification

This directory contains files needed for verifying ownership of the site with various search engines and webmaster tools.

## Google Search Console Verification

1. Visit [Google Search Console](https://search.console.google.com/)
2. Add property: https://fatihnayebi.com
3. Choose "HTML file" verification method
4. Download the HTML verification file (will look like `google*.html`)
5. Place the file in the `static` directory (not in this `.well-known` directory)
6. Click "Verify" in Google Search Console

## Bing Webmaster Tools Verification

1. Visit [Bing Webmaster Tools](https://www.bing.com/webmasters/)
2. Add your site
3. Choose "Place an XML file on your website" verification method
4. Download the XML verification file (will look like `BingSiteAuth.xml`)
5. Place the file in the `static` directory
6. Click "Verify" in Bing Webmaster Tools

## Alternative Verification Methods

### META Tag Verification (Recommended for Static Sites)

For Google Search Console:
- Add the provided meta tag to the `<head>` section of your site
- In our SvelteKit site, this would go in the SEO.svelte component

For Bing Webmaster Tools:
- Add the provided meta tag to the `<head>` section
- In our SvelteKit site, this would go in the SEO.svelte component

### DNS Verification

1. Add the provided TXT record to your domain's DNS settings
2. Wait for DNS propagation (can take up to 72 hours)
3. Click "Verify" in the respective webmaster tools

## After Verification

1. Submit your sitemap.xml:
   - Google Search Console: Sitemaps > Add a new sitemap > Enter "sitemap.xml"
   - Bing Webmaster Tools: Sitemaps > Submit a Sitemap > Enter "sitemap.xml"

2. Check for any immediate issues or warnings

3. Set up email notifications for critical issues 