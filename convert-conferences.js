/**
 * Script to convert conferences.md content to individual markdown files with proper frontmatter
 * 
 * Usage: 
 * 1. Save this file as convert-conferences.js
 * 2. Run with Node.js: node convert-conferences.js
 * 3. Individual conference markdown files will be created in the src/content/conferences directory
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SOURCE_FILE = 'conferences-content.md'; // The source markdown file with all conferences
const OUTPUT_DIR = 'src/content/conferences'; // The output directory for individual conference files

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`Created directory: ${OUTPUT_DIR}`);
}

// Read the content of the conferences.md file
let content;
try {
  content = fs.readFileSync(SOURCE_FILE, 'utf8');
  console.log(`Read source file: ${SOURCE_FILE}`);
} catch (error) {
  console.error(`Error reading source file: ${error.message}`);
  process.exit(1);
}

// Parse the content to extract individual conferences
const conferences = [];
const yearSections = content.split(/## \d{4}/g).slice(1); // Skip the header section
const years = content.match(/## \d{4}/g).map(year => year.replace('## ', ''));

// Process each year section
yearSections.forEach((section, index) => {
  const year = years[index];
  
  // Split the section into individual conferences
  const conferenceBlocks = section.split(/### /).slice(1); // Skip empty first element after split
  
  // Process each conference block
  conferenceBlocks.forEach(block => {
    const lines = block.trim().split('\n');
    
    // Parse the conference header to extract event name and location/date
    const headerMatch = lines[0].match(/^(.+?)(?:\s+–\s+)?(.+?)\s*\((.+?)\)\s*$/);
    
    if (!headerMatch) {
      console.warn(`Could not parse conference header: ${lines[0]}`);
      return;
    }
    
    const eventName = headerMatch[1].trim();
    const location = headerMatch[2] ? headerMatch[2].trim() : '';
    const dateText = headerMatch[3].trim();
    
    // Parse the talk title
    let title = '';
    const talkMatch = lines.find(line => line.startsWith('**Talk:'))?.match(/\*\*Talk:?\*\*\s*(?:\(.*?\))?\s*:?\s*(.*)/i);
    if (talkMatch) {
      title = talkMatch[1].replace(/^\*/, '').replace(/\*$/, '').trim();
    } else {
      // Look for alternate formats
      const altTalkMatch = lines.find(line => 
        line.includes('**Talk**') || 
        line.includes('**Talk:**') || 
        line.includes('**Session:**') ||
        line.includes('**Talk/Role:**') ||
        line.includes('**Format:**')
      );
      
      if (altTalkMatch) {
        const match = altTalkMatch.match(/.*?:\s*(.*)/);
        if (match) {
          title = match[1].replace(/^\*/, '').replace(/\*$/, '').trim();
        }
      }
    }
    
    // If title is empty or couldn't be parsed, use a default title
    if (!title) {
      title = `Conference Talk at ${eventName}`;
    }
    
    // Extract abstract
    const abstractIndex = lines.findIndex(line => line.startsWith('**Abstract:'));
    if (abstractIndex === -1) {
      console.warn(`No abstract found for conference: ${eventName}`);
      return;
    }
    
    let abstractEndIndex = lines.length;
    for (let i = abstractIndex + 1; i < lines.length; i++) {
      if (lines[i].startsWith('##') || lines[i].startsWith('**Talk:')) {
        abstractEndIndex = i;
        break;
      }
    }
    
    const abstractLines = lines.slice(abstractIndex + 1, abstractEndIndex);
    const abstract = abstractLines.join(' ').trim();
    const excerpt = abstract.length > 200 ? abstract.substring(0, 200) + '...' : abstract;
    
    // Format the date for frontmatter
    let formattedDate = '';
    if (dateText.toLowerCase().includes('feb')) {
      const dayMatch = dateText.match(/(\d+)/);
      const day = dayMatch ? dayMatch[1].padStart(2, '0') : '01';
      formattedDate = `${year}-02-${day}`;
    } else if (dateText.toLowerCase().includes('mar')) {
      const dayMatch = dateText.match(/(\d+)/);
      const day = dayMatch ? dayMatch[1].padStart(2, '0') : '01';
      formattedDate = `${year}-03-${day}`;
    } else if (dateText.toLowerCase().includes('apr')) {
      const dayMatch = dateText.match(/(\d+)/);
      const day = dayMatch ? dayMatch[1].padStart(2, '0') : '01';
      formattedDate = `${year}-04-${day}`;
    } else if (dateText.toLowerCase().includes('may')) {
      formattedDate = `${year}-05-01`;
    } else if (dateText.toLowerCase().includes('jun')) {
      const dayMatch = dateText.match(/(\d+)/);
      const day = dayMatch ? dayMatch[1].padStart(2, '0') : '01';
      formattedDate = `${year}-06-${day}`;
    } else if (dateText.toLowerCase().includes('jul')) {
      const dayMatch = dateText.match(/(\d+)/);
      const day = dayMatch ? dayMatch[1].padStart(2, '0') : '01';
      formattedDate = `${year}-07-${day}`;
    } else if (dateText.toLowerCase().includes('aug')) {
      formattedDate = `${year}-08-01`;
    } else if (dateText.toLowerCase().includes('sep')) {
      const dayMatch = dateText.match(/(\d+)/);
      const day = dayMatch ? dayMatch[1].padStart(2, '0') : '01';
      formattedDate = `${year}-09-${day}`;
    } else if (dateText.toLowerCase().includes('oct')) {
      const dayMatch = dateText.match(/(\d+)/);
      const day = dayMatch ? dayMatch[1].padStart(2, '0') : '01';
      formattedDate = `${year}-10-${day}`;
    } else if (dateText.toLowerCase().includes('nov')) {
      formattedDate = `${year}-11-01`;
    } else if (dateText.toLowerCase().includes('dec')) {
      formattedDate = `${year}-12-01`;
    } else {
      formattedDate = `${year}-01-01`;
    }
    
    // Generate a slug from the event name
    let slug = '';
    
    // Try event name first
    if (eventName && eventName.length > 3) {
      slug = eventName
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
    
    // If event name didn't provide a good slug, use title
    if (!slug || slug.length < 5) {
      slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
    
    // Fallback to location if needed
    if (!slug || slug.length < 5) {
      slug = location
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
    }
    
    // Add a unique identifier based on date and year
    slug = `${slug}-${formattedDate.substring(0, 7)}`;
    
    // Final fallback
    if (!slug || slug.length < 5) {
      slug = `conference-${year}-${Date.now()}`;
    }
    
    // Extract tags from the content
    let tags = ['AI'];  // Default tag
    
    if (abstract.toLowerCase().includes('retail')) tags.push('Retail');
    if (abstract.toLowerCase().includes('machine learning')) tags.push('Machine Learning');
    if (abstract.toLowerCase().includes('generative ai')) tags.push('Generative AI');
    if (abstract.toLowerCase().includes('analytics')) tags.push('Analytics');
    if (abstract.toLowerCase().includes('data')) tags.push('Data');
    if (abstract.toLowerCase().includes('innovation')) tags.push('Innovation');
    if (abstract.toLowerCase().includes('business')) tags.push('Business');
    if (abstract.toLowerCase().includes('ethics')) tags.push('Ethics');
    
    // Remove duplicates and limit to 5 tags
    tags = [...new Set(tags)].slice(0, 5);
    
    // Add the conference to the list
    conferences.push({
      year,
      eventName,
      location,
      date: formattedDate,
      title,
      abstract,
      excerpt,
      slug,
      tags,
      featured: year >= 2024  // Mark conferences from 2024 onwards as featured
    });
  });
});

console.log(`Extracted ${conferences.length} conferences from source file.`);

// Remove the existing index.md file
const indexPath = path.join(OUTPUT_DIR, 'index.md');
if (fs.existsSync(indexPath)) {
  try {
    fs.unlinkSync(indexPath);
    console.log(`Removed existing index.md file.`);
  } catch (error) {
    console.error(`Error removing index.md: ${error.message}`);
  }
}

// Write each conference to a separate markdown file
conferences.forEach(conference => {
  const { year, eventName, location, date, title, abstract, slug, tags, featured } = conference;
  
  const frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
date: "${date}"
location: "${location}"
event: "${eventName.replace(/"/g, '\\"')}"
slug: "${slug}"
excerpt: "${conference.excerpt.replace(/"/g, '\\"')}"
tags: [${tags.map(tag => `"${tag}"`).join(', ')}]
featured: ${featured}
---

# ${eventName} – ${location} (${date.split('-')[0]})

## Talk: *${title}*

${abstract}

## Topics Covered

${tags.map(tag => `- ${tag}`).join('\n')}
`;

  // Write the file
  const outputPath = path.join(OUTPUT_DIR, `${slug}.md`);
  try {
    fs.writeFileSync(outputPath, frontmatter);
    console.log(`Created: ${outputPath}`);
  } catch (error) {
    console.error(`Error writing file ${outputPath}: ${error.message}`);
  }
});

console.log('Conversion complete!'); 