# Hosting Optimization Guide

This guide explains how to verify and enable HTTP/2 and compression on your hosting service.

## Verifying HTTP/2 Support

You can check if your website is using HTTP/2 in several ways:

1. **Using browser developer tools:**
   - Open Chrome DevTools (F12 or Ctrl+Shift+I)
   - Go to the Network tab
   - Reload your page
   - Click on any resource (like your HTML document)
   - Look for "Protocol" in the Headers tab - it should say "h2" for HTTP/2

2. **Using online tools:**
   - Visit [HTTP/2 Test](https://tools.keycdn.com/http2-test)
   - Enter your website URL
   - Check the results

3. **Using command line:**
   ```bash
   curl -I --http2 https://fatihnayebi.com
   ```
   If HTTP/2 is supported, you'll see "HTTP/2" in the response.

## Enabling HTTP/2 on Different Hosting Providers

### Netlify
HTTP/2 is enabled by default on Netlify.

### Vercel
HTTP/2 is enabled by default on Vercel.

### AWS S3 + CloudFront
1. Go to your CloudFront distribution
2. Edit the Behaviors tab
3. Under "Viewer Protocol Policy," select "Redirect HTTP to HTTPS"
4. Save changes

### DigitalOcean App Platform
HTTP/2 is enabled by default.

### Custom Server (Apache)
Add to your apache2.conf or .htaccess:
```
Protocols h2 http/1.1
```

### Custom Server (Nginx)
Update your Nginx config:
```
listen 443 ssl http2;
```

## Verifying Compression

Check if your website is using compression:

1. **Using browser developer tools:**
   - Open Chrome DevTools (F12 or Ctrl+Shift+I)
   - Go to the Network tab
   - Reload your page
   - Click on any resource (like your HTML or JS file)
   - Look for "Content-Encoding" in the Response Headers - it should say "gzip" or "br" (Brotli)

2. **Using online tools:**
   - Visit [GIDNetwork Compression Test](https://www.gidnetwork.com/tools/gzip-test.php)
   - Enter your website URL
   - Check the results

## Enabling Compression

### Netlify
Add to your netlify.toml:
```toml
[build.processing]
  skip_processing = false

[build.processing.css]
  bundle = true
  minify = true

[build.processing.js]
  bundle = true
  minify = true
```

### Vercel
Compression is enabled by default on Vercel.

### AWS S3 + CloudFront
1. Go to your CloudFront distribution
2. Under "Cache and origin request settings," select "Use a cache policy and origin request policy"
3. For the cache policy, choose one that includes compression

### Custom Server (Apache)
Add to your .htaccess:
```
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/x-javascript
</IfModule>
```

### Custom Server (Nginx)
Add to your Nginx config:
```
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

## Testing Performance

After enabling HTTP/2 and compression, test your website performance:

1. Use [PageSpeed Insights](https://pagespeed.web.dev/)
2. Use [WebPageTest](https://www.webpagetest.org/)
3. Run Lighthouse audit in Chrome DevTools

## Additional Optimizations

1. **Use a CDN** - Distributes your content globally
2. **Enable HTTPS** - Required for HTTP/2
3. **Optimize DNS resolution** - Use DNS preconnect for critical domains
4. **Reduce server response time** - Optimize backend code and database queries 