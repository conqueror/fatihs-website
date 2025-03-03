// src/lib/utils/prism.js - A utility for syntax highlighting with Prism.js

// Import our local Prism.js
import '../prismjs/prism.js';
import '../prismjs/prism.css';

// Import language components
import '../prismjs/components/prism-javascript.js';
import '../prismjs/components/prism-css.js';
import '../prismjs/components/prism-markup.js';
import '../prismjs/components/prism-bash.js';

// Helper function to escape HTML for code blocks
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

// Function to highlight all code blocks on a page
export function highlightAll() {
  if (typeof window !== 'undefined' && window.Prism) {
    console.log('Applying Prism.js syntax highlighting to code blocks');
    setTimeout(() => {
      window.Prism.highlightAll();
      console.log('Syntax highlighting applied');
    }, 0);
  } else {
    console.warn('Prism.js not available for highlighting');
  }
}

// Function to highlight a specific element
export function highlight(element) {
  if (typeof window !== 'undefined' && window.Prism && element) {
    window.Prism.highlightElement(element);
  }
}

export { escapeHtml };

// Export Prism for direct usage
export default typeof window !== 'undefined' ? window.Prism : null; 