/**
 * Run Lighthouse checks for performance, accessibility, best practices, and SEO
 */

import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import fs from 'fs';

async function runLighthouse() {
  console.log('Starting Lighthouse analysis...');
  
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--disable-gpu', '--no-sandbox']
  });
  
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
  };
  
  const urls = [
    'http://localhost:4173/',            // Home page
    'http://localhost:4173/about',       // About page
    'http://localhost:4173/blog',        // Blog page
    'http://localhost:4173/events',      // Events page
    'http://localhost:4173/publications' // Publications page
  ];
  
  try {
    console.log('Analyzing pages...');
    
    for (const url of urls) {
      console.log(`\nAnalyzing ${url}...`);
      const runnerResult = await lighthouse(url, options);
      
      // Get report results
      const reportHtml = runnerResult.report;
      const pageName = url.split('/').pop() || 'home';
      fs.writeFileSync(`lighthouse-${pageName}.html`, reportHtml);
      
      // Log scores
      const categories = runnerResult.lhr.categories;
      console.log('\nLighthouse scores:');
      console.log(`URL: ${url}`);
      console.log(`Performance: ${Math.round(categories.performance.score * 100)}`);
      console.log(`Accessibility: ${Math.round(categories.accessibility.score * 100)}`);
      console.log(`Best Practices: ${Math.round(categories['best-practices'].score * 100)}`);
      console.log(`SEO: ${Math.round(categories.seo.score * 100)}`);
    }
    
    console.log('\nLighthouse analysis complete!');
    console.log('HTML reports have been saved to the project directory.');
  } catch (error) {
    console.error('Error running Lighthouse', error);
  } finally {
    await chrome.kill();
  }
}

runLighthouse().catch(err => {
  console.error('Lighthouse analysis failed:', err);
  process.exit(1);
}); 