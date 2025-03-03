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
    
    // First extract all code blocks from the original markdown
    const codeBlocks = [];
    const codeRegex = /```(\w*)\n([\s\S]*?)\n```/g;
    let match;
    
    while ((match = codeRegex.exec(content)) !== null) {
      const language = match[1] || 'text';
      const code = match[2];
      // Generate a unique ID for this code block
      const id = `CODE_BLOCK_${codeBlocks.length}`;
      codeBlocks.push({
        id,
        language,
        code
      });
    }
    
    // Create custom renderer for marked
    const renderer = new marked.Renderer();
    
    // Override code renderer to handle code blocks
    renderer.code = function(code, language) {
      // If this is a [object Object] which is a placeholder for a code block
      if (code === '[object Object]') {
        // Try to find the corresponding original code block
        if (codeBlocks.length > 0) {
          // Just use the first code block we haven't used yet
          // This is a simplification, but should work for most cases
          const blockIndex = codeBlocks.findIndex(block => !block.used);
          if (blockIndex !== -1) {
            codeBlocks[blockIndex].used = true;
            const block = codeBlocks[blockIndex];
            return `<pre class="language-${block.language}"><code class="language-${block.language}">${escapeHtml(block.code)}</code></pre>`;
          }
        }
        
        // If we can't find a matching code block, use a default language
        const lang = language || 'text';
        return `<pre class="language-${lang}"><code class="language-${lang}">// Original code not found</code></pre>`;
      }
      
      // Make sure code is a string
      const codeStr = typeof code === 'string' ? code : String(code || '');
      
      // Determine the language
      let lang = language || 'text';
      
      // Improved language detection
      if (lang === 'svelte' || (lang === 'text' && codeStr.includes('<script>') && codeStr.includes('</script>'))) {
        lang = 'svelte';
      } else if (lang === 'js' || lang === 'javascript' || 
                 (lang === 'text' && (codeStr.includes('function') || codeStr.includes('const') || codeStr.includes('import')))) {
        lang = 'javascript';
      } else if (lang === 'html' || lang === 'markup' || 
                 (lang === 'text' && codeStr.includes('<') && codeStr.includes('</') && codeStr.includes('>'))) {
        lang = 'html';
      } else if (lang === 'css' || 
                 (lang === 'text' && codeStr.includes('{') && codeStr.includes('}') && 
                  (codeStr.includes('px') || codeStr.includes('margin') || codeStr.includes('padding')))) {
        lang = 'css';
      } else if (lang === 'bash' || lang === 'sh' || 
                 (lang === 'text' && (codeStr.includes('npm ') || codeStr.includes('npx ') || codeStr.includes('cd ')))) {
        lang = 'bash';
      }
      
      // Format the code block
      return `<pre class="language-${lang}"><code class="language-${lang}">${escapeHtml(codeStr)}</code></pre>`;
    };
    
    // Configure marked with minimal settings
    marked.setOptions({
      renderer: renderer,
      gfm: true,
      breaks: true,
      headerIds: true,
      langPrefix: 'language-'
    });
    
    // Process the markdown to HTML
    const html = marked.parse(content);
    
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