import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fontsDir = path.join(__dirname, '../static/fonts');
const fontsCSS = path.join(fontsDir, 'fonts.css');

console.log('Ensuring fonts directory and CSS exists...');

// Make sure fonts directory exists
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
  console.log('Created fonts directory');
}

// Check if fonts CSS exists - if not, create a basic one
if (!fs.existsSync(fontsCSS)) {
  console.log('Fonts CSS file not found, creating a basic version...');
  
  // Create a basic font CSS file that uses system fonts
  const fallbackCSS = `/* Fallback fonts CSS - run font download script to get proper fonts */
  
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local(system-ui);
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: local(system-ui);
}

@font-face {
  font-family: 'Fira Code';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: local(monospace);
}

/* Base font settings */
body {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-feature-settings: 'kern', 'liga', 'calt';
  -webkit-font-smoothing: antialiased;
}

code, pre {
  font-family: 'Fira Code', Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}`;
  
  fs.writeFileSync(fontsCSS, fallbackCSS);
  console.log('Created fallback fonts CSS file');
}

// Check if FontPreload component exists - if not, create it
const fontPreloadPath = path.join(__dirname, '../src/lib/components/FontPreload.svelte');
if (!fs.existsSync(fontPreloadPath)) {
  console.log('FontPreload component not found, creating it...');
  
  const fontPreloadContent = `<svelte:head>
  <!-- Font preloading for critical fonts -->
  <!-- This is a placeholder, will be replaced when fonts are downloaded -->
</svelte:head>`;
  
  fs.writeFileSync(fontPreloadPath, fontPreloadContent);
  console.log('Created FontPreload component');
}

console.log('Font setup complete! Run download-fonts.js to get actual fonts.'); 