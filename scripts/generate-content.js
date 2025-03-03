import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';
import { marked } from 'marked';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Process all content types
function processContent(contentType) {
  console.log(`Processing ${contentType}...`);
  
  const contentDir = path.join(path.resolve(__dirname, '..'), `src/content/${contentType}`);
  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  
  const items = files.map(filename => {
    const filePath = path.join(contentDir, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug: filename.replace('.md', ''),
      ...data,
      content: marked.parse(content),
      rawContent: content
    };
  });
  
  // Sort items (by date for blog/publications, by order for research)
  if (contentType === 'research') {
    items.sort((a, b) => (a.order || 0) - (b.order || 0));
  } else {
    items.sort((a, b) => new Date(b.date) - new Date(a.date));
  }
  
  const outputDir = path.join(path.resolve(__dirname, '..'), 'src/lib/generated');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputFile = contentType === 'research' ? 'research-areas.json' : 
                     contentType === 'blog' ? 'blog-posts.json' : 'publications-list.json';
  
  fs.writeFileSync(
    path.join(outputDir, outputFile),
    JSON.stringify(items, null, 2)
  );
  
  console.log(`✓ Generated ${items.length} ${contentType} items`);
}

// Process all content types
try {
  processContent('blog');
  processContent('publications');
  processContent('research');
  console.log('Content generation complete!');
} catch (error) {
  console.error('Error generating content:', error);
  process.exit(1);
} 