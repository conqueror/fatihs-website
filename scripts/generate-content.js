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

// Function to apply syntax highlighting
function syntaxHighlight(code, language) {
  // Return empty string if code is empty
  if (!code) {
    return '';
  }
  
  let html = code;
  
  // Basic syntax highlighting implementation
  if (language === 'javascript' || language === 'js') {
    // Keywords
    html = html.replace(
      /\b(const|let|var|function|if|else|return|for|while|class|new|import|export|from|async|await|try|catch)\b/g, 
      '<span class="token keyword">$1</span>'
    );
    // Strings
    html = html.replace(
      /(['"`])((?:\\.|(?!\1)[^\\])*)\1/g, 
      '<span class="token string">$1$2$1</span>'
    );
    // Comments
    html = html.replace(
      /\/\/(.*)/g, 
      '<span class="token comment">//$1</span>'
    );
    // Numbers
    html = html.replace(
      /\b(\d+(\.\d+)?)\b/g,
      '<span class="token number">$1</span>'
    );
  } 
  else if (language === 'python') {
    // Keywords
    html = html.replace(
      /\b(def|class|import|from|as|if|elif|else|while|for|in|return|try|except|finally|with|pass|lambda)\b/g, 
      '<span class="token keyword">$1</span>'
    );
    // Strings
    html = html.replace(
      /(['"])((?:\\.|(?!\1)[^\\])*)\1/g, 
      '<span class="token string">$1$2$1</span>'
    );
    // Comments
    html = html.replace(
      /#(.*)/g, 
      '<span class="token comment">#$1</span>'
    );
    // Numbers
    html = html.replace(
      /\b(\d+(\.\d+)?)\b/g,
      '<span class="token number">$1</span>'
    );
  } 
  else if (language === 'html' || language === 'markup' || language === 'xml') {
    // Tags
    html = html.replace(
      /(&lt;\/?)(\w+)([^&]*?)(\/?&gt;)/g, 
      '$1<span class="token tag">$2</span>$3$4'
    );
    // Attributes
    html = html.replace(
      /(\s+)(\w+)(=)(".*?")/g, 
      '$1<span class="token attr-name">$2</span>$3<span class="token attr-value">$4</span>'
    );
  } 
  else if (language === 'css') {
    // Selectors
    html = html.replace(
      /([.#]\w+|\w+)(\s*){/g, 
      '<span class="token selector">$1</span>$2{'
    );
    // Properties
    html = html.replace(
      /(\s+)([\w-]+)(\s*:)/g, 
      '$1<span class="token property">$2</span>$3'
    );
    // Values
    html = html.replace(
      /(:)(\s*)(#[a-fA-F0-9]+|\d+\.?\d*|\d*\.?\d+\w+|"[^"]*"|'[^']*')/g, 
      '$1$2<span class="token value">$3</span>'
    );
  }
  else if (language === 'bash' || language === 'sh') {
    // Comments
    html = html.replace(
      /#(.*)/g, 
      '<span class="token comment">#$1</span>'
    );
    // Commands
    html = html.replace(
      /^(\s*)([\w./-]+)/gm, 
      '$1<span class="token command">$2</span>'
    );
    // Options/flags
    html = html.replace(
      /(\s)(-{1,2}[\w-]+)/g, 
      '$1<span class="token parameter">$2</span>'
    );
    // Strings
    html = html.replace(
      /(['"])((?:\\.|(?!\1)[^\\])*)\1/g, 
      '<span class="token string">$1$2$1</span>'
    );
  }
  else if (language === 'svelte') {
    // Script and style tags
    html = html.replace(
      /(&lt;\/?)(\w+)([^&]*?)(\/?&gt;)/g, 
      '$1<span class="token tag">$2</span>$3$4'
    );
    // Attributes
    html = html.replace(
      /(\s+)([\w:]+)(=)(".*?")/g, 
      '$1<span class="token attr-name">$2</span>$3<span class="token attr-value">$4</span>'
    );
    // Svelte directives
    html = html.replace(
      /(\s+)(\{[#:/][\w\s]+\})/g,
      '$1<span class="token keyword">$2</span>'
    );
    // JS in curly braces
    html = html.replace(
      /(\{)([^{}]+)(\})/g,
      '$1<span class="token expression">$2</span>$3'
    );
    // Keywords in script
    html = html.replace(
      /(&lt;script&gt;[\s\S]*?)(\b(const|let|var|function|if|else|return|for|while|class|new|import|export|from)\b)([\s\S]*?&lt;\/script&gt;)/g,
      '$1<span class="token keyword">$2</span>$4'
    );
  }
  else if (language === 'bibtex') {
    // BibTeX specific highlighting
    html = html.replace(
      /@(\w+)/g, 
      '@<span class="token keyword">$1</span>'
    );
    // Field names
    html = html.replace(
      /(\s+)(\w+)(\s*=)/g, 
      '$1<span class="token property">$2</span>$3'
    );
    // Field values
    html = html.replace(
      /(=\s*)({[^}]*})/g, 
      '$1<span class="token string">$2</span>'
    );
  }
  
  return html;
}

// Configure marked with our custom renderer and options
marked.setOptions({
  renderer: renderer,
  gfm: true,
  breaks: true,
  headerIds: true,
  langPrefix: 'language-'
});

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
    
    // Process markdown to HTML with syntax highlighting
    const renderer = new marked.Renderer();
    
    // Custom renderer for code blocks
    renderer.code = function(code, language) {
      // If no language is specified, use 'text'
      const lang = language || 'text';
      
      // Handle all code blocks consistently
      let codeContent = typeof code === 'string' ? code : String(code || '');
      
      // Apply syntax highlighting
      const highlightedCode = syntaxHighlight(codeContent, lang);
      
      // Return HTML with proper language classes
      return `<pre class="language-${lang}"><code class="language-${lang}">${highlightedCode}</code></pre>`;
    };
    
    let html = marked.parse(content, { renderer });
    
    // Post-process HTML to fix BibTeX blocks
    if (bibTexContent && contentType === 'publications') {
      // Replace [object Object] in code blocks with the actual BibTeX content
      html = html.replace(
        /<pre class="language-(?:text|bibtex)"><code class="language-(?:text|bibtex)">\[object Object\]<\/code><\/pre>/g,
        `<pre class="language-bibtex"><code class="language-bibtex">${escapeHtml(bibTexContent)}</code></pre>`
      );
    }
    
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