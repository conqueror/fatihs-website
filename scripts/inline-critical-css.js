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
    
    // Process each HTML file
    for (const htmlFile of htmlFiles) {
      try {
        // Read the HTML file
        const html = fs.readFileSync(htmlFile, 'utf8');
        
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
          console.log(`No CSS links found in ${htmlFile}. Skipping.`);
          continue;
        }
        
        let modifiedHtml = html;
        let criticalCss = '';
        
        // Process each CSS file
        for (const { tag, href } of cssLinks) {
          // Resolve the CSS file path
          const cssPath = path.join(BUILD_DIR, href.startsWith('/') ? href.slice(1) : href);
          
          if (!fs.existsSync(cssPath)) {
            console.log(`CSS file ${cssPath} not found. Skipping.`);
            continue;
          }
          
          // Read the CSS file
          const css = fs.readFileSync(cssPath, 'utf8');
          
          // Extract critical CSS (simplified approach)
          const cssRules = extractCssRules(css);
          const criticalRules = cssRules.filter(rule => 
            CRITICAL_PROPERTIES.some(prop => rule.includes(prop)) ||
            rule.includes('body') || 
            rule.includes('html') || 
            rule.includes('main') ||
            rule.includes('header') ||
            rule.includes('@font-face')
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
        }
        
        // Write the modified HTML back
        fs.writeFileSync(htmlFile, modifiedHtml);
        console.log(`✅ Processed: ${path.relative(BUILD_DIR, htmlFile)}`);
      } catch (error) {
        console.error(`Error processing ${htmlFile}:`, error);
      }
    }
    
    console.log('🎉 Critical CSS inlining complete!');
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

// Run the inliner
inlineCriticalCSS().catch(error => {
  console.error('Error during critical CSS inlining:', error);
  process.exit(0); // Don't fail the build
}); 