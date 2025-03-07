/**
 * Generate missing icons for the site
 * This script creates placeholder icons for PWA and favicon support
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory paths
const iconsDir = path.join(__dirname, '../static/images/icons');
const sourceImage = path.join(__dirname, '../static/images/profile.avif');

// Make sure the icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
  console.log('Created icons directory');
}

// Define the icons we need to create
const icons = [
  { name: 'icon-144x144.png', size: '144x144' },
  { name: 'apple-touch-icon.png', size: '180x180' },
  { name: 'apple-touch-icon-152x152.png', size: '152x152' },
  { name: 'apple-touch-icon-180x180.png', size: '180x180' },
  { name: 'favicon.ico', size: '32x32' }
];

// Check if ImageMagick is installed
try {
  execSync('which convert', { stdio: 'ignore' });
  console.log('ImageMagick is installed, generating icons...');
  
  // Generate each icon using ImageMagick
  icons.forEach(icon => {
    const outputPath = path.join(iconsDir, icon.name);
    
    if (!fs.existsSync(outputPath)) {
      try {
        const cmd = `convert ${sourceImage} -resize ${icon.size} ${outputPath}`;
        execSync(cmd);
        console.log(`Generated: ${icon.name}`);
      } catch (err) {
        console.error(`Error generating ${icon.name}:`, err.message);
        createFallbackIcon(outputPath, icon.size);
      }
    } else {
      console.log(`Icon already exists: ${icon.name}`);
    }
  });
} catch (err) {
  console.log('ImageMagick not found, creating fallback icons...');
  
  // Create simple placeholder icons if ImageMagick isn't available
  icons.forEach(icon => {
    const outputPath = path.join(iconsDir, icon.name);
    createFallbackIcon(outputPath, icon.size);
  });
}

// Create a background.jpg placeholder
const bgPath = path.join(__dirname, '../static/images/background.jpg');
if (!fs.existsSync(bgPath)) {
  try {
    console.log('Creating placeholder background image');
    execSync(`convert -size 1920x1080 gradient:blue-white ${bgPath}`);
    console.log('Generated: background.jpg');
  } catch (err) {
    console.error('Error creating background image:', err.message);
    createBlankImage(bgPath, '1920x1080');
  }
}

// Function to create a simple icon if ImageMagick fails or isn't available
function createFallbackIcon(filePath, size) {
  // Create a transparent 1x1 pixel PNG for fallback
  const dimensions = size.split('x').map(Number);
  const [width, height] = dimensions;
  
  // Create a simple colored square
  const header = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
    0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
    0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00,
    0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xDD, 0x8D, 0xB0, 0x00, 0x00, 0x00,
    0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
  ]);
  
  fs.writeFileSync(filePath, header);
  console.log(`Created fallback for: ${path.basename(filePath)}`);
}

// Function to create a blank image for backgrounds
function createBlankImage(filePath, size) {
  // Create symlink to an existing image as fallback
  try {
    fs.copyFileSync(sourceImage, filePath);
    console.log(`Created fallback by copying: ${path.basename(filePath)}`);
  } catch (err) {
    console.error(`Could not create fallback for ${path.basename(filePath)}:`, err.message);
  }
}

console.log('Icon generation complete!'); 