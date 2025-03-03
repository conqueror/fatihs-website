import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up a custom renderer for marked
const renderer = new marked.Renderer();

// Override the code block renderer to properly format code with language classes
renderer.code = function(code, language = '', isEscaped) {
  // Ensure we have a language specified (default to 'text' if none)
  const lang = language || 'text';
  
  // Clean the code by ensuring it's a string and properly escaped
  const codeStr = String(code);
  const escapedCode = !isEscaped ? escapeHtml(codeStr) : codeStr;
  
  // Return HTML with proper language classes for syntax highlighting
  return `<pre class="language-${lang}"><code class="language-${lang}">${escapedCode}</code></pre>`;
};

// Helper function to escape HTML
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Configure marked with our custom renderer and options
marked.setOptions({
  renderer: renderer,
  gfm: true,
  breaks: true,
  headerIds: true,
  langPrefix: 'language-'
});

// Process all content types
function processContent(contentType) {
  console.log(`Processing ${contentType}...`);
  
  const contentDir = path.join(path.resolve(__dirname, '..'), `src/content/${contentType}`);
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  
  const items = files.map(filename => {
    const filePath = path.join(contentDir, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Convert markdown to HTML with our custom renderer
    const htmlContent = marked.parse(content);
    
    return {
      slug: filename.replace('.md', ''),
      ...data,
      content: htmlContent,
      rawContent: content
    };
  });
  
  // Sort items (by date for blog/publications, by order for research)
  if (contentType === 'research') {
    items.sort((a, b) => (a.order || 0) - (b.order || 0));
  } else {
    items.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  
  // Write processed items to JSON file
  const targetDir = path.join(path.resolve(__dirname, '..'), 'src/lib/generated');
  
  // Make sure target directory exists
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  const outputFile = contentType === 'research' ? 'research-areas.json' : 
                     contentType === 'blog' ? 'blog-posts.json' : 'publications-list.json';
  
  fs.writeFileSync(
    path.join(targetDir, outputFile),
    JSON.stringify(items, null, 2)
  );
  
  console.log(`✓ Generated ${items.length} ${contentType} items`);
}

// Process all content types
try {
  processContent('blog');
  processContent('publications');
  processContent('research');
  console.log('Content generation complete!');
} catch (error) {
  console.error('Error generating content:', error);
  process.exit(1);
} 