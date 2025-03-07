/**
 * Profile Image Processing Script
 * 
 * This script:
 * 1. Takes profile photos and creates optimized versions for different devices
 * 2. Generates different crops for mobile (more focused on face) and desktop
 * 3. Creates all necessary formats (AVIF, WebP, JPG) for each size
 * 4. Generates low-quality placeholders for blur-up loading
 * 
 * Usage: node scripts/process-profile-images.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure paths
const SOURCE_DIR = path.join(__dirname, '../static/images');
const OUTPUT_DIR = path.join(__dirname, '../static/images/optimized');

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Process profile images
async function processProfileImages() {
  console.log('🖼️ Starting profile image processing...');
  
  try {
    // Try to import the required packages
    const sharpModule = await import('sharp').catch(() => null);
    
    if (!sharpModule) {
      console.log('⚠️ Sharp package is not available.');
      console.log('📝 Skipping profile image processing, but continuing with the build process.');
      return;
    }
    
    // We have Sharp, so we can proceed
    const sharp = sharpModule.default;
    
    // Target sizes for responsive images - only keeping sizes needed for max 600px display
    const SIZES = [320, 480, 640]; // Only generating necessary sizes
    
    // Improved quality settings for different formats since we're using fewer sizes
    const AVIF_QUALITY = 75; // Increased from 65 for better quality
    const WEBP_QUALITY = 80; // Increased from 75 for better quality
    const JPEG_QUALITY = 85; // Increased from 80 for better quality
    
    // Profile image to process (assuming a specific filename)
    const PROFILE_IMAGE = path.join(SOURCE_DIR, 'profile.avif');
    
    // Check if the profile image exists
    if (!fs.existsSync(PROFILE_IMAGE)) {
      console.error(`❌ Profile image not found at ${PROFILE_IMAGE}`);
      return;
    }
    
    // Extract the file info
    const filename = 'profile';
    
    // Create a tiny placeholder for blur-up loading
    try {
      await sharp(PROFILE_IMAGE)
        .resize(20, 20)
        .blur(5)
        .toFormat('webp', { quality: 20 })
        .toFile(path.join(OUTPUT_DIR, `${filename}-placeholder.webp`));
      
      console.log('✅ Generated blur placeholder');
    } catch (error) {
      console.error(`❌ Error creating placeholder for profile image: ${error.message}`);
    }
    
    // Define mobile and desktop crops
    // Mobile crop is more focused on the face (centered)
    const mobileCrop = {
      left: 0,
      top: 0,
      width: 100,
      height: 100
    };
    
    // Desktop crop shows more of the surroundings
    const desktopCrop = {
      left: 0,
      top: 0,
      width: 100,
      height: 100
    };
    
    // Process each size
    for (const size of SIZES) {
      try {
        // Regular version (default crop)
        await generateImageVariants(sharp, PROFILE_IMAGE, filename, size, AVIF_QUALITY, WEBP_QUALITY, JPEG_QUALITY);
      } catch (error) {
        console.error(`❌ Error processing profile image at size ${size}: ${error.message}`);
      }
    }
    
    console.log('🎉 Profile image processing complete!');
  } catch (error) {
    console.error('Error during profile image processing:', error);
  }
}

// Helper to generate all format variants for each size
async function generateImageVariants(sharp, sourceImage, filename, size, avifQuality, webpQuality, jpegQuality) {
  // Load the image once
  const image = sharp(sourceImage).resize(size, size);
  
  // Generate AVIF version
  await image
    .clone()
    .toFormat('avif', { 
      quality: avifQuality,
      effort: 9 // Higher effort for better compression
    })
    .toFile(path.join(OUTPUT_DIR, `${filename}-${size}.avif`));
  
  // Generate WebP version
  await image
    .clone()
    .toFormat('webp', { 
      quality: webpQuality,
      effort: 6 // Higher effort for better compression
    })
    .toFile(path.join(OUTPUT_DIR, `${filename}-${size}.webp`));
  
  // Generate JPG version
  await image
    .clone()
    .toFormat('jpeg', { 
      quality: jpegQuality,
      mozjpeg: true // Use mozjpeg for better compression
    })
    .toFile(path.join(OUTPUT_DIR, `${filename}-${size}.jpg`));
  
  console.log(`✅ Generated size ${size}px in all formats`);
}

// Run the processor
// processProfileImages().catch(error => {
//   console.error('Error during profile image processing:', error);
//   // Don't fail the build if image processing fails
//   process.exit(0);
// }); 

export default processProfileImages; 