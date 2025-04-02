import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

// Configure marked options
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: true,
  mangle: false
});

// Process blog posts
const blogDir = path.resolve('src/content/blog');
const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));

const posts = files.map(file => {
  const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
  const { data, content: markdownContent } = matter(content);
  const slug = file.replace('.md', '');
  const html = DOMPurify.sanitize(marked(markdownContent));
  
  // Ensure date is a string
  const date = data.date instanceof Date ? data.date : new Date(data.date);
  
  // Convert featured to a proper boolean
  const featured = typeof data.featured === 'string' 
    ? data.featured.toLowerCase() === 'true'
    : Boolean(data.featured);
  
  return {
    slug,
    title: data.title,
    date: date.toISOString(),
    excerpt: data.excerpt,
    tags: data.tags || [],
    author: data.author || 'Fatih Nayebi',
    featured: featured,
    content: html,
    rawContent: markdownContent
  };
}).sort((a, b) => new Date(b.date) - new Date(a.date));

// Write to JSON file
const outputDir = path.resolve('src/lib/generated');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, 'blog-posts.json'),
  JSON.stringify(posts, null, 2)
); 