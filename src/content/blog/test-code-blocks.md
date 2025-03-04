---
title: "Testing Code Block Formatting"
date: "2024-06-15"
excerpt: "This is a test post to verify proper code block formatting"
tags: ["test", "markdown", "code blocks"]
---

# Testing Code Block Formatting

This post tests how code blocks are formatted and separated from surrounding text.

## Example 1: Code Block Immediately After Text

Here's a code block that should be separated from surrounding text:
```bash
npm create svelte@latest my-static-app
```  
This text should be properly separated from the code block above.

## Example 2: Code Block in Lists

1. First step: Run this command:
   ```js
   const config = {
     kit: {
       adapter: adapter({ fallback: 'index.html' })
     }
   };
   ```  
   Then check the output and proceed to the next step.

2. Second step: Another code block:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```  
   This text should be separated from the code above.

## Example 3: Multiple Code Blocks

Here's a bash script:
```bash
cd my-static-app  
npm install  
npm run dev -- --open
```  
And here's some HTML:
```html
<h1 class="text-3xl font-bold underline">Hello Svelte + Tailwind!</h1>
```  
And finally some svelte code:
```svelte
<script>
  import "../app.css";
</script>

<slot />  <!-- renders the page content -->
```

## Example 4: Code Block at End of Section

This section ends with a code block:
```js
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: { extend: {} },
  plugins: []
};
```

## Conclusion

The code blocks above should all be properly formatted and separated from their surrounding text. 