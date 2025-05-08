/**
 * Critical CSS Inliner for SvelteKit
 * 
 * This script analyzes the built HTML files and:
 * 1. Extracts the critical CSS needed for above-the-fold content
 * 2. Inlines that CSS directly into the HTML
 * 3. Adds a preload for the full CSS with an onload handler to swap
 * 
 * Run with: node scripts/inline-critical-css.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure paths
const BUILD_DIR = path.join(__dirname, '../build');

// CSS properties considered critical (simplified approach)
const CRITICAL_PROPERTIES = [
  'display', 'position', 'top', 'left', 'right', 'bottom', 'width', 'height',
  'margin', 'padding', 'border', 'background', 'color', 'font', 'line-height',
  'text-align', 'flex', 'grid', 'z-index', 'visibility', 'opacity', 'transform'
];

async function inlineCriticalCSS() {
  console.log('🔍 Starting critical CSS inlining...');
  
  try {
    // Find all HTML files in the build directory
    const htmlFiles = glob.sync(path.join(BUILD_DIR, '**/*.html'));
    
    if (htmlFiles.length === 0) {
      console.log('⚠️ No HTML files found in build directory. Skipping.');
      return;
    }
    
    console.log(`Found ${htmlFiles.length} HTML files to process`);
    
    let processedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    // Collect CSS assets for reuse
    const cssAssets = {};
    
    // Process each HTML file
    for (const htmlFile of htmlFiles) {
      try {
        // Read the HTML file
        const html = fs.readFileSync(htmlFile, 'utf8');
        
        // Detect if SvelteKit already inlined critical CSS
        // or if this is a different type of HTML file like a 404 page
        if (html.includes('id="critical-css"') || 
            html.includes('id="svelte-css"') || 
            isSpecialPage(htmlFile)) {
          skippedCount++;
          continue;
        }
        
        // Extract CSS link tags
        const cssLinkRegex = /<link[^>]*rel="stylesheet"[^>]*href="([^"]*)"[^>]*>/g;
        const cssLinks = [];
        let match;
        
        while ((match = cssLinkRegex.exec(html)) !== null) {
          cssLinks.push({
            tag: match[0],
            href: match[1]
          });
        }
        
        if (cssLinks.length === 0) {
          // Check for inline style tags which may indicate that SvelteKit 
          // already handled the CSS
          if (html.includes('<style id="svelte"') || html.includes('<style>')) {
            skippedCount++;
            continue;
          }
          
          // Log only if it's an actual page, not a special file
          if (!isSpecialPage(htmlFile)) {
            console.log(`Note: ${path.relative(BUILD_DIR, htmlFile)} already optimized.`);
          }
          skippedCount++;
          continue;
        }
        
        let modifiedHtml = html;
        let criticalCss = '';
        
        // Process each CSS file
        for (const { tag, href } of cssLinks) {
          // Resolve the CSS file path
          const cssPath = path.join(BUILD_DIR, href.startsWith('/') ? href.slice(1) : href);
          
          let css;
          
          // Check if we've already processed this CSS file
          if (cssAssets[href]) {
            css = cssAssets[href];
          } else if (fs.existsSync(cssPath)) {
            // Read the CSS file
            css = fs.readFileSync(cssPath, 'utf8');
            // Store for reuse
            cssAssets[href] = css;
          } else {
            console.log(`Note: CSS file ${path.relative(BUILD_DIR, cssPath)} not found. This may be expected in SvelteKit builds.`);
            continue;
          }
          
          if (!css) continue;
          
          // Extract critical CSS (simplified approach)
          const cssRules = extractCssRules(css);
          const criticalRules = cssRules.filter(rule => 
            CRITICAL_PROPERTIES.some(prop => rule.includes(prop)) ||
            rule.includes('body') || 
            rule.includes('html') || 
            rule.includes('main') ||
            rule.includes('header') ||
            rule.includes('@font-face') ||
            rule.includes('@keyframes') ||
            rule.includes('transform') ||
            rule.includes('transition')
          );
          
          criticalCss += criticalRules.join('\n');
          
          // Replace the link tag with a preload and a dynamic load approach
          const preloadTag = `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'">`;
          const noscriptFallback = `<noscript><link rel="stylesheet" href="${href}"></noscript>`;
          
          modifiedHtml = modifiedHtml.replace(tag, `${preloadTag}\n${noscriptFallback}`);
        }
        
        // Add the critical CSS inline
        if (criticalCss) {
          const inlineStyle = `<style id="critical-css">${criticalCss}</style>`;
          modifiedHtml = modifiedHtml.replace('</head>', `${inlineStyle}\n</head>`);
          
          // Write the modified HTML back
          fs.writeFileSync(htmlFile, modifiedHtml);
          processedCount++;
          console.log(`✅ Processed: ${path.relative(BUILD_DIR, htmlFile)}`);
        } else {
          skippedCount++;
        }
      } catch (error) {
        console.error(`Error processing ${path.relative(BUILD_DIR, htmlFile)}:`, error);
        errorCount++;
      }
    }
    
    console.log(`
🎉 Critical CSS inlining complete!
✅ Processed: ${processedCount} files
⏭️ Skipped: ${skippedCount} files (already optimized or special pages)
❌ Errors: ${errorCount} files
    `);
  } catch (error) {
    console.error('Error during critical CSS inlining:', error);
  }
}

// Helper function to extract CSS rules
function extractCssRules(css) {
  // Remove comments
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Split by closing brace and filter empty rules
  return css.split('}')
    .map(rule => rule.trim())
    .filter(rule => rule.length > 0)
    .map(rule => rule + '}');
}

// Helper function to determine if a page is a special case
function isSpecialPage(filePath) {
  const specialPages = [
    'offline.html',
    '404.html',
    '500.html',
    'google-verification-placeholder.html',
    '200.html' // Sometimes used for SPA fallbacks
  ];
  
  const filename = path.basename(filePath);
  return specialPages.includes(filename);
}

// Run the inliner
inlineCriticalCSS().catch(error => {
  console.error('Error during critical CSS inlining:', error);
  process.exit(0); // Don't fail the build
}); 