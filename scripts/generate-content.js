import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a custom renderer for marked
const renderer = new marked.Renderer();

// We don't need to customize the heading renderer for now
// Let's use the default one instead

// Store original code renderer method
const originalCodeRenderer = renderer.code;

// Override the code block renderer to add syntax highlighting classes
renderer.code = function (code, lang, isEscaped) {
  // If no language is specified, use 'text'
  const language = lang || 'text';
  
  // Handle all code blocks consistently
  let codeContent;
  
  // Special handling for BibTeX citations which might be showing as [object Object]
  if (code === '[object Object]' && language === 'text') {
    if (this.options && this.options.bibTexContent) {
      return `<pre class="language-bibtex"><code class="language-bibtex">${escapeHtml(this.options.bibTexContent)}</code></pre>`;
    }
  }
  
  // Use the original code content, don't replace it
  codeContent = typeof code === 'string' ? code : String(code || '');
  
  // Trim any trailing special characters that might be causing issues
  const trimmedCode = codeContent.replace(/[%\s]+$/, '');
  
  // Apply syntax highlighting
  const escapedCode = !isEscaped ? escapeHtml(trimmedCode) : trimmedCode;
  const highlightedCode = syntaxHighlight(escapedCode, language);
  
  // Return HTML with proper language classes for syntax highlighting
  return `<pre class="language-${language}"><code class="language-${language}">${highlightedCode}</code></pre>`;
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

// Simplified syntax highlighting function that doesn't cause HTML entity issues
function syntaxHighlight(code, language) {
  // Return empty string if code is empty
  if (!code) {
    return '';
  }
  
  // Just escape the code - no syntax highlighting for now
  // This ensures the code is displayed properly without formatting issues
  return escapeHtml(code);
}

// Configure marked with our custom renderer and options
marked.setOptions({
  renderer: renderer,
  gfm: true,
  breaks: true,
  headerIds: true,
  langPrefix: 'language-'
});

// Function to sanitize HTML content and fix any [object Object] in code blocks
function sanitizeHtml(html, codeBlocks = []) {
  if (!html) return '';
  
  // Replace any [object Object] in code blocks with the original code content
  let blockIndex = 0;
  return html.replace(/<pre class="language-([^"]*)"><code class="language-[^"]*">\[object Object\]<\/code><\/pre>/g, (match, language) => {
    // If we have extracted code blocks, use them
    if (codeBlocks.length > 0 && blockIndex < codeBlocks.length) {
      const { language: extractedLang, code } = codeBlocks[blockIndex++];
      // Use the extracted language if available, otherwise use the one from the match
      const lang = extractedLang || language || 'text';
      
      // Apply minimal processing to the code - just escape HTML entities
      const processedCode = syntaxHighlight(code, lang);
      
      return `<pre class="language-${lang}"><code class="language-${lang}">${processedCode}</code></pre>`;
    }
    
    // Fallback if no code blocks are available
    return match.replace('[object Object]', '// Unable to retrieve original code');
  });
}

function processContent(contentType) {
  console.log(`Processing ${contentType}...`);
  const contentDir = `src/content/${contentType}`;
  const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));
  
  const items = [];
  
  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Extract BibTeX content if it exists
    let bibTexContent = '';
    const bibTexMatch = content.match(/```(?:\s*|bibtex)\n([@\s\S]*?)\n```/);
    if (bibTexMatch && bibTexMatch[1]) {
      bibTexContent = bibTexMatch[1];
    }
    
    // Extract all code blocks to preserve them
    let codeBlocks = [];
    const codeBlockRegex = /```(?:\s*(\w+))?\n([\s\S]*?)```/g;
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      const language = match[1] || 'text';
      const code = match[2];
      codeBlocks.push({ language, code });
    }
    
    // Process markdown to HTML with syntax highlighting
    const renderer = new marked.Renderer();
    
    // Custom renderer for code blocks
    renderer.code = function(code, language) {
      // If language is not specified, use 'text'
      const lang = language || 'text';
      
      // If code content is [object Object], it might be a placeholder
      if (code === '[object Object]') {
        return `<pre class="language-${lang}"><code class="language-${lang}">[object Object]</code></pre>`;
      }
      
      // Use the original code content with minimal processing
      const codeContent = typeof code === 'string' ? code : String(code || '');
      
      // Just escape HTML entities without complex formatting
      const processedCode = syntaxHighlight(codeContent, lang);
      
      // Return HTML with proper language classes
      return `<pre class="language-${lang}"><code class="language-${lang}">${processedCode}</code></pre>`;
    };
    
    let html = marked.parse(content, { renderer });
    
    // Post-process HTML to fix BibTeX blocks and any other issues
    if (bibTexContent && contentType === 'publications') {
      // Replace [object Object] in code blocks with the actual BibTeX content
      html = html.replace(
        /<pre class="language-(?:text|bibtex)"><code class="language-(?:text|bibtex)">\[object Object\]<\/code><\/pre>/g,
        `<pre class="language-bibtex"><code class="language-bibtex">${escapeHtml(bibTexContent)}</code></pre>`
      );
    }
    
    // Final sanitization to catch any remaining [object Object] issues and replace with original code
    html = sanitizeHtml(html, codeBlocks);
    
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