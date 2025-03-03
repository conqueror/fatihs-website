// Manually added Prism.js for syntax highlighting
// This is a simplified version of Prism.js with common language support

// Helper function to escape HTML
function escapeHtml(text) {
  if (text === null || text === undefined) {
    return '';
  }
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// A simple syntax highlighter
export const Prism = {
  languages: {
    html: {},
    markup: {},
    xml: {},
    css: {},
    javascript: {},
    js: {},
    python: {},
    text: {}
  },
  
  highlight: function(code, grammar, language) {
    // Basic implementation for handling various languages
    if (!code) return '';
    
    // Ensure we have a clean string
    const codeStr = String(code);
    
    // Apply language-specific highlighting via regex patterns
    let html = escapeHtml(codeStr);
    
    if (language === 'javascript' || language === 'js') {
      // Keywords
      html = html.replace(
        /\b(const|let|var|function|if|else|return|for|while|class|new|import|export|from|async|await|try|catch)\b/g, 
        '<span class="token keyword">$1</span>'
      );
      // Strings
      html = html.replace(
        /(["'`])(.*?)\1/g, 
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
        /(["'])(.*?)\1/g, 
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
    
    return html;
  }
};

// Function to auto-highlight code blocks in the document
export function highlightAll() {
  if (typeof document === 'undefined') return;
  
  console.log('Applying syntax highlighting to code blocks');
  
  // Find all code blocks 
  const codeBlocks = document.querySelectorAll('pre code');
  console.log(`Found ${codeBlocks.length} code blocks`);
  
  codeBlocks.forEach((block, index) => {
    // Determine the language from the class
    let language = 'text'; // default
    
    // Check for language class
    const classNames = block.className.split(' ');
    for (const className of classNames) {
      if (className.startsWith('language-')) {
        language = className.substring(9);
        console.log(`Block ${index} has language: ${language}`);
        break;
      }
    }
    
    // Detect language from the parent if needed
    if (language === 'text' && block.parentElement) {
      const parentClasses = block.parentElement.className.split(' ');
      for (const className of parentClasses) {
        if (className.startsWith('language-')) {
          language = className.substring(9);
          console.log(`Block ${index} parent has language: ${language}`);
          break;
        }
      }
    }
    
    // Fallback language detection based on content
    if (language === 'text') {
      const content = block.textContent || '';
      if (/^<!DOCTYPE html>|<html|<div|<p|<span|<a/.test(content)) {
        language = 'html';
      } else if (/\{[\s\S]*\}[\s\S]*\:/.test(content)) {
        language = 'css';
      } else if (/function\s+\w+\s*\(|\bvar\b|\bconst\b|\blet\b|\breturn\b/.test(content)) {
        language = 'javascript';
      } else if (/def\s+\w+\s*\(|\bif\s+.*\:|\bimport\s+|for\s+.*\sin/.test(content)) {
        language = 'python';
      }
      console.log(`Block ${index} detected language: ${language}`);
    }
    
    // Get the code content
    const codeContent = block.textContent || '';
    
    // Only highlight if we have content
    if (codeContent.trim()) {
      try {
        console.log(`Highlighting block ${index} as ${language}`);
        
        // Apply syntax highlighting
        block.innerHTML = Prism.highlight(
          codeContent,
          Prism.languages[language] || {},
          language
        );
        
        // Add language class if not present
        if (!block.classList.contains(`language-${language}`)) {
          block.classList.add(`language-${language}`);
        }
        
        // Also add the class to the parent pre tag
        if (block.parentElement && block.parentElement.tagName === 'PRE') {
          if (!block.parentElement.classList.contains(`language-${language}`)) {
            block.parentElement.classList.add(`language-${language}`);
          }
          
          // Add a data-language attribute for the language label in CSS
          block.parentElement.setAttribute('data-language', language);
        }
      } catch (error) {
        console.error(`Error highlighting block ${index}:`, error);
      }
    } else {
      console.log(`Block ${index} has no content to highlight`);
    }
  });
  
  console.log('Syntax highlighting applied');
} 