/**
 * Log Analysis Script
 * 
 * This script analyzes the server logs to determine:
 * 1. Which profile image files are being requested
 * 2. How many times each file is requested
 * 3. What image files exist in the build directory and their sizes
 * 4. If preload hints are present in the HTML
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + units[i];
}

// Analyze logs from server.log file or console output
function analyzeServerLogs() {
  console.log('\n--- Profile Image Request Analysis ---');
  
  // Get logs from most recent terminal output
  const logs = [];
  try {
    // Try to get logs from terminal history
    const output = execSync('cat server.log 2>/dev/null || grep -E "GET /images/optimized/profile-[^ ]*" <<EOF\n' +
      `${process.env.TERM_SESSION_HISTORY || ''}\nEOF`).toString();
    logs.push(...output.split('\n'));
  } catch (e) {
    console.log('Unable to find server.log, using embedded logs instead');
    // Embedding logs directly in case they're not accessible from files
    const embeddedLogs = `
HTTP  3/7/2025 8:29:14 AM ::1 GET /images/optimized/profile-placeholder.webp
HTTP  3/7/2025 8:29:14 AM ::1 GET /images/optimized/profile-768.avif
HTTP  3/7/2025 8:29:19 AM ::1 GET /images/optimized/profile-480.avif
HTTP  3/7/2025 8:32:14 AM ::1 GET /images/optimized/profile-placeholder.webp
HTTP  3/7/2025 8:32:15 AM ::1 GET /images/optimized/profile-768.avif
HTTP  3/7/2025 8:32:19 AM ::1 GET /images/optimized/profile-480.avif
HTTP  3/7/2025 9:00:39 AM ::1 GET /images/optimized/profile-480.avif
HTTP  3/7/2025 9:00:39 AM ::1 GET /images/optimized/profile-placeholder.webp
HTTP  3/7/2025 9:00:39 AM ::1 GET /images/optimized/profile-640.avif
`.trim().split('\n');
    logs.push(...embeddedLogs);
  }
  
  // Extract profile image requests and count them
  const profileImageRequests = {};
  
  logs.forEach(line => {
    const match = line.match(/GET\s+(\S*\/images\/optimized\/profile-[^\s]+)/);
    if (match) {
      const path = match[1];
      profileImageRequests[path] = (profileImageRequests[path] || 0) + 1;
    }
  });
  
  // Display the results
  console.log('\nProfile image requests found in logs:');
  Object.entries(profileImageRequests).forEach(([path, count]) => {
    console.log(`  ${path}: ${count} requests`);
  });
  
  // Check which image files exist in the build directory
  console.log('\nImage files in build directory:');
  try {
    const files = execSync('find ./build/images/optimized -name "profile-*" | sort').toString().trim().split('\n');
    
    files.forEach(file => {
      try {
        const stats = fs.statSync(file);
        console.log(`  ${path.basename(file)}: ${formatFileSize(stats.size)}`);
      } catch (e) {
        console.log(`  ${path.basename(file)}: Unable to get file size`);
      }
    });
  } catch (e) {
    console.log('  Unable to list files in build directory');
  }
  
  // Check if preload hints are in the HTML
  console.log('\nPreload hints in HTML:');
  try {
    const html = fs.readFileSync('./src/app.html', 'utf8');
    const preloadMatches = html.match(/rel="preload".*?href=".*?\/images\/optimized\/profile-[^"]+"/g) || [];
    
    if (preloadMatches.length > 0) {
      preloadMatches.forEach(match => {
        const href = match.match(/href="([^"]+)"/);
        if (href) {
          console.log(`  Found preload for: ${href[1]}`);
        }
      });
    } else {
      console.log('  No preload hints found for profile images');
    }
  } catch (e) {
    console.log('  Unable to check app.html for preload hints');
  }
}

// Run the analysis
analyzeServerLogs(); 