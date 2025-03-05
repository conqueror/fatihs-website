/**
 * Image optimization script for fatihnayebi.com
 * 
 * This script will:
 * 1. Find all images in the static/images directory
 * 2. Generate optimized WebP versions in multiple sizes (if sharp is available)
 * 3. Generate optimized original format versions in multiple sizes (if sharp is available)
 * 4. Create placeholder blur images (if sharp is available)
 * 
 * This script is designed to gracefully handle missing dependencies.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Process each image
async function optimizeImages() {
  console.log('🖼️ Starting image optimization...');
  
  try {
    // Try to import the required packages
    // If they're not available, we'll just skip optimization
    const sharpModule = await import('sharp').catch(() => null);
    const globModule = await import('glob').catch(() => null);
    
    // If either package is missing, we can't proceed with optimization
    if (!sharpModule || !globModule) {
      console.log('⚠️ Required packages (sharp or glob) are not available.');
      console.log('📝 Skipping image optimization, but continuing with the build process.');
      return;
    }
    
    // We have the required packages, so we can proceed
    const sharp = sharpModule.default;
    const { glob } = globModule;
    
    // Target widths for responsive images
    const WIDTHS = [320, 640, 960, 1280, 1920];
    
    // Quality settings
    const WEBP_QUALITY = 80;
    const JPEG_QUALITY = 85;
    const PNG_COMPRESSION = 9;
    
    // Find all image files
    const imageFiles = glob.sync(path.join(IMAGES_DIR, '*.{jpg,jpeg,png,gif,avif}'));
    
    console.log(`Found ${imageFiles.length} images to optimize`);
    
    // Process each image
    for (const filePath of imageFiles) {
      try {
        const filename = path.basename(filePath);
        const extname = path.extname(filePath);
        const basename = path.basename(filePath, extname);
        
        console.log(`Processing: ${filename}`);
        
        // Check if the file exists and is readable
        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
          console.error(`❌ Error: ${filePath} does not exist or is not a file`);
          continue;
        }
        
        // Load the image with additional error handling
        let image;
        try {
          image = sharp(filePath);
          // Try to get metadata to validate the image is processable
          const metadata = await image.metadata();
          if (!metadata || !metadata.format) {
            console.error(`❌ Error: ${filePath} appears to be an invalid or unsupported image format`);
            continue;
          }
        } catch (sharpError) {
          console.error(`❌ Error loading image ${filePath}: ${sharpError.message}`);
          continue;
        }
        
        const metadata = await image.metadata();
        
        // Create a blur hash placeholder (tiny image for loading)
        try {
          await image
            .clone()
            .resize(20)
            .blur(5)
            .toFormat('webp', { quality: 20 })
            .toFile(path.join(OUTPUT_DIR, `${basename}-placeholder.webp`));
        } catch (error) {
          console.error(`❌ Error creating placeholder for ${filename}: ${error.message}`);
          // Continue with other processing even if placeholder fails
        }
        
        // Generate various sizes
        for (const width of WIDTHS) {
          // Skip if the requested width is larger than the original
          if (width > metadata.width) continue;
          
          try {
            // Create WebP version
            await image
              .clone()
              .resize(width)
              .toFormat('webp', { quality: WEBP_QUALITY })
              .toFile(path.join(OUTPUT_DIR, `${basename}-${width}.webp`));
          } catch (error) {
            console.error(`❌ Error creating WebP variant for ${filename} at width ${width}: ${error.message}`);
          }
          
          try {
            // Create AVIF version (better compression than WebP)
            await image
              .clone()
              .resize(width)
              .toFormat('avif', { quality: WEBP_QUALITY - 10 }) // AVIF can use lower quality while maintaining visual quality
              .toFile(path.join(OUTPUT_DIR, `${basename}-${width}.avif`));
          } catch (error) {
            console.error(`❌ Error creating AVIF variant for ${filename} at width ${width}: ${error.message}`);
            // Continue with other formats even if AVIF fails
          }
            
          try {
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
            } else if (extname.toLowerCase() === '.avif') {
              // For AVIF source files, create JPG and WebP versions for better browser compatibility
              await image
                .clone()
                .resize(width)
                .jpeg({ quality: JPEG_QUALITY, progressive: true })
                .toFile(path.join(OUTPUT_DIR, `${basename}-${width}.jpg`));
            } else {
              // Other formats like GIF
              await image
                .clone()
                .resize(width)
                .toFile(path.join(OUTPUT_DIR, `${basename}-${width}${extname}`));
            }
          } catch (error) {
            console.error(`❌ Error creating ${extname} variant for ${filename} at width ${width}: ${error.message}`);
          }
        }
        
        console.log(`✅ Optimized: ${filename}`);
      } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error);
        // Continue with other images even if one fails
      }
    }
    
    console.log('🎉 Image optimization complete!');
  } catch (error) {
    console.error('Error during image optimization, but continuing build:', error);
    // We don't want to fail the build if image optimization fails
  }
}

// Run the image optimization
optimizeImages().catch(error => {
  console.error('Error during image optimization, but continuing build:', error);
  // We don't want to fail the build process, so we exit with 0
  process.exit(0);
});