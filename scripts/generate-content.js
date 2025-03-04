import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to ensure any value is properly converted to a string
function safeStringify(value) {
  if (value === null || value === undefined) {
    return '';
  }
  
  // Special handling for code block objects
  if (typeof value === 'object' && value !== null) {
    // Check if it's a code block object with the structure shown in the example
    if (value.type === 'code' && value.text && typeof value.text === 'string') {
      // Just return the text content of the code block
      return value.text;
    }
    
    try {
      // For objects that have custom toString methods
      if (value.toString !== Object.prototype.toString) {
        return value.toString();
      } else {
        // For plain objects, use JSON.stringify
        return JSON.stringify(value, null, 2);
      }
    } catch (e) {
      console.warn('Failed to stringify object:', e);
      return '[Stringification Error]';
    }
  }
  
  // For non-objects, just convert to string
  return String(value);
}

// Helper function to escape HTML
function escapeHtml(text) {
  if (text === null || text === undefined) {
    return '';
  }
  
  // Make sure we're working with a string
  const safeText = safeStringify(text);
  
  return safeText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Fix markdown formatting issues, particularly around code blocks
function fixMarkdownFormatting(markdown) {
  // Ensure content is a string
  const safeMarkdown = safeStringify(markdown);
  
  // Ensure code blocks have proper spacing before and after
  let fixed = safeMarkdown;
  
  // Fix spaces before code blocks
  fixed = fixed.replace(/([^\n])```(\w*)/g, '$1\n\n```$2');
  
  // Fix spaces after code blocks - ensure there are two newlines after a code block
  fixed = fixed.replace(/```\s*\n([^\n])/g, '```\n\n$1');
  
  // Handle indented code blocks in lists
  fixed = fixed.replace(/(^|\n)(\s+)```/g, '$1$2```');
  
  return fixed;
}

// Process data fields recursively to ensure all objects are stringified
function processDataFields(data) {
  if (!data || typeof data !== 'object') {
    return data;
  }
  
  const result = {};
  
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      
      if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value)) {
          // Process arrays by mapping each item
          result[key] = value.map(item => {
            // Special handling for code blocks in arrays
            if (typeof item === 'object' && item.type === 'code' && item.text) {
              // For code blocks, just return the code text
              return item.text;
            }
            return typeof item === 'object' ? safeStringify(item) : item;
          });
        } else {
          // Special handling for code blocks
          if (value.type === 'code' && value.text) {
            result[key] = value.text;
          } else {
            // For other nested objects, stringify them
            result[key] = safeStringify(value);
          }
        }
      } else {
        result[key] = value;
      }
    }
  }
  
  return result;
}

// Extract actual code from structured code block if needed
function extractCodeContent(code) {
  // Check if this is already a string
  if (typeof code === 'string') {
    return code;
  }
  
  // Check if this is a structured code block
  if (typeof code === 'object' && code !== null) {
    if (code.type === 'code' && code.text) {
      return code.text;
    }
    if (code.raw) {
      return code.raw;
    }
  }
  
  // Otherwise, safely stringify
  return safeStringify(code);
}

// Process content for each content type
function processContent(contentType) {
  console.log(`Processing ${contentType}...`);
  const contentDir = `src/content/${contentType}`;
  
  // Create directories if they don't exist
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
    console.log(`Created directory: ${contentDir}`);
    return []; // No files to process yet
  }
  
  const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));
  
  if (files.length === 0) {
    console.log(`No markdown files found in ${contentDir}`);
    return [];
  }
  
  const items = [];
  
  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);
    
    // Process all data fields to stringify objects
    const processedData = processDataFields(data);
    
    // Fix the markdown formatting issues
    const fixedContent = fixMarkdownFormatting(content);
    
    // Set up a custom renderer for code blocks
    const renderer = new marked.Renderer();
    
    // Standard code rendering with proper escaping
    renderer.code = function(code, lang) {
      // Extract the actual code content from structured code blocks
      const codeContent = extractCodeContent(code);
      
      // Simplified code block without language classes
      return `<pre class="code-block"><code>${escapeHtml(codeContent)}</code></pre>`;
    };
    
    // Configure marked with our renderer
    marked.setOptions({
      renderer: renderer,
      gfm: true,
      breaks: true,
      headerIds: true
    });
    
    // Process markdown to HTML
    let html = marked.parse(fixedContent);
    
    // Final cleanup for spacing between elements
    html = html.replace(/<\/pre><p>/g, '</pre>\n<p>');
    html = html.replace(/<\/p><pre/g, '</p>\n<pre');
    
    // Check for any remaining JSON object representation in the content
    if (html.includes('"type":"code"') || html.includes('"raw"')) {
      console.log(`Warning: Found potential unprocessed code block in ${file}. Applying additional processing.`);
      // Find and replace code block JSON objects
      html = html.replace(/\{[\s\n]*"type"[\s\n]*:[\s\n]*"code"[^}]*"text"[\s\n]*:[\s\n]*"([^"]*)"[^}]*\}/g, 
                         (match, codeText) => {
                           // Decode escaped quotes and newlines in the code text
                           const decodedText = codeText
                             .replace(/\\"/g, '"')
                             .replace(/\\n/g, '\n')
                             .replace(/\\\\/g, '\\');
                           return `<pre class="code-block"><code>${escapeHtml(decodedText)}</code></pre>`;
                         });
    }
    
    const slug = path.basename(file, '.md');
    items.push({
      slug,
      ...processedData,
      content: html
    });
  }
  
  // Ensure output directory exists
  const genDir = 'src/lib/generated';
  if (!fs.existsSync(genDir)) {
    fs.mkdirSync(genDir, { recursive: true });
  }
  
  // Write to JSON file
  fs.writeFileSync(
    `${genDir}/${contentType === 'blog' ? 'blog-posts' : contentType === 'publications' ? 'publications' : 'research-areas'}.json`,
    JSON.stringify(items, null, 2)
  );
  
  console.log(`✓ Generated ${items.length} ${contentType} items`);
  return items;
}

// Process all content types
try {
  processContent('blog');
  processContent('publications');
  processContent('research');
  console.log('Content generation complete!');
} catch (error) {
  console.error('Error generating content:', error);
} 