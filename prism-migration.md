# Implementing Prism.js Syntax Highlighting in Svelte with Tailwind CSS

This guide provides a step-by-step approach to properly implement syntax highlighting for code blocks in a Svelte application using Prism.js, while ensuring compatibility with Tailwind CSS.

## Initial Setup

- [ ] **Install required dependencies**
  ```bash
  npm install prismjs
  ```

## 1. Create Prism.js Utility File

- [ ] **Create a dedicated Prism utility file at `src/lib/utils/prism.js`**
  ```javascript
  // src/lib/utils/prism.js
  
  // Import Prism core
  import Prism from 'prismjs';
  
  // Import base CSS
  import 'prismjs/themes/prism-tomorrow.css';
  
  // Import necessary languages
  import 'prismjs/components/prism-javascript';
  import 'prismjs/components/prism-typescript';
  import 'prismjs/components/prism-css';
  import 'prismjs/components/prism-markup';
  import 'prismjs/components/prism-bash';
  import 'prismjs/components/prism-python';
  import 'prismjs/components/prism-svelte';
  import 'prismjs/components/prism-bibtex';
  
  // Function to highlight all code blocks on a page
  export function highlightAll() {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        Prism.highlightAll();
      }, 0);
    }
  }
  
  // Function to highlight a specific element
  export function highlight(element) {
    if (typeof window !== 'undefined' && element) {
      Prism.highlightElement(element);
    }
  }
  
  export default Prism;
  ```

## 2. Fix the Content Generation Script

- [ ] **Update the `scripts/generate-content.js` file to properly handle code blocks**
  ```javascript
  // Inside the renderer.code function of scripts/generate-content.js
  
  renderer.code = function (code, lang, isEscaped) {
    // If no language is specified, use 'text'
    const language = lang || 'text';
    
    // Handle all code blocks consistently
    let codeContent;
    
    // Special handling for code blocks that might be objects
    if (code === '[object Object]' || typeof code === 'object') {
      // For BibTeX citations
      if (this.options && this.options.bibTexContent && language === 'text') {
        // Use directly extracted BibTeX content
        return `<pre class="language-bibtex"><code class="language-bibtex">${escapeHtml(this.options.bibTexContent)}</code></pre>`;
      }
      
      // For blog post code blocks
      if (this.options && this.options.codeBlocks) {
        // Try to find a matching code block
        const blockId = Object.keys(this.options.codeBlocks).find(
          id => this.options.codeBlocks[id].language === language
        );
        
        if (blockId) {
          codeContent = this.options.codeBlocks[blockId].code;
        }
      }
      
      // If no specific handling found, provide a placeholder
      if (!codeContent) {
        console.warn(`Unhandled [object Object] in code block with language ${language}`);
        codeContent = '// Code content could not be rendered properly';
      }
    } else {
      // Normal string content
      codeContent = typeof code === 'string' ? code : String(code || '');
    }
    
    // Trim any trailing special characters
    const trimmedCode = codeContent.replace(/[%\s]+$/, '');
    
    // Apply syntax highlighting
    const escapedCode = !isEscaped ? escapeHtml(trimmedCode) : trimmedCode;
    const highlightedCode = syntaxHighlight(escapedCode, language);
    
    // Return HTML with proper language classes
    return `<pre class="language-${language}"><code class="language-${language}">${highlightedCode}</code></pre>`;
  };
  ```

- [ ] **Update the `processContent` function to extract code blocks**
  ```javascript
  function processContent(contentType) {
    // ...existing code...
    
    const items = files.map(filename => {
      const filePath = path.join(contentDir, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      
      // Extract all code blocks from content
      let codeBlocks = {};
      const codeBlockRegex = /```(?:\s*(\w+))?\n([\s\S]*?)\n```/g;
      let match;
      let blockIndex = 0;
      
      while ((match = codeBlockRegex.exec(content)) !== null) {
        const language = match[1] || 'text';
        const code = match[2];
        const blockId = `code-block-${blockIndex++}`;
        codeBlocks[blockId] = { language, code };
      }
      
      // Extract BibTeX content if it exists (for publications)
      let bibTexContent = '';
      const bibTexMatch = content.match(/```(?:\s*|bibtex)\n(@[\s\S]*?)\n```/);
      if (bibTexMatch && bibTexMatch[1]) {
        bibTexContent = bibTexMatch[1];
      }
      
      // Set options for the renderer
      marked.setOptions({
        renderer: renderer,
        gfm: true,
        breaks: true,
        headerIds: true,
        langPrefix: 'language-',
        bibTexContent: bibTexContent,
        codeBlocks: codeBlocks
      });
      
      // Convert markdown to HTML with our custom renderer
      const htmlContent = marked.parse(content);
      
      return {
        slug: filename.replace('.md', ''),
        ...data,
        content: htmlContent,
        rawContent: content
      };
    });
    
    // ...rest of existing code...
  }
  ```

## 3. Update the Blog Post Page Component

- [ ] **Modify `src/routes/blog/[slug]/+page.svelte` to use Prism.js**
  ```svelte
  <script>
    import { onMount } from 'svelte';
    import { highlightAll } from '$lib/utils/prism';
    
    export let data;
    
    onMount(() => {
      // Apply syntax highlighting to all code blocks
      highlightAll();
    });
  </script>
  
  <svelte:head>
    <title>{data.post.title}</title>
    <meta name="description" content={data.post.excerpt} />
  </svelte:head>
  
  <article class="blog-post">
    <header>
      <h1>{data.post.title}</h1>
      <p class="date">{new Date(data.post.date).toLocaleDateString()}</p>
      {#if data.post.tags}
        <div class="tags">
          {#each data.post.tags as tag}
            <span class="tag">{tag}</span>
          {/each}
        </div>
      {/if}
    </header>
    
    <div class="content">
      {@html data.post.content}
    </div>
  </article>
  
  <style>
    /* Your existing styles */
    
    /* Ensure Prism styles don't conflict with Tailwind */
    :global(pre[class*="language-"]) {
      margin: 1.5em 0;
      padding: 1em;
      overflow: auto;
      border-radius: 0.3em;
    }
    
    :global(code[class*="language-"]) {
      font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
      font-size: 0.9em;
    }
  </style>
  ```

## 4. Update Publications Page Component

- [ ] **Apply the same Prism.js integration to `src/routes/publications/[slug]/+page.svelte`**
  ```svelte
  <script>
    import { onMount } from 'svelte';
    import { highlightAll } from '$lib/utils/prism';
    
    export let data;
    
    onMount(() => {
      // Apply syntax highlighting to all code blocks
      highlightAll();
    });
  </script>
  
  <!-- Rest of the component content -->
  ```

## 5. Configure Tailwind CSS

- [ ] **Update `tailwind.config.js` to prevent conflicts with Prism.js classes**
  ```javascript
  /** @type {import('tailwindcss').Config} */
  export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
      extend: {},
    },
    plugins: [],
    // Ensure Tailwind doesn't purge Prism.js classes
    safelist: [
      { pattern: /language-\w+/ },
      { pattern: /token/ },
      { pattern: /pre/ },
      { pattern: /code/ }
    ]
  };
  ```

## 6. Add Global CSS for Prism.js

- [ ] **Create or update your global CSS file (usually in `src/app.css`)**
  ```css
  /* Add these styles to ensure proper rendering of code blocks */
  pre[class*="language-"] {
    position: relative;
    margin: 1.5em 0;
    overflow: auto;
    border-radius: 0.3em;
  }
  
  code[class*="language-"] {
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
  }
  
  /* Ensure .token classes aren't affected by Tailwind's reset */
  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    @apply text-gray-500;
  }
  
  .token.punctuation {
    @apply text-gray-600;
  }
  
  .token.property,
  .token.tag,
  .token.boolean,
  .token.number,
  .token.constant,
  .token.symbol,
  .token.deleted {
    @apply text-blue-500;
  }
  
  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    @apply text-green-600;
  }
  
  .token.operator,
  .token.entity,
  .token.url,
  .token.variable {
    @apply text-orange-500;
  }
  
  .token.atrule,
  .token.attr-value,
  .token.keyword {
    @apply text-purple-600;
  }
  
  .token.function,
  .token.class-name {
    @apply text-yellow-600;
  }
  ```

## 7. Generate and Test Content

- [ ] **Clean and rebuild your content**
  ```bash
  # Clean existing generated content
  rm -rf build .svelte-kit src/lib/generated
  
  # Regenerate content
  cd scripts && node generate-content.js && cd ..
  
  # Build the site
  npm run build
  ```

- [ ] **Verify the absence of `[object Object]` in your build**
  ```bash
  # Check for occurrences of [object Object] in publications directory
  grep -r "\[object Object\]" ./build/publications
  
  # If still issues in blog posts, check those specifically
  grep -r "\[object Object\]" ./build/blog
  ```

## 8. Advanced: Add Copy Button to Code Blocks

- [ ] **Create a custom component for code blocks with copy functionality**
  ```svelte
  <!-- src/lib/components/CodeBlock.svelte -->
  <script>
    import { onMount } from 'svelte';
    import { highlight } from '$lib/utils/prism';
    
    export let language = 'text';
    export let code = '';
    
    let codeElement;
    let copied = false;
    
    onMount(() => {
      if (codeElement) {
        highlight(codeElement);
      }
    });
    
    function copyCode() {
      navigator.clipboard.writeText(code).then(() => {
        copied = true;
        setTimeout(() => {
          copied = false;
        }, 2000);
      });
    }
  </script>
  
  <div class="code-block-wrapper relative">
    <pre class={`language-${language}`}>
      <code class={`language-${language}`} bind:this={codeElement}>{code}</code>
    </pre>
    
    <button 
      class="copy-button absolute top-2 right-2 bg-gray-700 text-white rounded px-2 py-1 text-xs hover:bg-gray-600 transition-colors"
      on:click={copyCode}
    >
      {copied ? '✓ Copied!' : 'Copy'}
    </button>
  </div>
  
  <style>
    .code-block-wrapper {
      position: relative;
    }
    
    .copy-button {
      opacity: 0.8;
    }
    
    .code-block-wrapper:hover .copy-button {
      opacity: 1;
    }
  </style>
  ```

## 9. Final Check and Optimization

- [ ] **Test rendered code blocks across different content types**
  - Open blog posts with code blocks
  - Check publications with BibTeX
  - Verify code blocks render correctly on mobile devices

- [ ] **Performance optimization checks**
  - Verify that only necessary Prism.js languages are loaded
  - Check for any render-blocking issues
  - Test page load times

- [ ] **Commit your changes with descriptive messages**
  ```bash
  git add .
  git commit -m "feat: implement Prism.js syntax highlighting with Tailwind CSS compatibility"
  ```

Good luck with the implementation! Check off each item as you complete it. 