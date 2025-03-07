/**
 * Script to generate PWA icons
 * 
 * This script will:
 * 1. Generate all the icon sizes needed for PWA from a base SVG
 * 2. Save them to the appropriate location
 * 
 * Run with: node scripts/generate-icons.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure paths
const ICONS_DIR = path.join(__dirname, '../static/images/icons');
const SOURCE_SVG = path.join(__dirname, '../static/favicon.svg');

// Create the icons directory if it doesn't exist
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

async function generateIcons() {
  console.log('🔄 Generating PWA icons...');
  
  try {
    // Try to import Sharp, which we'll use to convert SVG to PNG
    const sharpModule = await import('sharp').catch(() => null);
    
    if (!sharpModule) {
      console.log('⚠️ Sharp package is not available.');
      console.log('📝 Skipping icon generation, but continuing with the build process.');
      return;
    }
    
    // We have Sharp, so we can proceed
    const sharp = sharpModule.default;
    
    // Icon sizes needed for PWA
    const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];
    
    // Check if the source SVG exists
    if (!fs.existsSync(SOURCE_SVG)) {
      console.error(`❌ Error: ${SOURCE_SVG} does not exist`);
      return;
    }
    
    // Generate each size
    for (const size of SIZES) {
      const outputPath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);
      
      try {
        await sharp(SOURCE_SVG)
          .resize(size, size)
          .png()
          .toFile(outputPath);
        
        console.log(`✅ Generated: icon-${size}x${size}.png`);
      } catch (error) {
        console.error(`❌ Error generating icon-${size}x${size}.png: ${error.message}`);
      }
    }
    
    // Also create apple-touch-icon.png in the static root
    const appleIconPath = path.join(__dirname, '../static/apple-touch-icon.png');
    try {
      await sharp(SOURCE_SVG)
        .resize(180, 180)
        .png()
        .toFile(appleIconPath);
      
      console.log('✅ Generated: apple-touch-icon.png');
    } catch (error) {
      console.error(`❌ Error generating apple-touch-icon.png: ${error.message}`);
    }
    
    console.log('🎉 Icon generation complete!');
  } catch (error) {
    console.error('Error during icon generation, but continuing build:', error);
  }
}

// Run the icon generation
generateIcons().catch(error => {
  console.error('Error during icon generation, but continuing build:', error);
  // We don't want to fail the build process, so we exit with 0
  process.exit(0);
}); 