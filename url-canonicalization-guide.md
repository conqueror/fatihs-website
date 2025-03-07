# URL Canonicalization & HTTPS Enforcement Guide

This guide details how to properly configure URL canonicalization and HTTPS enforcement for your personal website hosted on Kinsta. When implemented, all visitors to your site will be redirected to the secure, canonical version (`https://fatihnayebi.com`), regardless of how they entered your domain.

## Setup Overview

**Current Status:**
- Domain registered with NameCheap
- Website hosted on Kinsta (static site)
- Built with SvelteKit

**Target Configuration:**
- All traffic directed to `https://fatihnayebi.com`
- Automatic redirects from variants like:
  - `http://fatihnayebi.com`
  - `http://www.fatihnayebi.com`
  - `https://www.fatihnayebi.com`

## Step 1: Configure DNS Records at NameCheap

### NameCheap DNS Configuration

1. Log into your NameCheap account
2. Go to "Domain List" and click "Manage" next to fatihnayebi.com
3. Click the "Advanced DNS" tab
4. Ensure the following records exist:

   **A Record**
   - Host: @ (represents root domain)
   - Value: [Your Kinsta IP address]
   - TTL: Automatic

   **CNAME Record**
   - Host: www
   - Value: fatihnayebi.com.
   - TTL: Automatic

5. Save changes
6. Note: DNS changes may take 24-48 hours to fully propagate

## Step 2: URL Canonicalization on Kinsta Static Sites

Kinsta's static site hosting uses a different configuration approach than WordPress sites. For static sites, you have three main options to configure URL canonicalization:

### Option 1: Using a `_redirects` File (Recommended)

1. Create or edit the file `static/_redirects` in your project
2. Add the following redirect rules:

```
# Redirect HTTP to HTTPS and www to non-www
http://fatihnayebi.com/*         https://fatihnayebi.com/:splat         301!
http://www.fatihnayebi.com/*     https://fatihnayebi.com/:splat         301!
https://www.fatihnayebi.com/*    https://fatihnayebi.com/:splat         301!

# Preserve existing SPA routing redirects below this line
/* /index.html 200
```

3. Ensure this file is included in your build output by placing it in the `static` folder

### Option 2: Using `kinsta.toml` Configuration

1. Edit your existing `kinsta.toml` file to include the following redirects:

```toml
# Add these redirect rules
[[redirects]]
  from = "http://fatihnayebi.com/*"
  to = "https://fatihnayebi.com/:splat"
  status = 301
  force = true

[[redirects]]
  from = "http://www.fatihnayebi.com/*"
  to = "https://fatihnayebi.com/:splat"
  status = 301
  force = true

[[redirects]]
  from = "https://www.fatihnayebi.com/*"
  to = "https://fatihnayebi.com/:splat"
  status = 301
  force = true
```

2. Make sure these redirect rules are placed before any SPA routing redirects

### Option 3: Using `.htaccess` Configuration

1. Edit your existing `.htaccess` file to include the following rules:

```apache
# Add these redirect rules at the top of the file
RewriteEngine On

# Redirect HTTP to HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Redirect www to non-www
RewriteCond %{HTTP_HOST} ^www\.fatihnayebi\.com$ [NC]
RewriteRule ^(.*)$ https://fatihnayebi.com/$1 [L,R=301]

# Keep existing rules below
```

2. Kinsta static sites may not process `.htaccess` files in all cases, so Options 1 or 2 are preferred

## Step 3: Implement Canonical URLs in Your SvelteKit App

### Adding Canonical URLs in SvelteKit

1. Open your SvelteKit project locally
2. Create or modify `src/routes/+layout.svelte` to include:

```svelte
<script>
  import { page } from '$app/stores';
</script>

<svelte:head>
  <link rel="canonical" href="https://fatihnayebi.com{$page.url.pathname}" />
</svelte:head>

<slot />
```

3. Rebuild and deploy your site to Kinsta

## Step 4: Configure HSTS Security Headers

The HSTS header is already configured in your `kinsta.toml` file with:

```toml
[[headers.values]]
  for = "/*"
  [headers.values.value]
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"
```

This ensures browsers always use HTTPS for your site even if users try to access it via HTTP.

## Step 5: Testing Your Configuration

### Testing Redirects

After implementing all changes, test your redirects using the following methods:

#### Browser Testing
1. Open an incognito/private browsing window (to avoid cache interference)
2. Try accessing each of these URLs:
   - http://fatihnayebi.com
   - http://www.fatihnayebi.com  
   - https://www.fatihnayebi.com
3. Verify that each URL redirects to https://fatihnayebi.com

#### Command Line Testing
Run the following commands in Terminal/Command Prompt:

```bash
curl -I http://fatihnayebi.com
curl -I http://www.fatihnayebi.com
curl -I https://www.fatihnayebi.com
```

Look for:
- `HTTP/1.1 301 Moved Permanently` in the response
- `Location: https://fatihnayebi.com` in the header

#### Deep Link Testing
Test redirects with path components:
- http://www.fatihnayebi.com/blog
- http://fatihnayebi.com/research

## Step 6: SEO Monitoring and Verification

### SEO Verification

1. Add all domain variants to Google Search Console:
   - https://fatihnayebi.com (primary)
   - https://www.fatihnayebi.com
   - http://fatihnayebi.com
   - http://www.fatihnayebi.com

2. Set preferred domain as https://fatihnayebi.com

3. After verification, submit an updated sitemap

4. Monitor for crawl errors over the next 2-4 weeks

## Troubleshooting

### Common Issues and Solutions

#### Redirect Loops
If you're experiencing redirect loops:
- Check for conflicting redirect rules
- Ensure the destination URL doesn't trigger another redirect
- Clear your browser cache or test in incognito mode

#### SPA Routing Conflicts
If SPA routes stop working after adding redirects:
- Ensure that URL canonicalization redirects have higher priority than SPA routing redirects
- For the `_redirects` file, place canonicalization rules at the top
- Test deep links after implementing redirects to ensure they still work

#### HTTPS Not Enforced
If HTTP still works without redirecting:
- Check that redirect rules are correctly implemented
- Verify redirects are included in the deployment
- Test with different browsers and from different networks

## Additional Resources

### Helpful Links

- [Kinsta Static Site Hosting Documentation](https://kinsta.com/docs/static-site-hosting/)
- [NameCheap DNS Management Guide](https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-do-i-set-up-host-records-for-a-domain/)
- [HSTS Preload Submission](https://hstspreload.org/) (Optional advanced security)
- [Google's HTTPS Guidelines](https://developers.google.com/search/docs/advanced/security/https)

## Performance Impact

Proper URL canonicalization and HTTPS enforcement provide several benefits:

1. **Improved SEO rankings**: Search engines prefer secure sites and consistent URLs
2. **Faster subsequent page loads**: HTTPS connections can be kept alive for multiple requests
3. **Access to modern browser features**: Many new web APIs require HTTPS
4. **Avoids duplicate content penalties**: Ensures all SEO value accrues to a single canonical URL
5. **Enhanced security**: Protects your visitors' privacy and data integrity

## Implementation Notes for Your Current Setup

Based on analyzing your current configuration files:

1. **Current State**: Your Kinsta configuration already includes HSTS headers but lacks explicit canonicalization redirects.

2. **Recommended Action**: The simplest solution is to update your `static/_redirects` file with the canonicalization rules, as it already exists and handles your SPA routing.

3. **Deployment Consideration**: After adding these redirects, make sure to rebuild and redeploy your site to Kinsta.

4. **Alternative Approach**: If you prefer configuration files, add the canonicalization redirects to your `kinsta.toml` file before any SPA routing rules.

5. **Testing Plan**: After deployment, test all the variants of your domain with both direct URL access and deep links to ensure proper redirection. 