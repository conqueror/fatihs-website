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
    
    // Extract all code blocks from original markdown
    const codeBlocks = [];
    const codeRegex = /```(\w*)\n([\s\S]*?)\n```/g;
    let match;
    while ((match = codeRegex.exec(content)) !== null) {
      codeBlocks.push({
        language: match[1] || 'text',
        code: match[2]
      });
    }
    
    // Custom renderer for code blocks
    const renderer = new marked.Renderer();
    
    // Override the code renderer to handle code properly
    renderer.code = function(code, lang) {
      // Use the original code content
      const language = lang || 'text';
      return `<pre class="language-${language}"><code class="language-${language}">${escapeHtml(code)}</code></pre>`;
    };
    
    // Configure marked with our renderer
    marked.setOptions({
      renderer: renderer,
      gfm: true,
      breaks: true,
      headerIds: true,
      langPrefix: 'language-'
    });
    
    // Process markdown to HTML
    let html = marked.parse(content);
    
    // Direct replacement of [object Object] with actual code
    let objectObjectCount = 0;
    html = html.replace(/<pre class="language-(\w+)"><code class="language-\w+">\[object Object\]<\/code><\/pre>/g, 
      (match, language) => {
        if (objectObjectCount < codeBlocks.length) {
          const codeBlock = codeBlocks[objectObjectCount++];
          return `<pre class="language-${codeBlock.language}"><code class="language-${codeBlock.language}">${escapeHtml(codeBlock.code)}</code></pre>`;
        }
        return match;
      }
    );
    
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