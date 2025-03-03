import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to escape HTML
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Configure marked with minimal settings
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true,
  langPrefix: 'language-'
});

// Custom renderer for marked
const renderer = new marked.Renderer();

// Override the code block renderer to properly handle code blocks
renderer.code = function(code, language) {
  // If language is not specified, use 'text'
  const lang = language || 'text';
  
  // Escape the code content for HTML safety
  const escapedCode = escapeHtml(code);
  
  // Return HTML with proper language classes
  return `<pre class="language-${lang}"><code class="language-${lang}">${escapedCode}</code></pre>`;
};

// Process content for each content type
function processContent(contentType) {
  console.log(`Processing ${contentType}...`);
  const contentDir = `src/content/${contentType}`;
  const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));
  
  const items = [];
  
  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Process markdown to HTML with our custom renderer
    const html = marked.parse(content, { renderer });
    
    const slug = path.basename(file, '.md');
    items.push({
      slug,
      ...data,
      content: html
    });
  }
  
  // Write to JSON file
  fs.writeFileSync(
    `src/lib/generated/${contentType === 'blog' ? 'blog-posts' : contentType === 'publications' ? 'publications' : 'research-areas'}.json`,
    JSON.stringify(items, null, 2)
  );
  
  console.log(`✓ Generated ${items.length} ${contentType} items`);
  return items;
}

// Process all content types
try {
  // Create the directory if it doesn't exist
  if (!fs.existsSync('src/lib/generated')) {
    fs.mkdirSync('src/lib/generated', { recursive: true });
  }
  
  processContent('blog');
  processContent('publications');
  processContent('research');
  console.log('Content generation complete!');
} catch (error) {
  console.error('Error generating content:', error);
} 