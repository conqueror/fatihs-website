import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define source and destination paths
const sourceDir = path.join(__dirname, '..', 'src/content/conferences');
const destDir = path.join(__dirname, '..', 'src/content/speaking');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
  console.log(`Created directory: ${destDir}`);
}

// Process all conference files
try {
  const files = fs.readdirSync(sourceDir);
  console.log(`Found ${files.length} files in ${sourceDir}`);
  
  let migratedCount = 0;
  let errorCount = 0;
  
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    
    const sourcePath = path.join(sourceDir, file);
    const destPath = path.join(destDir, file);
    
    try {
      // Read file content
      const content = fs.readFileSync(sourcePath, 'utf-8');
      
      // Parse frontmatter
      const { data, content: markdownContent } = matter(content);
      
      // Add the type field
      data.type = 'speaking';
      
      // Recreate the file with updated frontmatter
      const updatedContent = matter.stringify(markdownContent, data);
      
      // Write to new location
      fs.writeFileSync(destPath, updatedContent);
      migratedCount++;
      
      console.log(`Migrated: ${file}`);
    } catch (fileError) {
      errorCount++;
      console.error(`Error processing file ${file}: ${fileError.message}`);
      
      // Fallback: copy the file as-is and manually add the type field
      try {
        const content = fs.readFileSync(sourcePath, 'utf-8');
        
        // Simple string replacement to add type field after the frontmatter opening
        const updatedContent = content.replace('---\n', '---\ntype: "speaking"\n');
        
        fs.writeFileSync(destPath, updatedContent);
        console.log(`Copied (with manual type addition): ${file}`);
        migratedCount++;
      } catch (fallbackError) {
        console.error(`Fallback also failed for ${file}: ${fallbackError.message}`);
      }
    }
  }
  
  console.log(`Migration complete! Migrated ${migratedCount} files, encountered ${errorCount} errors.`);
} catch (error) {
  console.error(`Error during migration: ${error.message}`);
  process.exit(1);
} 