# Image Optimization Guide for SEO and Performance

## Introduction

Image optimization is a critical aspect of website performance and SEO. Properly optimized images can significantly improve page load times, user experience, and search engine rankings. This guide outlines best practices for optimizing images on your SvelteKit website.

## Current Implementation

The current implementation loads images directly without any optimization pipeline. This can lead to:
- Unnecessarily large file sizes
- No responsive images based on device size
- Poor Core Web Vitals scores (particularly Largest Contentful Paint)
- Higher bandwidth usage for users

## Recommended Improvements

### 1. Use the `<img>` Element with Proper Attributes

```html
<img 
  src="/path/to/image.jpg" 
  alt="Descriptive text about the image" 
  width="800" 
  height="600" 
  loading="lazy" 
  decoding="async" 
/>
```

Always include:
- `alt` attribute for accessibility and SEO
- Explicit `width` and `height` to prevent layout shifts
- `loading="lazy"` for images below the fold
- `decoding="async"` to optimize browser rendering

### 2. Implement a SvelteKit Image Component

Create a reusable `Image.svelte` component to standardize image handling:

```svelte
<!-- /src/lib/components/Image.svelte -->
<script>
  export let src = '';
  export let alt = '';
  export let width = undefined;
  export let height = undefined;
  export let lazy = true;
  export let className = '';
  
  // Generate srcset for responsive images
  let srcSet = '';
  if (src.startsWith('/') && !src.includes('?')) {
    // For local images we can generate multiple sizes
    const sizes = [320, 640, 960, 1280, 1920];
    srcSet = sizes
      .map(size => `${src}?width=${size} ${size}w`)
      .join(', ');
  }
</script>

<img
  {src}
  {alt}
  {width}
  {height}
  loading={lazy ? 'lazy' : 'eager'} 
  decoding="async"
  class={className}
  srcset={srcSet}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
/>
```

### 3. Use Next-gen Image Formats

- Convert JPEG/PNG images to WebP or AVIF format
- Use the `<picture>` element for broader browser support:

```html
<picture>
  <source srcset="/images/example.avif" type="image/avif">
  <source srcset="/images/example.webp" type="image/webp">
  <img src="/images/example.jpg" alt="Description" width="800" height="600">
</picture>
```

### 4. Set Up an Image Processing Pipeline

#### Option 1: Static Image Processing (Build Time)

Use tools like Sharp to process images during build:

```javascript
// svelte.config.js (using vite plugin)
import { sveltekit } from '@sveltejs/kit/vite';
import { imagetools } from 'vite-imagetools';

const config = {
  plugins: [
    sveltekit(),
    imagetools({
      defaultDirectives: new URLSearchParams('?width=800;1200;1600&format=webp;jpg&as=srcset')
    })
  ]
};

export default config;
```

#### Option 2: Cloudinary or Imgix Integration

For dynamic image processing, integrate with a CDN service like Cloudinary:

```javascript
// In your component
const CLOUDINARY_URL = 'https://res.cloudinary.com/your-cloud-name/image/upload/';

// Transform the image URL
function optimizeImage(src, width = 800) {
  if (src.startsWith('http') || !src.startsWith('/')) return src;
  
  // Apply transformations
  const transformations = `w_${width},c_fill,q_auto,f_auto`;
  return `${CLOUDINARY_URL}${transformations}${src}`;
}
```

### 5. Implement Open Graph and Twitter Card Images

For social media sharing, create dedicated images:

```html
<!-- In your SEO component -->
<meta property="og:image" content={optimizedOgImage} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content={optimizedTwitterImage} />
```

### 6. Implement Lazy Loading for Images Below the Fold

- Use native `loading="lazy"` attribute
- Consider using Intersection Observer for more control:

```javascript
// In your component's onMount
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});

// Observe all images with data-src attribute
document.querySelectorAll('img[data-src]').forEach(img => {
  observer.observe(img);
});
```

### 7. Image Best Practices for Core Web Vitals

- Preload hero/LCP images: `<link rel="preload" href="/hero.webp" as="image">`
- Use appropriate image dimensions (avoid scaling down large images)
- Compress images appropriately (75-85% quality usually sufficient)
- Use CSS instead of images when possible
- Consider blur-up/placeholder techniques for a better loading experience

## Implementation Plan

1. Create an `Image.svelte` component in `/src/lib/components/`
2. Set up image preprocessing with a Vite plugin
3. Update existing image tags to use the new component
4. Create standardized Open Graph images for social sharing
5. Implement preloading for above-the-fold images

## Metrics to Track

After implementing these optimizations, monitor these metrics:
- Largest Contentful Paint (LCP) - should be < 2.5s
- First Input Delay (FID) - should be < 100ms
- Cumulative Layout Shift (CLS) - should be < 0.1
- Overall page weight reduction
- Image load time

Use Lighthouse and PageSpeed Insights to measure these improvements.

## Resources

- [web.dev: Image Optimization](https://web.dev/fast/#optimize-your-images)
- [MDN: Responsive images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [SvelteKit Image Plugin](https://github.com/sveltejs/kit/tree/master/packages/image)
- [Cloudinary Documentation](https://cloudinary.com/documentation) 