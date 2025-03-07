/**
 * [DEPRECATED] Font download and optimization script
 * This script is no longer used as we've switched to loading fonts directly from Google Fonts.
 * Kept for reference purposes only.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import { createWriteStream } from 'fs';

console.log('⚠️ WARNING: This script is deprecated as we now use Google Fonts directly.');
console.log('If you want to use local fonts again, remove the Google Fonts imports from:');
console.log('- src/routes/+layout.svelte');
console.log('- src/styles/global.css');
console.log('Then restore the font-face declarations in src/app.html');

// Setup paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fontsDir = path.join(__dirname, '../static/fonts');

// Ensure fonts directory exists
if (!fs.existsSync(fontsDir)) {
  fs.mkdirSync(fontsDir, { recursive: true });
}

// Font configuration with display strategy
const fonts = [
  {
    family: 'Inter',
    weights: [400, 500, 600, 700],
    styles: ['normal', 'italic'],
    display: 'swap',    // Use 'swap' for better perceived performance
    preload: [400, 700] // Weights to preload (most common ones)
  },
  {
    family: 'Fira Code',
    weights: [400, 500, 700],
    styles: ['normal'],
    display: 'swap',
    preload: [400]      // Only preload regular weight for code
  }
];

// Helper function to download a font
async function downloadFont(url, outputPath) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${url}...`);
    
    const file = createWriteStream(outputPath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download font: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${outputPath}`);
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(outputPath, () => {}); // Delete the file on error
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Main function to download all fonts
async function downloadFonts() {
  try {
    // Font download config
    const fontPromises = [];
    
    // Process Inter font
    const interBaseUrl = 'https://fonts.gstatic.com/s/inter';
    const interFontUrls = [
      // Regular (400)
      {
        url: `${interBaseUrl}/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2`,
        path: path.join(fontsDir, 'Inter-400.woff2'),
      },
      // Medium (500)
      {
        url: `${interBaseUrl}/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7SUc.woff2`,
        path: path.join(fontsDir, 'Inter-500.woff2'),
      },
      // Semi-bold (600)
      {
        url: `${interBaseUrl}/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa25L7SUc.woff2`,
        path: path.join(fontsDir, 'Inter-600.woff2'),
      },
      // Bold (700)
      {
        url: `${interBaseUrl}/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2pL7SUc.woff2`,
        path: path.join(fontsDir, 'Inter-700.woff2'),
      },
      // Italic (400 italic)
      {
        url: `${interBaseUrl}/v12/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa1ZL7.woff2`,
        path: path.join(fontsDir, 'Inter-400i.woff2'),
      },
    ];
    
    // Process Fira Code font
    const firaCodeBaseUrl = 'https://fonts.gstatic.com/s/firacode';
    const firaCodeFontUrls = [
      // Regular (400)
      {
        url: `${firaCodeBaseUrl}/v21/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_D1sJV37Nv7g.woff2`,
        path: path.join(fontsDir, 'FiraCode-400.woff2'),
      },
      // Medium (500)
      {
        url: `${firaCodeBaseUrl}/v21/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_A9sJV37Nv7g.woff2`,
        path: path.join(fontsDir, 'FiraCode-500.woff2'),
      },
      // Bold (700)
      {
        url: `${firaCodeBaseUrl}/v21/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_NprJV37Nv7g.woff2`,
        path: path.join(fontsDir, 'FiraCode-700.woff2'),
      },
    ];
    
    // Add all font downloads
    [...interFontUrls, ...firaCodeFontUrls].forEach(font => {
      if (!fs.existsSync(font.path)) {
        fontPromises.push(downloadFont(font.url, font.path));
      } else {
        console.log(`Font already exists: ${font.path}`);
      }
    });
    
    // Wait for all fonts to download
    if (fontPromises.length > 0) {
      await Promise.all(fontPromises);
      console.log('All fonts downloaded successfully!');
    } else {
      console.log('All fonts already exist, no downloads needed.');
    }
    
    return true;
  } catch (error) {
    console.error('Error downloading fonts:', error);
    return false;
  }
}

// Run the font download process
async function main() {
  console.log('Starting font download process...');
  
  try {
    const success = await downloadFonts();
    
    if (success) {
      console.log('Font processing completed successfully!');
    } else {
      console.error('Font processing completed with errors.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Error in font processing:', error);
    process.exit(1);
  }
}

main(); 