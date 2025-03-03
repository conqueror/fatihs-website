// preview-server.js
import { createServer } from 'http';
import { handler } from './build/handler.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const server = createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  
  // Check if the requested file exists in the build directory
  const filePath = path.join(__dirname, 'build', pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    // Serve the file directly
    const content = fs.readFileSync(filePath);
    const contentType = getContentType(pathname);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
    return;
  }
  
  // Otherwise, serve the index.html for SPA routing
  const indexPath = path.join(__dirname, 'build', 'index.html');
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(content);
    return;
  }
  
  // If index.html doesn't exist, return 404
  res.writeHead(404);
  res.end('Not found');
});

function getContentType(pathname) {
  const extension = path.extname(pathname).toLowerCase();
  switch (extension) {
    case '.html': return 'text/html';
    case '.css': return 'text/css';
    case '.js': return 'application/javascript';
    case '.json': return 'application/json';
    case '.png': return 'image/png';
    case '.jpg': case '.jpeg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    default: return 'text/plain';
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Preview server running at http://localhost:${PORT}`);
}); 