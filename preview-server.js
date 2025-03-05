// preview-server.js
import { createServer } from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUILD_DIR = path.join(__dirname, 'build');

const server = createServer((req, res) => {
  // Parse URL and normalize pathname
  const { pathname } = new URL(req.url, 'http://localhost');
  
  // Enable debug logging for troubleshooting
  console.log(`Request: ${pathname}`);
  
  // Handle root or trailing slash
  let normalizedPathname = pathname;
  if (pathname === '/' || pathname.endsWith('/')) {
    normalizedPathname = pathname === '/' ? '/index.html' : `${pathname.slice(0, -1)}.html`;
  }
  
  // Build the filepath
  const filePath = path.join(BUILD_DIR, normalizedPathname);
  
  // First check if the file exists directly
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    console.log(`Serving file: ${filePath}`);
    const contentType = getContentType(normalizedPathname);
    serveFile(res, filePath, contentType);
    return;
  }
  
  // Check if .html version exists (for routes without extension)
  if (!normalizedPathname.includes('.')) {
    const htmlPath = `${filePath}.html`;
    if (fs.existsSync(htmlPath) && fs.statSync(htmlPath).isFile()) {
      console.log(`Serving HTML file: ${htmlPath}`);
      serveFile(res, htmlPath, 'text/html');
      return;
    }
  }
  
  // Check if this might be a route request (client-side routing)
  if (!normalizedPathname.includes('.') || normalizedPathname.endsWith('.html')) {
    const indexPath = path.join(BUILD_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      console.log(`Serving SPA route via index.html for: ${pathname}`);
      serveFile(res, indexPath, 'text/html');
      return;
    }
  }
  
  // File not found
  console.log(`404 Not Found: ${filePath}`);
  res.writeHead(404);
  res.end('Not found');
});

function serveFile(res, filePath, contentType) {
  try {
    const content = fs.readFileSync(filePath);
    
    // Create headers with content type
    const headers = { 'Content-Type': contentType };
    
    // Add cache headers based on file type/path
    const relativePath = path.relative(BUILD_DIR, filePath);
    
    if (relativePath === 'index.html' || relativePath.endsWith('.html')) {
      // HTML files - no caching to ensure fresh content
      headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      headers['Pragma'] = 'no-cache';
      headers['Expires'] = '0';
    } else if (relativePath.includes('_app/immutable/')) {
      // SvelteKit immutable assets (fingerprinted) - cache for 1 year
      headers['Cache-Control'] = 'public, max-age=31536000, immutable';
    } else if (relativePath.match(/\.(js|css|woff2?|ttf|eot|otf)$/)) {
      // JS, CSS, fonts - cache for 1 week
      headers['Cache-Control'] = 'public, max-age=604800';
    } else if (relativePath.match(/\.(png|jpe?g|gif|webp|avif|svg|ico)$/)) {
      // Images - cache for 2 weeks
      headers['Cache-Control'] = 'public, max-age=1209600';
    } else {
      // Other static assets - cache for 1 day
      headers['Cache-Control'] = 'public, max-age=86400';
    }
    
    res.writeHead(200, headers);
    res.end(content);
  } catch (error) {
    console.error(`Error serving file ${filePath}:`, error);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
}

function getContentType(pathname) {
  const extension = path.extname(pathname).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
    '.eot': 'application/vnd.ms-fontobject',
    '.ico': 'image/x-icon',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav'
  };
  
  return mimeTypes[extension] || 'text/plain';
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Preview server running at http://localhost:${PORT}`);
  console.log(`SPA routing enabled - all routes will be served from index.html`);
  console.log(`Content is served from: ${BUILD_DIR}`);
}); 