import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';
import { createHighlighter } from 'shiki';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache for the Shiki highlighter instance (singleton pattern)
let highlighterInstance = null;

/**
 * Get a singleton instance of the Shiki highlighter
 * @returns {Promise<any>} The highlighter instance
 */
async function getHighlighter() {
  if (!highlighterInstance) {
    highlighterInstance = await createHighlighter({
      themes: ['github-dark'],
      langs: ['javascript', 'typescript', 'html', 'css', 'python', 'bash', 'json', 'markdown', 'svelte', 'sql']
    });
  }
  return highlighterInstance;
}

// Content types configuration
const contentTypes = [
  {
    type: 'blog-posts',
    source: 'src/content/blog',
    output: 'src/lib/generated'
  },
  {
    type: 'publications',
    source: 'src/content/publications',
    output: 'src/lib/generated'
  },
  {
    type: 'research-areas',
    source: 'src/content/research',
    output: 'src/lib/generated'
  }
];

/**
 * HTML escaping function
 * @param {string} html - HTML to escape
 * @returns {string} - Escaped HTML
 */
function escapeHtml(html) {
  return html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Highlight code using Shiki with proper error handling and fallback
 * @param {string} code - The code to highlight
 * @param {string} lang - The language of the code
 * @returns {Promise<string>} - The highlighted HTML
 */
async function highlightWithShiki(code, lang) {
  try {
    // Create a highlighter with specific theme and languages
    const highlighter = await getHighlighter();
    
    // Use the highlighter to generate HTML with explicit theme
    return highlighter.codeToHtml(code, {
      lang: lang || 'text',
      theme: 'github-dark'
    });
  } catch (error) {
    // Log warning instead of error since this is non-critical
    console.warn(`Warning: Failed to highlight code with Shiki: ${error.message}`);
    
    // Fallback to basic syntax highlighting
    const escapedCode = escapeHtml(code);
    return `<pre class="fallback-highlight${lang ? ` language-${lang}` : ''}"><code>${escapedCode}</code></pre>`;
  }
}

/**
 * Extract code blocks from markdown content
 * @param {string} markdown Markdown content
 * @returns {Array} Array of code blocks with placeholders
 */
function extractCodeBlocks(markdown) {
  const codeBlockRegex = /```([a-z0-9_-]*)\n([\s\S]*?)```/g;
  const codeBlocks = [];
  
  let match;
  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    const language = match[1] || 'text';
    const code = match[2].trim();
    const placeholder = `%%CODEBLOCK_${codeBlocks.length}%%`;
    
    codeBlocks.push({
      language,
      code,
      placeholder
    });
  }
  
  return codeBlocks;
}

/**
 * Helper function to parse markdown with our custom settings
 * @param {string} markdown 
 * @returns {Object} Parsed result with HTML and code blocks
 */
function customMarkedParse(markdown) {
  // Extract code blocks before parsing markdown
  const codeBlocks = extractCodeBlocks(markdown);
  
  // Replace code blocks with placeholders in the markdown
  let processedMarkdown = markdown;
  codeBlocks.forEach(block => {
    processedMarkdown = processedMarkdown.replace(
      `\`\`\`${block.language}\n${block.code}\`\`\``, 
      block.placeholder
    );
  });
  
  // Parse markdown to HTML
  const html = marked.parse(processedMarkdown, {
    gfm: true,
    breaks: true,
    sanitize: false, // Don't sanitize, we'll handle it with DOMPurify
  });
  
  return { html, codeBlocks };
}

/**
 * Restore code blocks with syntax highlighting
 * @param {string} html HTML with code block placeholders
 * @param {Array} codeBlocks Array of code blocks with placeholders
 * @returns {Promise<string>} HTML with syntax highlighted code blocks
 */
async function restoreCodeBlocks(html, codeBlocks) {
  let processedHtml = html;
  
  // Process each code block in parallel for better performance
  const highlightPromises = codeBlocks.map(async (block) => {
    const highlightedCode = await highlightWithShiki(block.code, block.language);
    return {
      placeholder: block.placeholder,
      highlightedCode
    };
  });
  
  // Wait for all highlighting to complete
  const highlightedBlocks = await Promise.all(highlightPromises);
  
  // Replace placeholders with highlighted code
  for (const { placeholder, highlightedCode } of highlightedBlocks) {
    processedHtml = processedHtml.replace(placeholder, highlightedCode);
  }
  
  return processedHtml;
}

/**
 * Process markdown content, parsing frontmatter and converting markdown to HTML
 * @param {string} content Raw markdown content
 * @returns {Promise<object>} Processed content with parsed frontmatter and HTML
 */
async function processContent(content) {
  // Extract front matter
  const pattern = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = content.match(pattern);
  
  if (!match) {
    const { html, codeBlocks } = customMarkedParse(content);
    return {
      frontmatter: {},
      content: content,
      html: await restoreCodeBlocks(html, codeBlocks)
    };
  }
  
  // Parse frontmatter
  const frontmatterStr = match[1];
  const contentStr = match[2];
  const frontmatter = {};
  
  frontmatterStr.split('\n').forEach(line => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      // Join the rest back together in case there were colons in the value
      const value = parts.slice(1).join(':').trim();
      
      // Remove quotes if they exist
      if (value.startsWith('"') && value.endsWith('"')) {
        frontmatter[key] = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        frontmatter[key] = value.slice(1, -1);
      } else if (key === 'tags' || key === 'categories') {
        // Parse tags as an array
        frontmatter[key] = value
          .replace(/[\[\]"']/g, '') // Remove brackets and quotes
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean); // Remove empty tags
      } else if (key === 'authors' || key === 'collaborators') {
        // Parse authors or collaborators as an array
        try {
          // First try to parse in case it's already JSON formatted
          if (value.startsWith('[') && value.endsWith(']')) {
            try {
              frontmatter[key] = JSON.parse(value);
            } catch {
              // If JSON parsing fails, fall back to comma-separated parsing
              frontmatter[key] = value
                .replace(/[\[\]"']/g, '') // Remove brackets and quotes
                .split(',')
                .map(item => item.trim())
                .filter(Boolean);
            }
          } else {
            // Regular comma-separated string
            frontmatter[key] = value
              .split(',')
              .map(item => item.trim())
              .filter(Boolean);
          }
        } catch (error) {
          console.warn(`Error parsing ${key}: ${error.message}`);
          frontmatter[key] = [value.trim()]; // Fallback to single value
        }
      } else {
        frontmatter[key] = value;
      }
    }
  });
  
  // Parse markdown to HTML with code blocks
  const { html, codeBlocks } = customMarkedParse(contentStr);
  
  // Restore code blocks with syntax highlighting
  const processedHtml = await restoreCodeBlocks(html, codeBlocks);
  
  return {
    frontmatter,
    content: contentStr,
    html: processedHtml
  };
}

/**
 * Process data fields that might contain markdown
 * @param {Object} data - The data object with fields to process
 * @returns {Object} - The processed data object
 */
function processDataFields(data) {
  const result = { ...data };
  
  // Process fields that might contain markdown
  const markdownFields = ['excerpt', 'description', 'summary'];
  
  for (const field of markdownFields) {
    if (result[field] && typeof result[field] === 'string') {
      // Use our new content processing approach
      const processed = processContent(result[field]);
      result[`${field}Html`] = processed.html;
    }
  }
  
  return result;
}

/**
 * Process content for a specific content type
 * @param {Object} contentType - The content type to process
 * @returns {Promise<void>}
 */
async function processContentType(contentType) {
  console.log(`Generating ${contentType.type}...`);
  
  // Check if the content directory exists
  const contentDir = path.join(__dirname, '..', contentType.source);
  try {
    await fs.promises.access(contentDir);
  } catch (error) {
    console.warn(`Content directory ${contentDir} does not exist. Skipping.`);
    return;
  }
  
  // Read all files in the content directory
  const files = await fs.promises.readdir(contentDir);
  const items = [];
  
  for (const file of files) {
    // Only process markdown files
    if (!file.endsWith('.md')) continue;
    
    try {
      // Read the file
      const filePath = path.join(contentDir, file);
      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
      
      // Fix line endings
      const normalizedContent = fileContent.replace(/\r\n/g, '\n');
      
      // Process the content using our new function
      const processedContent = await processContent(normalizedContent);
      
      // Create a slug from the filename
      const slug = file.replace(/\.md$/, '');
      
      // Process data fields that might contain markdown
      const processedData = processDataFields(processedContent.frontmatter);
      
      // Add the item to the array
      items.push({
        slug,
        ...processedData,
        content: processedContent.content,
        html: processedContent.html
      });
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
    }
  }
  
  // Sort items by date if available
  items.sort((a, b) => {
    if (a.date && b.date) {
      return new Date(b.date) - new Date(a.date);
    }
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return 0;
  });
  
  // Write the items to a JSON file
  const outputFile = path.join(__dirname, '..', contentType.output, `${contentType.type}.json`);
  await fs.promises.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.promises.writeFile(outputFile, JSON.stringify(items, null, 2));
  
  console.log(`Successfully generated ${items.length} ${contentType.type} items`);
}

/**
 * Generate content for all configured content types
 */
async function generateAllContent() {
  for (const contentType of contentTypes) {
    await processContentType(contentType);
  }
  console.log('Content generation complete');
}

// Run the content generation
generateAllContent();