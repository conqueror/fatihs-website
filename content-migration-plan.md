# Content Migration Plan: Converting to Markdown-Based Content

This document outlines the detailed plan for migrating the Publications and Research sections of the website to use a Markdown-based content approach, similar to what is already implemented for the Blog section.

## Background

Currently, the website has three main content sections with different implementation approaches:

- **Blog**: Uses Markdown files in `src/content/blog/` and processes them into JSON via a script
- **Publications**: Hybrid approach with Markdown files but hard-coded metadata in JavaScript
- **Research**: Content embedded directly in the Svelte component

## Migration Goals

1. Create a consistent content management approach across all sections
2. Leverage the advantages of Markdown for all content:
   - Easier editing and formatting
   - Better separation of content and presentation
   - Improved content versioning
3. Implement a unified processing pipeline for all content types
4. Maintain backwards compatibility during the transition

## Migration Plan

### Phase 1: Setup (Preparation)

1. **Backup current files** (safety first!)
   ```bash
   # Create backups
   cp src/routes/research/+page.svelte src/routes/research/+page.svelte.bak
   cp src/lib/utils/publications.js src/lib/utils/publications.js.bak
   cp src/routes/publications/+page.js src/routes/publications/+page.js.bak
   ```

2. **Create required directories**
   ```bash
   # Create research content directory if it doesn't exist
   mkdir -p src/content/research
   ```

3. **Install dependencies** (if not already installed)
   ```bash
   npm install gray-matter marked
   ```

### Phase 2: Migrating Publications to Full Markdown

1. **Extract data from publications.js to Markdown files**

   For each publication in the `PUBLICATIONS` array in `publications.js`, create a corresponding Markdown file in `src/content/publications/` with proper frontmatter:

   Example for `transformer-optimization-techniques.md`:
   ```markdown
   ---
   title: "Optimization Techniques for Transformer Models"
   date: "2023-04-12"
   excerpt: "A detailed analysis of techniques to optimize transformer-based models for improved performance and efficiency."
   tags: ["Transformers", "Optimization", "Deep Learning"]
   author: "Fatih Nayebi"
   featured: true
   ---

   # Optimization Techniques for Transformer Models

   This paper explores advanced optimization techniques for transformer-based models,
   focusing on methods to improve both performance and computational efficiency.

   ## Abstract

   Transformer models have revolutionized natural language processing, computer vision,
   and many other fields. However, their computational demands present significant 
   challenges. This paper examines various optimization techniques including quantization,
   pruning, knowledge distillation, and efficient attention mechanisms.

   ## Key Findings

   Our research demonstrates that:
   
   1. Structured pruning can reduce parameter count by up to 40% with minimal accuracy loss
   2. Knowledge distillation is particularly effective for specialized domain models
   3. Efficient attention mechanisms show promising results for long sequence processing
   ```

2. **Create an updated publications.js utility file based on the blog pattern**

   ```javascript
   // src/lib/utils/publications.js (updated version)
   import { browser } from '$app/environment';
   import publicationsList from '$lib/generated/publications-list.json';

   export function getAllPublications() {
     return publicationsList;
   }

   export function getPublicationBySlug(slug) {
     return publicationsList.find(pub => pub.slug === slug);
   }

   export function getFilteredPublications({ tag = null, featured = false } = {}) {
     let filteredPublications = publicationsList;

     if (tag) {
       filteredPublications = filteredPublications.filter(pub => pub.tags.includes(tag));
     }

     if (featured) {
       filteredPublications = filteredPublications.filter(pub => pub.featured);
     }

     return filteredPublications;
   }
   ```

3. **Update the publications route to use the new approach**

   The `src/routes/publications/+page.js` file should remain largely the same, as it already imports from the utility file.

### Phase 3: Converting Research to Markdown

1. **Extract research areas from the component to Markdown files**

   Create individual Markdown files for each research area in `src/content/research/`:

   Example for `machine-learning.md`:
   ```markdown
   ---
   title: "Machine Learning"
   icon: "brain"
   order: 1
   ---

   # Machine Learning Research

   My research in machine learning focuses on developing novel algorithms that improve performance and interpretability of models across various domains.

   ## Key Projects

   ### Deep Learning for Medical Imaging
   
   Developing convolutional neural networks that can detect anomalies in medical scans with higher accuracy than traditional methods. This research employs attention mechanisms to focus on relevant areas while providing interpretable results for healthcare professionals.

   ### Reinforcement Learning for Decision Optimization
   
   Creating reinforcement learning agents that can optimize complex decision-making processes in uncertain environments. Applications include supply chain optimization, resource allocation, and autonomous systems.

   ## Recent Advances

   Recent work has focused on making neural networks more efficient while maintaining accuracy. This includes model compression techniques, sparse architectures, and hardware-aware algorithm design.
   ```

   Example for `artificial-intelligence.md`:
   ```markdown
   ---
   title: "Artificial Intelligence"
   icon: "robot"
   order: 2
   ---

   # Artificial Intelligence Research

   My AI research explores the intersection of symbolic reasoning and neural approaches, with a focus on developing more robust and generalizable AI systems.

   ## Key Areas

   ### Large Language Models
   
   Investigating how large language models reason and how we can enhance their capabilities through techniques like prompted learning, fine-tuning, and knowledge integration.

   ### Human-AI Collaboration
   
   Developing frameworks that enable effective collaboration between humans and AI systems, with particular attention to trust, explainability, and complementary strengths.

   ## Future Directions

   Future work will focus on multi-modal AI systems that can process and reason across different types of data, from text and images to structured knowledge and symbolic representations.
   ```

2. **Create a research.js utility file**

   ```javascript
   // src/lib/utils/research.js
   import { browser } from '$app/environment';
   import researchAreas from '$lib/generated/research-areas.json';

   export function getAllResearchAreas() {
     return researchAreas;
   }

   export function getResearchAreaBySlug(slug) {
     return researchAreas.find(area => area.slug === slug);
   }
   
   export function getOrderedResearchAreas() {
     return [...researchAreas].sort((a, b) => a.order - b.order);
   }
   ```

3. **Update the Research page component**

   Modify `src/routes/research/+page.svelte` to use the markdown-generated data:

   ```svelte
   <script>
       import { onMount } from 'svelte';
       import { fade, fly } from 'svelte/transition';
       import AnimateInView from '$lib/AnimateInView.svelte';
       
       let visible = false;
       export let data;
       const researchAreas = data.researchAreas;
       
       onMount(() => {
           visible = true;
       });
       
       // Map of icon names to their SVG content (keep existing icons)
       const icons = {
           brain: '...',  // SVG content from your existing component
           robot: '...',  // SVG content from your existing component
           // Add other icons as needed
       };
   </script>

   <svelte:head>
       <title>Research | Fatih Nayebi</title>
       <meta name="description" content="Explore Fatih Nayebi's research in machine learning, AI, and their applications in various domains.">
   </svelte:head>

   {#if visible}
   <div in:fade={{ duration: 800 }} class="py-12 container mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
       <!-- Background decorative elements -->
       <div class="absolute top-20 right-10 opacity-10 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
       <div class="absolute bottom-40 left-10 opacity-10 w-96 h-96 bg-indigo-400 rounded-full blur-3xl"></div>
       
       <h1 class="text-5xl font-bold mb-8 text-center text-primary" in:fly={{ y: -30, duration: 800, delay: 300 }}>Research</h1>
       <p class="text-lg text-center mb-12 max-w-3xl mx-auto" in:fly={{ y: 30, duration: 800, delay: 500 }}>
           My research focuses on machine learning, AI, and their applications in various domains.
       </p>
       
       <div class="space-y-12">
           {#each researchAreas as area}
               <AnimateInView type="fade" delay={300}>
                   <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                       <h2 class="text-2xl font-semibold mb-4 text-primary flex items-center">
                           {#if area.icon && icons[area.icon]}
                               <span class="mr-2">{@html icons[area.icon]}</span>
                           {/if}
                           {area.title}
                       </h2>
                       
                       <!-- Use the HTML content from the processed markdown -->
                       <div class="prose prose-primary max-w-none">
                           {@html area.content}
                       </div>
                   </div>
               </AnimateInView>
           {/each}
       </div>
   </div>
   {/if}
   ```

4. **Create a +page.js file for the Research route**

   ```javascript
   // src/routes/research/+page.js
   import { getAllResearchAreas } from '$lib/utils/research';

   // Enable prerendering
   export const prerender = true;

   /** @type {import('./$types').PageLoad} */
   export function load() {
     const researchAreas = getAllResearchAreas();
     
     return {
       researchAreas
     };
   }
   ```

### Phase 4: Creating a Unified Content Generation Script

1. **Create a comprehensive content generation script**

   ```javascript
   // scripts/generate-content.js
   
   const fs = require('fs');
   const path = require('path');
   const matter = require('gray-matter');
   const marked = require('marked');
   
   // Process all content types
   function processContent(contentType) {
     console.log(`Processing ${contentType}...`);
     
     const contentDir = path.join(process.cwd(), `src/content/${contentType}`);
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
     
     const outputDir = path.join(process.cwd(), 'src/lib/generated');
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
   ```

2. **Update package.json script**

   ```json
   "scripts": {
     "build": "node scripts/generate-content.js && vite build",
     "dev": "node scripts/generate-content.js && vite dev",
     "preview": "vite preview"
   }
   ```

### Phase 5: Testing & Deployment

1. **Test locally**
   - Run the development server: `npm run dev`
   - Verify each section displays content correctly:
     - Check Research page for correct rendering of Markdown content
     - Verify Publications list and detail pages
     - Ensure Blog still works as expected
   - Check that all links and functionality work as expected

2. **Incremental deployment**
   - Deploy changes to a staging environment if available
   - Test on staging before pushing to production
   - Monitor for any errors after deployment

3. **Rollback plan**
   - Keep backup files until the new system is fully verified
   - Document how to revert to the previous implementation if issues arise

## Implementation Timeline

1. **Phase 1 (Setup)**: 30 minutes
2. **Phase 2 (Publications)**: 1-2 hours
3. **Phase 3 (Research)**: 1-2 hours
4. **Phase 4 (Unified Script)**: 1 hour
5. **Phase 5 (Testing)**: 1-2 hours

Total estimated time: 4-7 hours

## Safety Measures

1. **Maintain backward compatibility**:
   - Keep the existing hard-coded data structures in place until the new system is proven
   - Add fallbacks to ensure the site works even if the JSON files are missing
   
   Example fallback pattern:
   ```javascript
   export function getAllResearchAreas() {
     // First try to use the generated data
     try {
       return researchAreas;
     } catch (error) {
       // Fallback to hardcoded data if JSON import fails
       console.warn('Falling back to hardcoded research areas');
       return HARDCODED_RESEARCH_AREAS;
     }
   }
   ```

2. **Staged implementation**:
   - Complete one content type before moving to the next
   - Test extensively after each phase

3. **Version control**:
   - Commit changes after each successful phase
   - Use clear commit messages to document the migration progress

## Future Enhancements

Once the basic migration is complete, consider these enhancements:

1. **Content previews**: Add ability to preview content while editing
2. **Improved metadata**: Enhance frontmatter with additional fields like:
   - `coverImage` for featured images
   - `lastUpdated` to track content freshness
   - `relatedContent` to link between related items
3. **Tagging system**: Implement a unified tagging system across all content types
4. **Content search**: Add full-text search across all markdown content

## Conclusion

This migration will create a consistent, maintainable content management approach across all sections of the website. By using Markdown files for all content, the site will be easier to update, maintain, and extend in the future. 