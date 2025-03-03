import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

function markdownPlugin() {
	const virtualModuleId = 'virtual:blog-posts';
	const resolvedVirtualModuleId = '\0' + virtualModuleId;

	return {
		name: 'vite-plugin-markdown',
		resolveId(id) {
			if (id === virtualModuleId) {
				return resolvedVirtualModuleId;
			}
		},
		async load(id) {
			if (id === resolvedVirtualModuleId) {
				const blogDir = path.resolve('src/content/blog');
				const files = fs.readdirSync(blogDir).filter(file => file.endsWith('.md'));
				
				const posts = files.map(file => {
					const content = fs.readFileSync(path.join(blogDir, file), 'utf-8');
					const { data, content: markdownContent } = matter(content);
					const slug = file.replace('.md', '');
					const html = DOMPurify.sanitize(marked(markdownContent));
					
					return {
						slug,
						title: data.title,
						date: data.date,
						excerpt: data.excerpt,
						tags: data.tags || [],
						author: data.author || 'Fatih Nayebi',
						featured: data.featured || false,
						content: html,
						rawContent: markdownContent
					};
				}).sort((a, b) => new Date(b.date) - new Date(a.date));
				
				return `export default ${JSON.stringify(posts)}`;
			}
		}
	};
}

export default defineConfig({
	plugins: [markdownPlugin(), sveltekit()]
});
