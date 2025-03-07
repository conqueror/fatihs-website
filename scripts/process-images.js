/**
 * Unified Image Processing Script
 * 
 * This script combines:
 * 1. Profile image processing (optimized for LCP element)
 * 2. General image optimization for all other images
 * 
 * It ensures consistent sizing and quality settings across all image types,
 * while enforcing specific optimization rules for profile images.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import optimizeImages from './optimize-images.js';
import processProfileImages from './process-profile-images.js';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure paths
const OUTPUT_DIR = path.join(__dirname, '../static/images/optimized');

// Clean unnecessary large images
async function cleanLargeProfileImages() {
  try {
    console.log('🧹 Cleaning up unnecessary large profile images...');
    
    // Define the patterns to match
    const sizes = [768, 960, 1280, 1920];
    const formats = ['avif', 'webp', 'jpg'];
    
    // Ensure the output directory exists
    const outputExists = await fs.stat(OUTPUT_DIR).catch(() => null);
    if (!outputExists) {
      console.log('📁 Output directory does not exist yet, skipping cleanup.');
      return;
    }
    
    // Get all files in the directory
    const files = await fs.readdir(OUTPUT_DIR);
    
    // Find profile image files with large sizes
    const largeFilesToRemove = files.filter(file => {
      // Check if it's a profile image with a large size
      for (const size of sizes) {
        for (const format of formats) {
          if (file === `profile-${size}.${format}`) {
            return true;
          }
        }
      }
      return false;
    });
    
    // Remove the files
    if (largeFilesToRemove.length > 0) {
      console.log(`Found ${largeFilesToRemove.length} unnecessary large profile images to remove.`);
      
      for (const file of largeFilesToRemove) {
        try {
          await fs.unlink(path.join(OUTPUT_DIR, file));
          console.log(`✅ Removed ${file}`);
        } catch (error) {
          console.error(`❌ Error removing ${file}: ${error.message}`);
        }
      }
    } else {
      console.log('✅ No unnecessary large profile images found.');
    }
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
}

// Main process function
async function processAllImages() {
  console.log('🖼️ Starting unified image processing...');
  
  try {
    // First, run profile image processing (optimized for LCP)
    await processProfileImages();
    
    // Then, run general image optimization
    await optimizeImages();
    
    // Finally, clean up any unnecessary large profile images
    await cleanLargeProfileImages();
    
    console.log('🎉 All image processing complete!');
  } catch (error) {
    console.error('Error during image processing:', error);
    // Don't fail the build if image processing fails
  }
}

// Run the processor
processAllImages().catch(error => {
  console.error('Error during image processing:', error);
  // Don't fail the build if image processing fails
  process.exit(0);
}); 