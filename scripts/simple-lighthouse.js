/**
 * Simple performance and accessibility check script
 */

import https from 'https';
import http from 'http';
import { execSync } from 'child_process';
import fs from 'fs';

// Pages to check - add trailing slashes to avoid redirects
const urls = [
  'http://localhost:4173/',            // Home page
  'http://localhost:4173/about/',      // About page
  'http://localhost:4173/blog/',       // Blog page
  'http://localhost:4173/events/',     // Events page
  'http://localhost:4173/publications/' // Publications page
];

// Function to follow redirects
async function fetchWithRedirects(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    let redirectCount = 0;
    
    const makeRequest = (currentUrl) => {
      console.log(`Requesting: ${currentUrl}`);
      const protocol = currentUrl.startsWith('https:') ? https : http;
      const startTime = Date.now();
      
      const req = protocol.get(currentUrl, (res) => {
        const statusCode = res.statusCode;
        
        // Handle redirects (301, 302, 307, etc.)
        if (statusCode >= 300 && statusCode < 400 && res.headers.location) {
          if (redirectCount >= maxRedirects) {
            reject(new Error(`Too many redirects (${redirectCount})`));
            return;
          }
          
          redirectCount++;
          console.log(`Redirected (${statusCode}) to: ${res.headers.location}`);
          
          // Resolve relative URLs
          const redirectUrl = new URL(res.headers.location, currentUrl).href;
          makeRequest(redirectUrl);
          return;
        }
        
        // For successful responses, collect the data
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          const endTime = Date.now();
          const timeToLoad = (endTime - startTime) / 1000;
          
          resolve({
            statusCode,
            headers: res.headers,
            data,
            timeToLoad,
            redirectCount
          });
        });
      });
      
      req.on('error', (err) => {
        reject(err);
      });
      
      req.end();
    };
    
    makeRequest(url);
  });
}

// Function to check performance
async function checkPage(url) {
  console.log(`\nChecking ${url}...`);
  
  try {
    const response = await fetchWithRedirects(url);
    const { statusCode, data, timeToLoad, headers, redirectCount } = response;
    
    console.log(`Status code: ${statusCode}`);
    console.log(`Content type: ${headers['content-type']}`);
    console.log(`Cache control: ${headers['cache-control'] || 'not set'}`);
    console.log(`Redirects followed: ${redirectCount}`);
    console.log(`Time to load: ${timeToLoad.toFixed(2)}s`);
    
    // Check for basic SEO elements
    const hasTitle = data.includes('<title>') && data.includes('</title>');
    const hasDescription = data.includes('name="description"');
    const hasCanonical = data.includes('rel="canonical"');
    const hasHeading = data.includes('<h1');
    
    console.log('\nSEO Checks:');
    console.log(`Has title: ${hasTitle ? 'Yes' : 'No'}`);
    console.log(`Has meta description: ${hasDescription ? 'Yes' : 'No'}`);
    console.log(`Has canonical URL: ${hasCanonical ? 'Yes' : 'No'}`);
    console.log(`Has h1 heading: ${hasHeading ? 'Yes' : 'No'}`);
    
    // Check for basic accessibility indicators
    const hasAltText = !data.includes('<img') || data.includes('alt="');
    const hasAriaLabels = data.includes('aria-label');
    const hasLanguage = data.includes('lang=');
    
    console.log('\nAccessibility Checks:');
    console.log(`All images have alt text: ${hasAltText ? 'Yes' : 'No'}`);
    console.log(`Uses ARIA labels: ${hasAriaLabels ? 'Yes' : 'No'}`);
    console.log(`Page has language set: ${hasLanguage ? 'Yes' : 'No'}`);
    
    // Extract title for display
    let pageTitle = "Unknown";
    const titleMatch = data.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      pageTitle = titleMatch[1].trim();
      console.log(`Page title: "${pageTitle}"`);
    }
    
    // Determine page size
    const sizeInKB = (data.length / 1024).toFixed(2);
    console.log(`\nPage size: ${sizeInKB} KB`);
    
    return {
      url,
      pageTitle,
      statusCode,
      timeToLoad,
      redirectCount,
      seoScore: (hasTitle + hasDescription + hasCanonical + hasHeading) / 4 * 100,
      accessibilityScore: (hasAltText + hasAriaLabels + hasLanguage) / 3 * 100,
      size: sizeInKB
    };
  } catch (error) {
    console.error(`Error checking ${url}:`, error.message);
    throw error;
  }
}

// Main function
async function runTests() {
  console.log('Starting performance and SEO checks...');
  
  const results = [];
  
  // Check if curl is available for additional checks
  let hasCurl = false;
  try {
    execSync('curl --version', { stdio: 'ignore' });
    hasCurl = true;
  } catch (e) {
    console.warn('curl not available for additional checks');
  }
  
  // Check each URL
  for (const url of urls) {
    try {
      // Basic check
      const result = await checkPage(url);
      results.push(result);
      
      // Additional curl check if available
      if (hasCurl) {
        try {
          console.log('\nDetailed timing from curl (with redirects):');
          const curlOutput = execSync(
            `curl -L -w "\\nDNS Lookup: %{time_namelookup}s\\nConnect: %{time_connect}s\\nTLS Setup: %{time_appconnect}s\\nTime to first byte: %{time_starttransfer}s\\nTotal time: %{time_total}s\\n" -o /dev/null -s ${url}`,
            { encoding: 'utf8' }
          );
          console.log(curlOutput);
        } catch (e) {
          console.error('Error running curl:', e.message);
        }
      }
    } catch (error) {
      console.error(`Failed to check ${url}:`, error.message);
    }
  }
  
  // Output summary
  console.log('\n=====================================');
  console.log('SUMMARY OF RESULTS');
  console.log('=====================================');
  
  results.forEach(result => {
    console.log(`\n${result.url}`);
    console.log(`Page title: ${result.pageTitle}`);
    console.log(`Load time: ${result.timeToLoad.toFixed(2)}s`);
    console.log(`SEO score: ${Math.round(result.seoScore)}%`);
    console.log(`Accessibility score: ${Math.round(result.accessibilityScore)}%`);
    console.log(`Size: ${result.size} KB`);
    console.log(`Redirects: ${result.redirectCount}`);
  });
  
  // Calculate averages
  const avgLoadTime = results.reduce((sum, r) => sum + r.timeToLoad, 0) / results.length;
  const avgSEO = results.reduce((sum, r) => sum + r.seoScore, 0) / results.length;
  const avgAccessibility = results.reduce((sum, r) => sum + r.accessibilityScore, 0) / results.length;
  
  console.log('\n=====================================');
  console.log('OVERALL AVERAGES');
  console.log('=====================================');
  console.log(`Average load time: ${avgLoadTime.toFixed(2)}s`);
  console.log(`Average SEO score: ${Math.round(avgSEO)}%`);
  console.log(`Average accessibility score: ${Math.round(avgAccessibility)}%`);
  
  // Save results to a file
  const report = {
    date: new Date().toISOString(),
    results,
    averages: {
      loadTime: avgLoadTime,
      seo: avgSEO,
      accessibility: avgAccessibility
    }
  };
  
  fs.writeFileSync('performance-report.json', JSON.stringify(report, null, 2));
  console.log('\nReport saved to performance-report.json');
}

// Run the tests
runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
}); 