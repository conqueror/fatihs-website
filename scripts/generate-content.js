import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure marked to add language classes to code blocks
marked.setOptions({
  highlight: function(code, lang) {
    // Just pass the code through, Prism will handle highlighting on the client
    return code;
  },
  langPrefix: 'language-', // Prefix for language class (e.g., language-js)
  gfm: true, // Enable GitHub Flavored Markdown
  breaks: true, // Convert line breaks to <br>
  headerIds: true, // Add IDs to headers
  mangle: false, // Don't escape autolinked emails
  pedantic: false, // Common Markdown implementation, not pedantic mode
  sanitize: false, // Don't sanitize - we sanitize with DOMPurify later
  smartLists: true, // Smart list handling
  smartypants: true // Smart punctuation
});

// Custom renderer to ensure proper code highlighting
const renderer = new marked.Renderer();

// Custom renderer for code blocks
renderer.code = function(code, language) {
  // Ensure code is a string
  const codeStr = typeof code === 'string' ? code : String(code);
  
  // Escape HTML in code to prevent issues
  const escapedCode = codeStr
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  // Default to "text" if no language specified
  const lang = language || 'text';
  
  // Return HTML with proper language classes
  return `<pre class="language-${lang}"><code class="language-${lang}">${escapedCode}</code></pre>`;
};

// Use the custom renderer
marked.use({ renderer });

// Process all content types
function processContent(contentType) {
  console.log(`Processing ${contentType}...`);
  
  const contentDir = path.join(path.resolve(__dirname, '..'), `src/content/${contentType}`);
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  
  const items = files.map(filename => {
    const filePath = path.join(contentDir, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Convert markdown to HTML
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