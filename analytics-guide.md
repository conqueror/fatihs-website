# Lightweight Mobile Monitoring Guide

> A performance-focused approach to monitoring mobile access issues for fatihnayebi.com

## Contents

1. [Introduction](#introduction)
2. [External Monitoring (Zero Performance Impact)](#external-monitoring-zero-performance-impact)
3. [Service Worker Monitoring](#service-worker-monitoring)
4. [Minimal Client-Side Analytics](#minimal-client-side-analytics)
5. [SEO-Critical Resources Monitoring](#seo-critical-resources-monitoring)
6. [Implementation Guide](#implementation-guide)
7. [Maintenance and Alerts](#maintenance-and-alerts)

## Introduction

This guide outlines a strategy for monitoring mobile access to fatihnayebi.com while maintaining site performance. Our monitoring approach follows these principles:

- **Performance First**: All solutions minimize or eliminate client-side performance impact
- **Static Site Integrity**: Preserve the static nature of the site without adding server dependencies
- **Early Detection**: Catch mobile-specific issues before users report them
- **Actionable Data**: Collect only data that helps diagnose specific problems
- **SEO Protection**: Ensure search engines can properly access and index the site

## External Monitoring (Zero Performance Impact)

These solutions operate entirely outside your website, with zero impact on performance.

### 1. Uptime Robot with Mobile User-Agent

[Uptime Robot](https://uptimerobot.com/) provides free monitoring with mobile user-agent support.

**Setup:**

1. Create a free account at UptimeRobot
2. Add a new HTTP(s) monitor for https://fatihnayebi.com
3. Set "Monitoring Interval" to 5 minutes
4. Under "Advanced Options":
   - Set "HTTP Headers" to: `User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1`
5. Set up alerts via email

### 2. Mobile Healthcheck Script

Create a GitHub Action or cron job that runs the following bash script:

```bash
#!/bin/bash
# mobile-healthcheck.sh - Run on a schedule to test mobile access
SITE="https://fatihnayebi.com"
MOBILE_UA="Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.3 Mobile/15E148 Safari/604.1"
ALERT_EMAIL="your-email@example.com"

# Test the main site with a mobile user-agent
STATUS=$(curl -s -o /dev/null -w "%{http_code}" -A "$MOBILE_UA" "$SITE")

if [ "$STATUS" -ne 200 ]; then
  # Log error
  echo "$(date): Mobile access failed with status $STATUS" >> mobile-check.log
  
  # Send alert email
  echo "Mobile access to $SITE failed with status $STATUS" | mail -s "⚠️ Mobile Website Alert" $ALERT_EMAIL
else
  echo "$(date): Mobile check passed (status $STATUS)" >> mobile-check.log
fi

# Check SEO-critical files
ROBOTS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE/robots.txt")
SITEMAP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$SITE/sitemap.xml")

if [ "$ROBOTS_STATUS" -ne 200 ]; then
  echo "$(date): robots.txt is not accessible (status $ROBOTS_STATUS)" >> mobile-check.log
  echo "robots.txt at $SITE/robots.txt is not accessible (status $ROBOTS_STATUS)" | mail -s "⚠️ SEO Critical Alert" $ALERT_EMAIL
fi

if [ "$SITEMAP_STATUS" -ne 200 ]; then
  echo "$(date): sitemap.xml is not accessible (status $SITEMAP_STATUS)" >> mobile-check.log
  echo "sitemap.xml at $SITE/sitemap.xml is not accessible (status $SITEMAP_STATUS)" | mail -s "⚠️ SEO Critical Alert" $ALERT_EMAIL
fi

# Optional: Test a few critical pages
CRITICAL_PAGES=("/blog" "/about" "/contact")

for page in "${CRITICAL_PAGES[@]}"; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -A "$MOBILE_UA" "$SITE$page")
  
  if [ "$STATUS" -ne 200 ]; then
    echo "$(date): Mobile access failed on $page with status $STATUS" >> mobile-check.log
    echo "Mobile access to $SITE$page failed with status $STATUS" | mail -s "⚠️ Mobile Website Page Alert" $ALERT_EMAIL
  fi
done
```

### 3. Use Kinsta Analytics

If your site is hosted on Kinsta:

1. Log in to your Kinsta dashboard
2. Navigate to "Analytics" for your site
3. Use filters to check mobile traffic specifically
4. Set up email reports with mobile-specific segments

## Service Worker Monitoring

Enhance your existing service worker with minimal error logging.

### Implementation in `static/sw.js`:

```javascript
// Near the top of your service worker, add these variables
const ENABLE_LOGGING = true;
const MOBILE_ISSUES_ONLY = true;
let issueSummary = {};

// SEO-critical files that should bypass the service worker
const SEO_CRITICAL_FILES = [
  '/robots.txt',
  '/sitemap.xml'
];

// The original fetch listener with added diagnostics
self.addEventListener('fetch', event => {
  // Don't intercept SEO-critical files
  const url = new URL(event.request.url);
  if (SEO_CRITICAL_FILES.includes(url.pathname)) {
    return; // Let the browser handle these directly
  }

  const ua = event.request.headers.get('user-agent') || '';
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua);
  
  // Only monitor mobile requests if configured
  if (!ENABLE_LOGGING || (MOBILE_ISSUES_ONLY && !isMobile)) {
    // Process normally without monitoring
    return;
  }
  
  // Start timing the request (only for diagnosis when needed)
  const startTime = performance.now();
  
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Only log failed responses
        if (!response.ok) {
          logIssue(event.request.url, response.status, ua, isMobile);
        }
        return response;
      })
      .catch(err => {
        // Log network failures
        logIssue(event.request.url, 'network-error', ua, isMobile, err.message);
        
        // Continue with your existing offline fallback
        return caches.match(event.request) || caches.match('/offline.html');
      })
  );
});

// Minimal logging function - stores in IndexedDB for later recovery
function logIssue(url, status, userAgent, isMobile, errorMsg = '') {
  // Convert URL to a relative path if possible
  const urlObj = new URL(url);
  const path = urlObj.pathname;
  
  // Create compact issue summary
  const key = `${status}:${path}`;
  if (!issueSummary[key]) {
    issueSummary[key] = {
      status,
      path,
      count: 0,
      mobile: isMobile,
      firstSeen: new Date().toISOString()
    };
  }
  
  issueSummary[key].count++;
  issueSummary[key].lastSeen = new Date().toISOString();
  
  // Store to IndexedDB for recovery if needed
  storeIssueData(issueSummary);
}

// Store issue data to IndexedDB (only called when issues occur)
function storeIssueData(data) {
  // Use IndexedDB to store issue data (code not shown for brevity)
  // You can implement this using idb-keyval or a similar library
  
  // This data remains in the user's browser and can be retrieved
  // if they report an issue, providing valuable diagnostic information
}

// Add a message handler to retrieve logs when needed
self.addEventListener('message', event => {
  if (event.data && event.data.command === 'get-issue-logs') {
    event.ports[0].postMessage(issueSummary);
  }
});
```

## Minimal Client-Side Analytics

For a completely static approach that helps diagnose issues without impacting performance:

### Add to `+layout.svelte`:

```html
<script>
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  onMount(() => {
    // Only run in browser, after critical content loads
    if (browser) {
      // Execute non-blocking after a short delay
      setTimeout(() => {
        // Only run once per session
        if (!sessionStorage.getItem('mobile_check_run')) {
          sessionStorage.setItem('mobile_check_run', 'true');
          
          // Detect mobile
          const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
          
          if (isMobile) {
            // Create a tiny pixel to verify mobile rendering completed successfully
            const pixel = document.createElement('img');
            pixel.src = '/mobile-check.gif?t=' + new Date().getTime();
            pixel.style.position = 'absolute';
            pixel.style.width = '1px';
            pixel.style.height = '1px';
            pixel.style.opacity = '0.01';
            document.body.appendChild(pixel);
            
            // Optionally store success in localStorage for diagnostics
            localStorage.setItem('mobile_loaded', new Date().toISOString());
          }
        }
      }, 2000); // Wait for page to fully render
    }
  });
</script>

<!-- Rest of your layout -->
```

### Create a 1x1 transparent GIF at `static/mobile-check.gif`

This lets you verify in server logs that mobile clients completed page rendering.

## SEO-Critical Resources Monitoring

Ensure search engines can properly crawl and index your site:

### 1. Create Dedicated Endpoints for SEO Files

For robots.txt and sitemap.xml, create dedicated server endpoints to ensure they're always accessible:

```javascript
// src/routes/robots.txt/+server.js
export function GET() {
  return new Response(`# www.robotstxt.org
# Allow crawling of all content
User-agent: *
Allow: /
# ... rest of robots.txt content ...`, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}

// src/routes/sitemap.xml/+server.js
export function GET() {
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- sitemap content -->
</urlset>`, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
```

### 2. Set Up Search Console Monitoring

1. Register your site with Google Search Console
2. Set up email alerts for crawl errors
3. Periodically check the Coverage report for indexing issues

### 3. Add SEO Monitors to UptimeRobot

Create separate monitors specifically for robots.txt and sitemap.xml:

1. Add a new HTTP(s) monitor for https://fatihnayebi.com/robots.txt
2. Add a new HTTP(s) monitor for https://fatihnayebi.com/sitemap.xml
3. Set higher alert priority for these SEO-critical resources

## Implementation Guide

### Step 1: Set Up External Monitoring

Start with UptimeRobot as it has zero performance impact.

### Step 2: Enhance Service Worker

Update your service worker with the monitoring code shown above.

### Step 3: Add the Mobile Healthcheck Script

Set this up as a GitHub Action or cron job.

### Step 4: Create SEO-Critical Endpoints

Implement the robots.txt and sitemap.xml endpoint handlers.

### Step 5: Review and Analyze

- Check UptimeRobot daily for mobile access issues
- Review Kinsta Analytics weekly for mobile traffic patterns
- Monitor Search Console for crawling/indexing issues
- If issues are reported, retrieve service worker logs from user

## Maintenance and Alerts

### Responding to Alerts

When you receive a mobile access alert:

1. Try accessing the site yourself with mobile device
2. Check service worker logs if available
3. Review recent deployments or DNS changes
4. Check Kinsta status page for hosting issues
5. Clear caches and test again

For SEO-critical alerts:

1. Verify the resources are accessible with curl or a browser
2. Check for recent changes to SvelteKit configuration
3. Inspect server response headers for unexpected redirects
4. Fix any issues immediately as they can impact search rankings

### Regular Maintenance

Every month:

1. Review monitoring configurations 
2. Update mobile user-agent strings to current versions
3. Check service worker version and update if needed
4. Verify all SEO-critical resources in Search Console

---

**Remember**: This monitoring strategy is designed to provide early detection of mobile access issues with minimal performance impact. The most important data comes from external monitoring, which has zero effect on your site's performance. SEO monitoring ensures your site remains properly indexed by search engines. 