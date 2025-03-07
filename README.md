# Fatih Nayebi's Personal Website

This is a personal website built with SvelteKit and hosted on Kinsta Static Site Hosting.

## Features

- Responsive design
- Modern UI with clean aesthetics
- Sections for research, publications, blog, news, and consulting
- Contact form for inquiries

## Tech Stack

- SvelteKit - Frontend framework
- CSS - Styling
- Kinsta - Hosting

## Development

### Prerequisites

- Node.js (v16 or later)
- npm

### Setup

1. Clone the repository
```bash
git clone https://github.com/conqueror/fatihs-website.git
cd fatihs-website
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev -- --open
```

### Building for Production

```bash
npm run build
```

The built files will be in the `build` directory, ready to be deployed to Kinsta Static Site Hosting.

## Deployment

This site is configured for deployment on Kinsta Static Site Hosting. Follow these steps to deploy:

1. Build the project
2. Upload the contents of the `build` directory to Kinsta via Git integration or manual upload

## License

MIT

## Contact

For any inquiries, please reach out via the contact form on the website or directly at fatih@gradientdivergence.com.

## Adding New Blog Posts

To add a new blog post to the website, follow these steps:

1. Create a new Markdown file in the `src/content/blog` directory.
2. Name the file using a URL-friendly slug (e.g., `my-new-blog-post.md`).
3. Add the required front matter at the top of the file:

```markdown
---
title: "Your Blog Post Title"
date: "YYYY-MM-DD"
excerpt: "A brief summary of your blog post (1-2 sentences)."
tags: ["Tag1", "Tag2", "Tag3"]
author: "Fatih Nayebi"
featured: false
---

# Your Blog Post Title

Your content goes here. Write in Markdown format.

## Subheading

More content...

### Another Subheading

- List item 1
- List item 2
- List item 3

```

4. The front matter fields are:
   - `title`: The title of your blog post
   - `date`: The publication date in YYYY-MM-DD format
   - `excerpt`: A brief summary that appears in the blog list
   - `tags`: An array of relevant tags (optional)
   - `author`: The author's name (defaults to "Fatih Nayebi" if omitted)
   - `featured`: Set to `true` to feature the post on the home page (optional, defaults to `false`)

5. Write your blog post content in Markdown format below the front matter.
6. Save the file.
7. Build and deploy the website to see your new blog post.

### Markdown Tips

- Use `#` for the main title (h1)
- Use `##` for section headings (h2)
- Use `###` for subsection headings (h3)
- Use `*italic*` for italic text
- Use `**bold**` for bold text
- Use `[link text](https://example.com)` for links
- Use `![alt text](image-url.jpg)` for images
- Use `- item` for unordered lists
- Use `1. item` for ordered lists
- Use ``` for code blocks

### Images

If you want to include images in your blog post:

1. Add the image files to the `static/images/blog` directory
2. Reference them in your Markdown using:

```markdown
![Alt text](/images/blog/your-image-filename.jpg)
```

### Previewing Your Blog Post

To preview your blog post locally:

1. Run `npm run dev` to start the development server
2. Open your browser to `http://localhost:5173/blog/your-post-slug`

### Publishing

After adding your blog post, build and deploy the website:

1. Run `npm run build` to build the site
2. Deploy the `build` directory to your hosting provider
