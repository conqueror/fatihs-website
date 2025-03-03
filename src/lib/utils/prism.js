// Manually added Prism.js for syntax highlighting
// This is a simplified version of Prism.js with common language support
export const Prism = {
  languages: {
    extend: (id, redef) => {
      // Simplified extend function
    },
    insertBefore: (inside, before, insert, root) => {
      // Simplified insertBefore function
    },
    DFS: (o, callback, type, visited) => {
      // Simplified DFS function
    }
  },
  highlight: function(code, grammar, language) {
    // A much simpler implementation
    if (!grammar || !code) {
      return escapeHtml(String(code));
    }
    
    // Basic syntax highlighting based on regex patterns
    let html = escapeHtml(String(code));
    
    // Apply highlighting for specific language constructs
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
    } else if (language === 'python') {
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
    } else if (language === 'html' || language === 'markup') {
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
    } else if (language === 'css') {
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
  },
  
  // Other methods
  tokenize: function(text, grammar) {
    // Simplified implementation - we're not using this in our simplified approach
    return [{type: null, content: text}];
  },
  
  hooks: {
    all: {},
    add: function(name, callback) {
      const hooks = this.all;
      hooks[name] = hooks[name] || [];
      hooks[name].push(callback);
    },
    run: function(name, env) {
      const callbacks = this.all[name];
      if (!callbacks || !callbacks.length) {
        return;
      }
      for (let i = 0, callback; (callback = callbacks[i++]);) {
        callback(env);
      }
    }
  }
};

// Define language grammars
Prism.languages.markup = {};
Prism.languages.html = Prism.languages.markup;
Prism.languages.xml = Prism.languages.markup;
Prism.languages.css = {};
Prism.languages.javascript = {};
Prism.languages.js = Prism.languages.javascript;
Prism.languages.python = {};

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

// Add a function to highlight code blocks
export function highlightAll() {
  if (typeof document !== 'undefined') {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
      // Try to detect language from class
      let language = 'text'; // default
      
      const classNames = block.className.split(' ');
      for (const className of classNames) {
        if (className.startsWith('language-')) {
          language = className.substring(9);
          break;
        }
      }
      
      // Fallback language detection
      if (language === 'text') {
        const content = block.textContent || '';
        if (content.includes('<') && content.includes('>')) {
          language = 'html';
        } else if (content.includes('{') && content.includes('}') && content.includes(':')) {
          language = 'css';
        } else if (content.includes('function') || content.includes('var ') || content.includes('const ')) {
          language = 'javascript';
        } else if (content.includes('def ') || content.includes('import ') && content.includes(':')) {
          language = 'python';
        }
      }
      
      // Make sure we have the content as a string
      const codeContent = block.textContent || '';
      
      try {
        // Apply basic highlighting
        let highlightedCode = codeContent;
        
        // Only apply our custom highlighting if we recognize the language
        if (['html', 'css', 'javascript', 'js', 'python', 'markup'].includes(language)) {
          highlightedCode = Prism.highlight(codeContent, Prism.languages[language], language);
        } else {
          // For other languages, just escape the HTML
          highlightedCode = escapeHtml(codeContent);
        }
        
        // Update the code block with highlighted code
        block.innerHTML = highlightedCode;
        
        // Add language class if not present
        if (!block.parentElement.classList.contains(`language-${language}`)) {
          block.parentElement.classList.add(`language-${language}`);
          // Add a data-language attribute for the language label in CSS
          block.parentElement.setAttribute('data-language', language);
        }
      } catch (error) {
        console.error('Error highlighting code:', error);
        // If highlighting fails, keep the original code but make sure it's escaped
        block.innerHTML = escapeHtml(codeContent);
      }
    });
  }
} 