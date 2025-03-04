---
title: "Implementing Build-Time Syntax Highlighting in SvelteKit (MDsveX + Tailwind)"
date: "2025-03-04"
excerpt: "A step-by-step tutorial on syntax highlighting for SvelteKit"
tags: ["Web Development", "CSS", "Responsive Design", "Frontend", "Shiki", "Svelte", "TailWindCSS", "MDsveX"]
author: "Fatih Nayebi"
featured: false
---

# Implementing Build-Time Syntax Highlighting in SvelteKit (MDsveX + Tailwind)

Implementing syntax highlighting in a SvelteKit + MDsveX static site can be done entirely at build-time. This avoids runtime JavaScript, ensures better performance, and yields beautifully styled code blocks. The recommended approach is to use **Shiki**, a VS Code-powered highlighter, instead of Prism.js. Shiki works smoothly with MDsveX and produces VS Code-quality highlighting ([SvelteKit Shiki Syntax Highlighting: Markdown Code Blocks | Rodney Lab](https://rodneylab.com/sveltekit-shiki-syntax-highlighting/#:~:text=Svelte%20app,see%20what%20I%20can%20do)) ([SvelteKit Shiki Syntax Highlighting: Markdown Code Blocks | Rodney Lab](https://rodneylab.com/sveltekit-shiki-syntax-highlighting/#:~:text=We%20will%20build%20a%20single,for%2C%20then%20let%E2%80%99s%20get%20cracking)). It also integrates well with Tailwind CSS for theming. Below is a step-by-step guide, along with tips for light/dark theme support and alternatives if needed.

## Why Shiki over Prism.js?

Prism.js can be tricky to integrate in a SvelteKit/MDsveX setup. Prism typically runs on the client or via plugins that inject HTML with Prism classes, which can conflict with Tailwind and MDsveX’s build process. Shiki, on the other hand, generates static HTML with inline styles or CSS variables for coloring at build-time, requiring no client-side script ([GitHub - rehypejs/rehype-highlight: plugin to highlight code blocks](https://github.com/rehypejs/rehype-highlight#:~:text=This%20project%20is%20useful%20when,every%20time%20at%20run%20time)). It uses TextMate grammars (same as VS Code), so you get **high-quality, VS Code-style highlighting** out of the box ([SvelteKit Shiki Syntax Highlighting: Markdown Code Blocks | Rodney Lab](https://rodneylab.com/sveltekit-shiki-syntax-highlighting/#:~:text=Svelte%20app,see%20what%20I%20can%20do)). Recent frameworks (like Astro) have even made Shiki their default highlighter ([SvelteKit Shiki Syntax Highlighting: Markdown Code Blocks | Rodney Lab](https://rodneylab.com/sveltekit-shiki-syntax-highlighting/#:~:text=Svelte%20app,see%20what%20I%20can%20do)). In short, Shiki offers superior theme support and easier maintenance in this context.

*Key benefits of Shiki:* 
- **Build-time highlighting:** Code is highlighted during the SvelteKit build, so no runtime JS is needed ([GitHub - rehypejs/rehype-highlight: plugin to highlight code blocks](https://github.com/rehypejs/rehype-highlight#:~:text=This%20project%20is%20useful%20when,every%20time%20at%20run%20time)).  
- **VS Code themes:** You can use popular VS Code themes (light or dark) for consistent, high-quality styling ([SvelteKit Shiki Syntax Highlighting: Markdown Code Blocks | Rodney Lab](https://rodneylab.com/sveltekit-shiki-syntax-highlighting/#:~:text=Svelte%20app,see%20what%20I%20can%20do)).  
- **MDsveX integration:** MDsveX allows using a custom highlighter, and Shiki plugs into this seamlessly ([SvelteKit Shiki Syntax Highlighting: Markdown Code Blocks | Rodney Lab](https://rodneylab.com/sveltekit-shiki-syntax-highlighting/#:~:text=We%20will%20build%20a%20single,for%2C%20then%20let%E2%80%99s%20get%20cracking)).  
- **Broad language support:** Shiki supports many languages (even Svelte syntax) via VS Code grammars, often more accurately than Prism.  
- **Tailwind compatibility:** Because highlighting is done via inline styles or CSS variables, it won’t be purged by Tailwind and can be combined with Tailwind’s theming easily.

## Step 1: Install and Configure MDsveX with Shiki

**Install the necessary packages:** In your SvelteKit project, install MDsveX and Shiki (and any remark/rehype plugins you might use). For example: 

```bash
npm install -D mdsvex shiki
``` 

If you plan to use plugins like table-of-contents or image unwrapping, install those too (e.g., `remark-toc`, `remark-unwrap-images`, `rehype-slug` as needed) ([Build The Perfect Tech Blog With SvelteKit](https://jimmymcbride.dev/blog/sveltekit-blog#:~:text=In%20this%20tutorial%2C%20we%E2%80%99ll%20build,slug%20for%20clean%20URL%20slugs)) ([Build The Perfect Tech Blog With SvelteKit](https://jimmymcbride.dev/blog/sveltekit-blog#:~:text=2)). 

**Enable MDsveX in SvelteKit:** Update your SvelteKit config (`svelte.config.js` or `.ts`) to use MDsveX as a preprocess and recognize markdown file extensions. For example: 

- **Add MDsveX extensions:** Include `".md"` (or `".svx"`) in the kit’s extensions list so SvelteKit treats those files as Svelte components ([Build The Perfect Tech Blog With SvelteKit](https://jimmymcbride.dev/blog/sveltekit-blog#:~:text=)).
- **Use MDsveX preprocess:** Import `mdsvex` and pass it an options object. In that object, define a custom `highlight` function that uses Shiki.

A minimal **mdsvex config** might look like: 

```js
// svelte.config.js
import { mdsvex, escapeSvelte } from 'mdsvex';
import { getHighlighter } from 'shiki';

const mdsvexOptions = {
  extensions: ['.md'],
  highlight: {
    highlighter: async (code, lang = 'text') => {
      const highlighter = await getHighlighter({ theme: 'nord' });
      const html = escapeSvelte(highlighter.codeToHtml(code, { lang, theme: 'nord' }));
      return `{@html `${html}` }`;
    }
  },
  // ... (any remark/rehype plugins)
};

export default {
  extensions: ['.svelte', '.md'],
  preprocess: [mdsvex(mdsvexOptions)],
  kit: { /* adapter etc. */ }
};
``` 

In this example, we use Shiki’s **“nord”** theme for highlighting. The `escapeSvelte` function ensures that the highlighted HTML is safe to inject in Svelte (it escapes curly braces, etc.), and `{@html ...}` inserts the raw HTML into the rendered page ([Syntax highlighting with Shiki](https://scottwhittaker.net/shiki-syntax-highlighter#:~:text=highlighter%3A%20async%20,html%7D%60)). After this configuration, any fenced code block in your MDsveX markdown will be transformed into static, highlighted HTML at build-time. 

**⚡ Important:** For better performance, use Shiki’s **singleton highlighter** or otherwise reuse the highlighter instance. Creating a new highlighter for every code block can slow down builds significantly. For example, use `getSingletonHighlighter()` instead of `getHighlighter()` to cache the loaded languages and themes ([Build The Perfect Tech Blog With SvelteKit](https://jimmymcbride.dev/blog/sveltekit-blog#:~:text=,time%20went%20from%203%20minutes)). This can **dramatically improve build times** if you have many code blocks (one user saw a build drop from 3 minutes to 1 minute by switching to a singleton ([Build The Perfect Tech Blog With SvelteKit](https://jimmymcbride.dev/blog/sveltekit-blog#:~:text=,3%20minutes%20to%201%20minute))). Alternatively, create the highlighter once outside the function (using `await createHighlighter()` at module top-level) and then reuse it inside the highlight function ([Syntax highlighting with Shiki](https://scottwhittaker.net/shiki-syntax-highlighter#:~:text=import%20,from%20%27shiki)) ([Syntax highlighting with Shiki](https://scottwhittaker.net/shiki-syntax-highlighter#:~:text=highlighter%3A%20async%20,html%7D%60)).

**Limit languages if needed:** Shiki by default can load a lot of languages. You can specify which languages to bundle for highlighting to reduce overhead. For example, `getHighlighter({ themes: ['nord'], langs: ['javascript','svelte','css'] })` will only load those languages. If omitted, Shiki will include a broad set of languages by default ([Build The Perfect Tech Blog With SvelteKit](https://jimmymcbride.dev/blog/sveltekit-blog#:~:text=const%20highlighter%20%3D%20await%20getSingletonHighlighter%28,html%7D%60)) (via `bundledLanguages`), which is convenient but slightly heavier.

## Step 2: Integrate Tailwind CSS for Styling Code Blocks

With the code now highlighted by Shiki, you’ll want to ensure it’s nicely styled and responsive. Tailwind CSS can handle general styling, and its Typography plugin is especially useful for markdown content. 

- **Install Tailwind and Typography plugin:** If you haven’t already, set up Tailwind in your SvelteKit project (including PostCSS). Then install the official typography plugin: `npm install -D @tailwindcss/typography`. In your `tailwind.config.js`, enable the plugin under the plugins array ([Build The Perfect Tech Blog With SvelteKit](https://jimmymcbride.dev/blog/sveltekit-blog#:~:text=module.exports%20%3D%20%7B%20content%3A%20%5B,better%20blog%20post%20styling)). For example: 

  ```js
  // tailwind.config.cjs
  module.exports = {
    content: ["./src/**/*.{html,js,svelte,ts,md}"],
    theme: { extend: {} },
    plugins: [require('@tailwindcss/typography')],
    darkMode: 'class'  // enable class-based dark mode (optional)
  };
  ``` 

  Ensure the `content` paths include your `.md` or `.svx` files so Tailwind can scan classes within markdown content (if any). The typography plugin will apply default styling to HTML elements in markdown (like `<h1>…<h6>`, `<p>`, `<code>`, `<pre>` etc.), making them more visually appealing.

- **Use the Typography plugin:** Wrap your rendered MDsvex content in a Tailwind `prose` class to apply the typography styles. For example, in a Svelte component that renders a post: `<article class="prose lg:prose-xl dark:prose-invert">{@html postContent}</article>` (the `dark:prose-invert` class will invert the colors in dark mode). This gives you nice base styles for code blocks (fonts, spacing, background) without manual effort.

- **Additional CSS for code blocks:** While Tailwind Typography provides a good base, you may need to tweak code block styles. Shiki outputs code wrapped in a `<pre class="shiki">` with inline colors on the tokens ([Syntax highlighting with Shiki](https://scottwhittaker.net/shiki-syntax-highlighter#:~:text=%3Cpre%20class%3D%22shiki%20github,9ECBFF%22%3E%22Apple%22%3C%2Fspan)). You can add some CSS (global or via Tailwind) to refine this. Common enhancements include adding padding, border radius, or scroll overflow to `<pre>` elements. For example: 

  ```css
  /* Additional styling for Shiki code blocks */
  .shiki {
    padding: 1rem;
    border-radius: 0.375rem; /* small rounded corners */
    overflow-x: auto;       /* horizontal scroll if code is wide */
  }
  .shiki .line {
    line-height: 1.5;       /* more line spacing for readability */
  }
  ``` 

  This ensures code blocks have some breathing room and don’t overflow the layout ([Syntax highlighting with Shiki](https://scottwhittaker.net/shiki-syntax-highlighter#:~:text=We%20can%20hook%20into%20these,and%20adjust%20the%20line%20height)) ([Syntax highlighting with Shiki](https://scottwhittaker.net/shiki-syntax-highlighter#:~:text=.shiki%20.line%20%7B%20line,)). You can include this in your global CSS or as part of Tailwind’s base layer. (If using Tailwind, you could create a small plugin or just use the `@layer base` in your CSS to apply these styles so they aren’t purged.)

## Step 3: Supporting Light/Dark Themes with Tailwind

One of the requirements is to support both light and dark theme code styling. Since Shiki can generate **VS Code themes** for both light and dark, we can leverage that. There are two main strategies:

**(a) Use Shiki’s dual-theme feature (CSS variables):** Shiki natively supports outputting dual themes using CSS custom properties ([Light/Dark Dual Themes | Shiki](https://shiki.matsu.io/guide/dual-themes#:~:text=Shiki%20supports%20outputting%20light%2Fdark%20dual,the%20colors%20on%20each%20token)) ([Light/Dark Dual Themes | Shiki](https://shiki.matsu.io/guide/dual-themes#:~:text=light)). Instead of specifying a single `theme` in `codeToHtml`, you provide an `themes` object with `light` and `dark` theme names. For example:

```js
// Inside the highlighter function:
const html = escapeSvelte(
  highlighter.codeToHtml(code, { 
    lang, 
    themes: { light: 'github-light', dark: 'github-dark' } 
  })
);
return `{@html `${html}` }`;
``` 

With this, Shiki will output each token with a default (light) color and CSS variables for the dark color. For instance, a span might have `style="color:#24292e; --shiki-dark:#c9d1d9"` (light color set, dark color stored in a variable) ([Light/Dark Dual Themes | Shiki](https://shiki.matsu.io/guide/dual-themes#:~:text=%3Cpre%20class%3D%22shiki%20shiki,dark%3A%23ECEFF4%22%3E.%3C%2Fspan)) ([Light/Dark Dual Themes | Shiki](https://shiki.matsu.io/guide/dual-themes#:~:text=style%3D%22background,dark%3A%23D8DEE9FF%22%3E%28%3C%2Fspan)). The `<pre>` will also get a class like `shiki-themes` and have `--shiki-dark-bg` etc for background colors ([Light/Dark Dual Themes | Shiki](https://shiki.matsu.io/guide/dual-themes#:~:text=%3Cpre%20class%3D%22shiki%20shiki,dark%3A%23ECEFF4%22%3E.%3C%2Fspan)).

To make the dark theme take effect, you need to add some CSS that swaps to the `--shiki-dark` values when the page is in dark mode. The Shiki documentation suggests using either a media query or a `.dark` class on `<html>` ([Light/Dark Dual Themes | Shiki](https://shiki.matsu.io/guide/dual-themes#:~:text=%40media%20%28prefers,decoration%29%20%21important)) ([Light/Dark Dual Themes | Shiki](https://shiki.matsu.io/guide/dual-themes#:~:text=Class)). Since Tailwind uses a `.dark` class for dark mode (if configured with `darkMode: 'class'`), we can do: 

```css
/* Use Tailwind's dark mode class to override colors */
html.dark .shiki, 
html.dark .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}
```

This CSS will apply the dark theme colors (previously set as CSS variables) whenever the `dark` class is present on the `<html>` element ([Light/Dark Dual Themes | Shiki](https://shiki.matsu.io/guide/dual-themes#:~:text=css)). Include this in your global CSS (and ensure Tailwind doesn’t purge it – if you put it in a `.css` file referenced in a Svelte component or in `app.css`, it should be fine).

**(b) Alternatively, use separate themes per mode:** If you prefer, you could run Shiki twice (once with a light theme, once with a dark theme) and inject the appropriate one based on the site’s theme. However, this is more complex and not necessary if using the dual theme approach. The dual theme with CSS variables is simpler and supported by Shiki out-of-the-box ([Light/Dark Dual Themes | Shiki](https://shiki.matsu.io/guide/dual-themes#:~:text=Shiki%20supports%20outputting%20light%2Fdark%20dual,the%20colors%20on%20each%20token)) ([Light/Dark Dual Themes | Shiki](https://shiki.matsu.io/guide/dual-themes#:~:text=Class)). It allows seamless switching based on a CSS class or media query, without re-rendering any code.

**Choosing themes:** Shiki comes with many themes. “GitHub Light/Dark” and “One Dark Pro” are popular choices. For example, *One Dark Pro* for dark mode and *GitHub Light* for light mode can give a nice contrast. You could also use a single theme that looks good on both backgrounds, but generally two dedicated themes yield the best result. Test the combination to ensure code is readable in both modes.

**Tailwind Dark Mode toggle:** Make sure your site has a way to toggle or detect dark mode (e.g., a button that adds the `.dark` class on `<html>` or using `prefers-color-scheme`). Tailwind’s documentation on dark mode explains how to set this up if you haven’t already ([Persistent Theme Switch (Dark mode) with Svelte (SvelteKit ...](https://dev.to/willkre/persistent-theme-switch-dark-mode-with-svelte-sveltekit-tailwind-1b9g#:~:text=Persistent%20Theme%20Switch%20,when%20dark%20mode%20is%20enabled)). Once in place, your code blocks will automatically restyle when the theme changes, thanks to the CSS variables and Tailwind’s dark class.

## Step 4: Verification and Best Practices

After implementing the above, build your SvelteKit project and open the site to verify:
- Code blocks should already be highlighted on page load (view source to confirm the HTML contains `<span style="color: ...">` inside your `<pre>` tags — this means it's done at build-time, with no Flash of Unstyled Code).
- Switch your site to dark mode (or toggle your OS preference if using media query) and ensure the code colors switch to the dark theme palette. If not, check that the CSS for `.dark .shiki` is loaded and that your HTML `<pre class="shiki ...">` includes the `--shiki-dark` variables.

**Pitfalls to watch out for:**

- *MDsveX setup:* Ensure that MDsveX is actually processing your markdown. Missing the `extensions: ['.md']` in the config or not including the mdsvex preprocess can result in unhighlighted code or build errors. Also, MDsveX by default might try Prism; by providing the `highlight.highlighter` function, you override it with Shiki ([SvelteKit Shiki Syntax Highlighting: Markdown Code Blocks | Rodney Lab](https://rodneylab.com/sveltekit-shiki-syntax-highlighting/#:~:text=We%20will%20build%20a%20single,for%2C%20then%20let%E2%80%99s%20get%20cracking)).
- *Performance:* As mentioned, use a singleton or persistent highlighter instance ([Build The Perfect Tech Blog With SvelteKit](https://jimmymcbride.dev/blog/sveltekit-blog#:~:text=,time%20went%20from%203%20minutes)). Also, only load necessary languages if build performance is a concern. Shiki’s `getHighlighter` allows specifying languages; doing so can cut down initialization time.
- *Tailwind and Purge:* Since Shiki inlines styles, you generally don’t have to worry about Tailwind purging your code highlighting styles. The only classes involved (`shiki`, maybe a theme name on the `<pre>`, and `.line` on spans) are not from Tailwind, but if you add custom CSS targeting them, that CSS won’t be removed by purge as long as it’s not written as pseudo-classes in your markup. If you use any Tailwind utilities for styling code (e.g., applying a background color to `.shiki` via `@apply` or adding a custom class), ensure those classes are present in content or safelisted. Using the typography plugin’s `prose` styles or global CSS as shown avoids this issue.
- *Light/Dark theming gotcha:* When using the dual theme approach, the initial render will use the light theme by default (since the HTML has light colors inline). If your site loads in dark mode by default (e.g., user preference), apply the `.dark` class to HTML as early as possible (server-render it or use a script to avoid flash). This will immediately apply the dark CSS before the user sees the page. The CSS variable method is nice because even if there’s a flash, it’s just a flash of the other theme’s code colors, which is usually not very jarring if your themes are somewhat related. Still, it’s best to set the correct theme class server-side if you can.
- *Maintaining themes:* Shiki makes it easy to swap themes—just change the theme names in the config. If you want to customize a theme (e.g., alter a few colors), you can create a custom VS Code theme JSON and point Shiki to it. This is more advanced, but Shiki supports loading custom theme files if needed ([Light/Dark Dual Themes | Shiki](https://shiki.matsu.io/guide/dual-themes#:~:text=Themes)). For most cases, using one of the built-in themes will suffice.

## Alternatives if Shiki Isn’t Working Out

Shiki is our top choice, but for completeness, here are a couple of alternatives:

- **Rehype-Highlight (Highlight.js):** This rehype plugin uses Highlight.js under the hood to highlight code at build-time ([GitHub - rehypejs/rehype-highlight: plugin to highlight code blocks](https://github.com/rehypejs/rehype-highlight#:~:text=This%20package%20is%20a%20unified,190%20with%20%2081)). You can use it by adding `rehypeHighlight` to your MDsveX config’s `rehypePlugins`. It will automatically detect language classes (like `language-js`) in your markdown and apply highlighting. This approach is simpler to set up than Shiki (no custom function needed). However, the styling is different – you’ll get Highlight.js default classes (e.g., `hljs-keyword`, `hljs-string`). You would then need to include a Highlight.js CSS theme or style those classes yourself. For example, you might import a CSS file for a highlight.js theme (some are available in the `highlight.js/styles` package). Integration with Tailwind dark mode would require writing custom CSS to override highlight colors in dark mode (or using a dark theme CSS loaded conditionally). This can be done but is less flexible than Shiki’s approach. If you want a quick solution and are fine with Highlight.js’s look, this is an option. Just note that to truly mimic VS Code themes with highlight.js might require a lot of custom CSS.

- **Prism (Remark-Prism or rehype-prism):** MDsveX uses Prism by default, but as the user experienced, getting Prism to work with Tailwind and static generation can be fiddly. Prism requires including its CSS and possibly tweaking how MDsveX escapes HTML. There are remark plugins like `remark-prism` that inject Prism markup. If one goes this route, you’d still likely need to manually include Prism’s CSS (which might need adjustments for dark mode). Some developers style Prism token classes with Tailwind utilities (e.g., using `@apply` as shown in one Next.js+Tailwind example) – this works but is **tedious to maintain** (you have to define styles for many token classes) ([MDX Code Highlighting and Styling with Tailwind - DEV Community](https://dev.to/kaartikn/mdx-code-highlighting-and-styling-with-tailwind-el4#:~:text=)) ([MDX Code Highlighting and Styling with Tailwind - DEV Community](https://dev.to/kaartikn/mdx-code-highlighting-and-styling-with-tailwind-el4#:~:text=)). Given these complexities, Prism is not as “plug and play” here as Shiki or rehype-highlight. It’s certainly possible, but you’ll spend more time on integration and theming issues.

- **Other options:** The unified/MDsveX ecosystem also has **rehype-pretty-code**, which actually uses Shiki under the hood with nice defaults (including line numbers, etc.), and **rehype-starry-night** which uses a library similar to how GitHub highlights code ([GitHub - rehypejs/rehype-highlight: plugin to highlight code blocks](https://github.com/rehypejs/rehype-highlight#:~:text=at%20build%20time%20instead%20of,every%20time%20at%20run%20time)). Rehype-pretty-code could be considered if you want advanced features and are okay with its opinionated setup. Rehype-starry-night is another server-side highlighter that supports many languages; it’s an alternative to Shiki but less commonly used in SvelteKit contexts compared to Shiki.

In summary, **Shiki is the recommended solution** for MDsveX + Tailwind. It checks all the boxes: build-time only, easy to configure, works with SvelteKit/MDsveX, supports light/dark theming via actual VS Code themes, and produces great-looking results. By following the steps above – installing Shiki, configuring the MDsveX highlighter, using Tailwind Typography for base styling, and adding a bit of CSS for theme switching – you’ll get professional, VS Code-style code blocks in your static site ([Build The Perfect Tech Blog With SvelteKit](https://jimmymcbride.dev/blog/sveltekit-blog#:~:text=In%20this%20tutorial%2C%20we%E2%80%99ll%20build,slug%20for%20clean%20URL%20slugs)) ([Build The Perfect Tech Blog With SvelteKit](https://jimmymcbride.dev/blog/sveltekit-blog#:~:text=This%20setup%20enables%20markdown%20%28,Dark%20Pro%20theme%20from%20Shiki)). 

Finally, keep your configuration and styles in source control. Once it’s set up, adding new blog posts or markdown content will automatically have consistent syntax highlighting without any extra work – which is exactly what you want for a maintainable static site. Happy coding!

**Sources:**

1. Jimmy McBride, *“Build The Perfect Tech Blog With SvelteKit”* – describes using SvelteKit, Tailwind CSS, and Shiki for a blog ([Build The Perfect Tech Blog With SvelteKit](https://jimmymcbride.dev/blog/sveltekit-blog#:~:text=In%20this%20tutorial%2C%20we%E2%80%99ll%20build,slug%20for%20clean%20URL%20slugs)) ([Build The Perfect Tech Blog With SvelteKit](https://jimmymcbride.dev/blog/sveltekit-blog#:~:text=This%20setup%20enables%20markdown%20%28,Dark%20Pro%20theme%20from%20Shiki)).  
2. SvelteKit + MDsveX configuration examples – using Shiki’s `getSingletonHighlighter` for performance ([Build The Perfect Tech Blog With SvelteKit](https://jimmymcbride.dev/blog/sveltekit-blog#:~:text=,3%20minutes%20to%201%20minute)) and setting up the highlight function ([Build The Perfect Tech Blog With SvelteKit](https://jimmymcbride.dev/blog/sveltekit-blog#:~:text=extensions%3A%20%5B,html%7D%60)) ([Syntax highlighting with Shiki](https://scottwhittaker.net/shiki-syntax-highlighter#:~:text=highlighter%3A%20async%20,html%7D%60)).  
3. Shiki Documentation – covers dual theme (light/dark) support with CSS variables and how to apply them via media query or `.dark` class ([Light/Dark Dual Themes | Shiki](https://shiki.matsu.io/guide/dual-themes#:~:text=Class)).  
4. Rehype-Highlight README – confirms highlight.js integration at build-time and its purpose ([GitHub - rehypejs/rehype-highlight: plugin to highlight code blocks](https://github.com/rehypejs/rehype-highlight#:~:text=This%20package%20is%20a%20unified,190%20with%20%2081)) ([GitHub - rehypejs/rehype-highlight: plugin to highlight code blocks](https://github.com/rehypejs/rehype-highlight#:~:text=This%20project%20is%20useful%20when,every%20time%20at%20run%20time)).  
5. Rodney Lab’s guide on SvelteKit Shiki – discusses Shiki vs Prism and notes that MDsveX uses Prism by default but can use custom highlighters ([SvelteKit Shiki Syntax Highlighting: Markdown Code Blocks | Rodney Lab](https://rodneylab.com/sveltekit-shiki-syntax-highlighting/#:~:text=Svelte%20app,see%20what%20I%20can%20do)) ([SvelteKit Shiki Syntax Highlighting: Markdown Code Blocks | Rodney Lab](https://rodneylab.com/sveltekit-shiki-syntax-highlighting/#:~:text=We%20will%20build%20a%20single,for%2C%20then%20let%E2%80%99s%20get%20cracking)).  
6. Scott Whittaker’s blog – shows a real-world MDsveX config with Shiki and additional CSS for styling code blocks ([Syntax highlighting with Shiki](https://scottwhittaker.net/shiki-syntax-highlighter#:~:text=We%20can%20hook%20into%20these,and%20adjust%20the%20line%20height)) ([Syntax highlighting with Shiki](https://scottwhittaker.net/shiki-syntax-highlighter#:~:text=.shiki%20.line%20%7B%20line,)).  
7. Dev.to article on MDX + Tailwind – illustrates the complexity of manually styling token classes (Prism in that case) ([MDX Code Highlighting and Styling with Tailwind - DEV Community](https://dev.to/kaartikn/mdx-code-highlighting-and-styling-with-tailwind-el4#:~:text=)) ([MDX Code Highlighting and Styling with Tailwind - DEV Community](https://dev.to/kaartikn/mdx-code-highlighting-and-styling-with-tailwind-el4#:~:text=)), reinforcing why Shiki’s approach is simpler here.