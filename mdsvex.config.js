import { defineMDSveXConfig as defineConfig, escapeSvelte } from 'mdsvex';
import { createHighlighter } from 'shiki';

/** @type {import('mdsvex').MdsvexOptions} */
const config = defineConfig({
  extensions: ['.md', '.svx'],
  highlight: {
    highlighter: async (code, lang = 'text') => {
      const highlighter = await createHighlighter({
        themes: ['github-dark'],
        langs: ['javascript', 'typescript', 'html', 'css', 'python', 'bash', 'json', 'markdown', 'svelte']
      });
      
      const html = escapeSvelte(
        highlighter.codeToHtml(code, {
          lang,
          theme: 'github-dark'
        })
      );
      
      return `{@html \`${html}\`}`;
    }
  },
  smartypants: {
    dashes: 'oldschool'
  },
  remarkPlugins: [],
  rehypePlugins: []
});

export default config; 