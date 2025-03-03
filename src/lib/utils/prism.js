// src/lib/utils/prism.js - A utility for syntax highlighting with Prism.js

// Import Prism from npm
import Prism from 'prismjs';

// Import a basic set of languages and the CSS
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-bash';

// Optional: import additional languages as needed
// import 'prismjs/components/prism-python';
// import 'prismjs/components/prism-java';
// import 'prismjs/components/prism-csharp';

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
  if (typeof window !== 'undefined' && Prism) {
    console.log('Applying Prism.js syntax highlighting to code blocks');
    setTimeout(() => {
      Prism.highlightAll();
      console.log('Syntax highlighting applied');
    }, 0);
  } else {
    console.warn('Prism.js not available for highlighting');
  }
}

// Function to highlight a specific element
export function highlight(element) {
  if (typeof window !== 'undefined' && Prism && element) {
    Prism.highlightElement(element);
  }
}

export { escapeHtml };

// Export Prism for direct usage
export default Prism; 