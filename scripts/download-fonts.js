/**
 * Font download and optimization script
 * Downloads Inter and JetBrains Mono variable fonts and places them in the static/fonts directory
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure paths
const FONTS_DIR = path.join(__dirname, '../static/fonts');

// Create fonts directory if it doesn't exist
if (!fs.existsSync(FONTS_DIR)) {
  fs.mkdirSync(FONTS_DIR, { recursive: true });
}

// Font URLs
const FONTS = [
  {
    name: 'inter-var.woff2',
    url: 'https://rsms.me/inter/font-files/Inter.var.woff2'
  },
  {
    name: 'fira-code-var.woff2',
    url: 'https://fonts.gstatic.com/s/firacode/v21/uU9eCBsR6Z2vfE9aq3bL0fxyUs4tcw4W_A9sJVD7MOzlojwUKaJO.woff2'
  }
];

// Download function
function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading ${url} to ${destination}`);
    
    const file = fs.createWriteStream(destination);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: HTTP status code ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Successfully downloaded: ${destination}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(destination, () => {}); // Clean up partial file
      reject(err);
    });
    
    file.on('error', (err) => {
      fs.unlink(destination, () => {}); // Clean up partial file
      reject(err);
    });
  });
}

// Process fonts
async function downloadFonts() {
  console.log('🔤 Starting font downloads...');
  
  try {
    const downloadPromises = FONTS.map(font => {
      const destination = path.join(FONTS_DIR, font.name);
      
      // Skip if file already exists
      if (fs.existsSync(destination)) {
        console.log(`Font ${font.name} already exists, skipping.`);
        return Promise.resolve();
      }
      
      return downloadFile(font.url, destination);
    });
    
    await Promise.all(downloadPromises);
    console.log('✅ All fonts downloaded successfully!');
  } catch (error) {
    console.error('❌ Error downloading fonts:', error);
    // We don't want to fail the build process, so we exit with 0
    process.exit(0);
  }
}

// Run the download
downloadFonts(); 