/**
 * Image optimization script for fatihnayebi.com
 * 
 * This script will:
 * 1. Find all images in the static/images directory
 * 2. Generate optimized WebP versions in multiple sizes
 * 3. Generate optimized original format versions in multiple sizes
 * 4. Create placeholder blur images
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import glob from 'glob';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure paths
const IMAGES_DIR = path.join(__dirname, '../static/images');
const OUTPUT_DIR = path.join(__dirname, '../static/images/optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Target widths for responsive images
const WIDTHS = [320, 640, 960, 1280, 1920];

// Quality settings
const WEBP_QUALITY = 80;
const JPEG_QUALITY = 85;
const PNG_COMPRESSION = 9;

// Process each image
async function optimizeImages() {
  console.log('🖼️ Starting image optimization...');
  
  // Find all image files
  const imageFiles = glob.sync(path.join(IMAGES_DIR, '*.{jpg,jpeg,png,gif}'));
  
  console.log(`Found ${imageFiles.length} images to optimize`);
  
  // Process each image
  for (const filePath of imageFiles) {
    try {
      const filename = path.basename(filePath);
      const extname = path.extname(filePath);
      const basename = path.basename(filePath, extname);
      
      console.log(`Processing: ${filename}`);
      
      // Load the image
      const image = sharp(filePath);
      const metadata = await image.metadata();
      
      // Create a blur hash placeholder (tiny image for loading)
      await image
        .resize(20)
        .blur(5)
        .toFormat('webp', { quality: 20 })
        .toFile(path.join(OUTPUT_DIR, `${basename}-placeholder.webp`));
        
      // Generate various sizes
      for (const width of WIDTHS) {
        // Skip if the requested width is larger than the original
        if (width > metadata.width) continue;
        
        // Create WebP version
        await image
          .clone()
          .resize(width)
          .toFormat('webp', { quality: WEBP_QUALITY })
          .toFile(path.join(OUTPUT_DIR, `${basename}-${width}.webp`));
          
        // Create original format version with optimization
        if (extname.toLowerCase() === '.jpg' || extname.toLowerCase() === '.jpeg') {
          await image
            .clone()
            .resize(width)
            .jpeg({ quality: JPEG_QUALITY, progressive: true })
            .toFile(path.join(OUTPUT_DIR, `${basename}-${width}${extname}`));
        } else if (extname.toLowerCase() === '.png') {
          await image
            .clone()
            .resize(width)
            .png({ compressionLevel: PNG_COMPRESSION, progressive: true })
            .toFile(path.join(OUTPUT_DIR, `${basename}-${width}${extname}`));
        } else {
          // Other formats like GIF
          await image
            .clone()
            .resize(width)
            .toFile(path.join(OUTPUT_DIR, `${basename}-${width}${extname}`));
        }
      }
      
      console.log(`✅ Optimized: ${filename}`);
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error);
    }
  }
  
  console.log('🎉 Image optimization complete!');
}

// Run the image optimization
optimizeImages().catch(error => {
  console.error('Error during image optimization:', error);
  process.exit(1);
}); 