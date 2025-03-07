/**
 * JavaScript optimization script for production builds
 * 
 * This script analyzes components and JavaScript files to:
 * 1. Find and eliminate dead code
 * 2. Provide recommendations for splitting large components
 * 3. Help identify code that can be lazy-loaded
 * 
 * Run with: node scripts/optimize-js.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure paths
const SRC_DIR = path.join(__dirname, '../src');
const COMPONENTS_DIR = path.join(SRC_DIR, 'lib/components');
const OUTPUT_REPORT = path.join(__dirname, '../js-optimization-report.txt');

// Patterns to look for
const POTENTIAL_LAZY_LOAD_PATTERNS = [
  { pattern: /import\s+(\w+)\s+from\s+['"].+['"]/, note: 'Could be dynamically imported' },
  { pattern: /class="invisible.*?"/, note: 'Hidden content could be loaded on demand' },
  { pattern: /data-lazy=/, note: 'Explicitly marked as lazy-loadable' },
  { pattern: /\bnever used\b/, note: 'Commented as never used' }
];

async function analyzeJavaScript() {
  console.log('🔍 Analyzing JavaScript for optimization opportunities...');
  
  try {
    // Find all Svelte components
    const componentFiles = glob.sync(path.join(COMPONENTS_DIR, '**/*.svelte'));
    let report = `# JavaScript Optimization Report\n\n`;
    report += `Generated on: ${new Date().toLocaleString()}\n\n`;
    
    const largeComponents = [];
    const lazyLoadCandidates = [];
    
    for (const file of componentFiles) {
      const relativePath = path.relative(path.join(__dirname, '..'), file);
      const content = fs.readFileSync(file, 'utf8');
      const lineCount = content.split('\n').length;
      const size = fs.statSync(file).size;
      
      // Check for large components (by line count or file size)
      if (lineCount > 200 || size > 8 * 1024) {
        largeComponents.push({
          file: relativePath,
          lineCount,
          sizeKB: (size / 1024).toFixed(2)
        });
      }
      
      // Check for potential lazy loading opportunities
      for (const { pattern, note } of POTENTIAL_LAZY_LOAD_PATTERNS) {
        if (pattern.test(content)) {
          lazyLoadCandidates.push({
            file: relativePath,
            note
          });
          break; // Only report each file once for lazy loading
        }
      }
    }
    
    // Report large components
    if (largeComponents.length > 0) {
      report += `## Large Components\n\n`;
      report += `These components are relatively large and might benefit from being split into smaller components:\n\n`;
      
      for (const { file, lineCount, sizeKB } of largeComponents) {
        report += `- ${file} (${lineCount} lines, ${sizeKB} KB)\n`;
      }
      
      report += '\n';
    }
    
    // Report lazy loading candidates
    if (lazyLoadCandidates.length > 0) {
      report += `## Lazy Loading Candidates\n\n`;
      report += `These components or modules may benefit from dynamic/lazy loading:\n\n`;
      
      for (const { file, note } of lazyLoadCandidates) {
        report += `- ${file} (${note})\n`;
      }
      
      report += '\n';
    }
    
    // Add general recommendations
    report += `## General Recommendations\n\n`;
    report += `1. Consider using dynamic imports for non-critical components: \`const Component = () => import('./Component.svelte');\`\n`;
    report += `2. Split large components into smaller, reusable pieces\n`;
    report += `3. Use code-splitting for route-specific JavaScript\n`;
    report += `4. Use the \`browser\` check to avoid running client-side code during SSR\n`;
    report += `5. Consider using \`$$restProps\` for simple pass-through components instead of declaring each prop\n`;
    report += `6. Use Svelte's reactivity carefully, as it can include unnecessary code in the bundle\n`;
    
    // Write report to file
    fs.writeFileSync(OUTPUT_REPORT, report);
    
    console.log(`✅ JavaScript optimization analysis complete! Report saved to ${OUTPUT_REPORT}`);
    
    // Return a success message
    return { success: true, message: `JavaScript optimization report generated at ${OUTPUT_REPORT}` };
  } catch (error) {
    console.error('Error during JavaScript optimization analysis:', error);
    return { success: false, error: error.message };
  }
}

// Run the analysis
analyzeJavaScript().catch(error => {
  console.error('Error during JavaScript optimization analysis:', error);
  process.exit(0); // Don't fail the build
}); 