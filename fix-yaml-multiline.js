// Script to fix YAML multiline syntax issues in Markdown files
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

// Find all markdown files in the content directory
const contentFiles = await glob('src/content/**/*.md');

console.log(`Found ${contentFiles.length} markdown files to process`);

let fixedFiles = 0;

contentFiles.forEach(filePath => {
  const content = readFileSync(filePath, 'utf8');
  
  // Check if the file contains problematic YAML multiline syntax
  if (content.includes('title: >-') || content.includes('excerpt: >-') || content.includes('slug: >-')) {
    console.log(`Fixing file: ${filePath}`);
    
    // Split the content into lines for easier processing
    const lines = content.split('\n');
    const fixedLines = [];
    
    let inMultiline = false;
    let multilineKey = '';
    let multilineContent = [];
    
    // Process each line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check for multiline start
      if (line.includes('title: >-') || line.includes('excerpt: >-') || line.includes('slug: >-')) {
        inMultiline = true;
        multilineKey = line.split(':')[0];
        multilineContent = [];
        continue;
      }
      
      // Process multiline content
      if (inMultiline) {
        // Check if this line is indented (part of the multiline)
        if (line.startsWith('  ') || line.trim() === '') {
          if (line.trim() !== '') {
            multilineContent.push(line.trim());
          }
          continue;
        } else {
          // We've reached the end of the multiline block
          inMultiline = false;
          const combinedContent = multilineContent.join(' ');
          // Escape any double quotes in the content
          const escapedContent = combinedContent.replace(/"/g, '\\"');
          fixedLines.push(`${multilineKey}: "${escapedContent}"`);
          
          // Don't forget to process the current line
          fixedLines.push(line);
        }
      } else {
        fixedLines.push(line);
      }
    }
    
    // If we're still in a multiline state at the end of the file, add the collected content
    if (inMultiline) {
      const combinedContent = multilineContent.join(' ');
      const escapedContent = combinedContent.replace(/"/g, '\\"');
      fixedLines.push(`${multilineKey}: "${escapedContent}"`);
    }
    
    // Write the fixed content back to the file
    writeFileSync(filePath, fixedLines.join('\n'));
    fixedFiles++;
  }
});

console.log(`Fixed ${fixedFiles} files with YAML multiline syntax issues`); 