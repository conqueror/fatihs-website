<script>
  // Image properties
  export let src = '';
  export let alt = '';
  export let width = undefined;
  export let height = undefined;
  export let aspectRatio = undefined;
  export let loading = 'lazy';
  export let decoding = 'async';
  export let fetchpriority = 'auto';
  export let className = '';
  export let sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'; // Better default sizes attribute
  export let breakpoints = [640, 768, 1024, 1280, 1536, 1920];
  export let blur = true;
  export let objectFit = 'cover';
  export let objectPosition = 'center';
  export let isIntersection = true; // Use intersection observer by default
  
  // Additional mobile optimizations
  export let nativeLazyLoading = true; // Use native lazy loading if available
  export let mobileSizes = '100vw'; // Default mobile sizes value
  export let desktopSizes = '50vw'; // Default desktop sizes value
  
  // Derived properties
  const hasSize = width && height;
  const calculatedAspectRatio = aspectRatio || (hasSize ? `${width}/${height}` : undefined);
  
  // State
  let loaded = false;
  let imgElement;
  let placeholder = '';
  let isVisible = !isIntersection; // If not using intersection observer, mark as visible immediately
  
  // Generate responsive sizes attribute based on mobile/desktop preferences
  $: responsiveSizes = sizes || `(max-width: 640px) ${mobileSizes}, ${desktopSizes}`;
  
  // Dynamic loading attribute for better performance
  $: imgLoading = loading === 'eager' || fetchpriority === 'high' 
    ? 'eager' 
    : (nativeLazyLoading ? 'lazy' : 'eager');
  
  // Generate srcset for responsive images
  function generateSrcSet(imgSrc) {
    if (!imgSrc) return '';
    
    // Skip if srcset is already provided as a full URL
    if (imgSrc.startsWith('http') || imgSrc.includes('/optimized/')) {
      return imgSrc;
    }
    
    // If path doesn't have an extension, return as is
    if (!imgSrc.includes('.')) {
      return '';
    }
    
    const extension = imgSrc.split('.').pop().toLowerCase();
    
    // Generate path to optimized image
    const dirName = imgSrc.substring(0, imgSrc.lastIndexOf('/') + 1);
    const baseName = imgSrc.substring(imgSrc.lastIndexOf('/') + 1, imgSrc.lastIndexOf('.'));
    
    // If baseName or dirName are empty, return src as is
    if (!baseName || !dirName) {
      return '';
    }
    
    // Use optimized path if it exists
    return breakpoints
      .map(bp => `/optimized/${dirName}${baseName}-${bp}.${extension} ${bp}w`)
      .join(', ');
  }
  
  // Generate WebP srcset if supported
  function generateWebPSrcSet(imgSrc) {
    if (!imgSrc || !imgSrc.includes('.')) return '';
    
    const dirName = imgSrc.substring(0, imgSrc.lastIndexOf('/') + 1);
    const baseName = imgSrc.substring(imgSrc.lastIndexOf('/') + 1, imgSrc.lastIndexOf('.'));
    
    // If baseName or dirName are empty, return empty string
    if (!baseName || !dirName) {
      return '';
    }
    
    return breakpoints
      .map(bp => `/optimized/${dirName}${baseName}-${bp}.webp ${bp}w`)
      .join(', ');
  }
  
  const srcset = generateSrcSet(src);
  const webpSrcset = generateWebPSrcSet(src);
  
  // Handle image load event
  function handleLoad() {
    loaded = true;
  }
  
  // Generate low-quality placeholder
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  onMount(() => {
    if (!browser) return;
    
    if (blur) {
      // Generate placeholder gradient
      placeholder = 'linear-gradient(90deg, #f0f0f0, #e0e0e0)';
      
      // Try to load placeholder image
      const placeholderUrl = src 
        ? src.replace(/\.(jpg|jpeg|png|gif)$/i, '-placeholder.webp') 
        : null;
      
      if (placeholderUrl) {
        const img = new Image();
        img.onload = () => {
          placeholder = `url(${placeholderUrl})`;
        };
        img.src = placeholderUrl;
      }
    }
    
    // Set up intersection observer if enabled
    if (isIntersection && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              isVisible = true;
              observer.disconnect();
            }
          });
        },
        { rootMargin: '200px' } // Start loading when image is 200px from viewport
      );
      
      if (imgElement) {
        observer.observe(imgElement.parentElement);
      }
      
      return () => observer.disconnect();
    }
  });
</script>

<div 
  class="image-container {className}" 
  style:aspect-ratio={calculatedAspectRatio} 
  style:width={width ? `${width}px` : '100%'}
  style:max-width={width ? `${width}px` : 'none'}
  style:height={height && !calculatedAspectRatio ? `${height}px` : 'auto'}
>
  {#if blur && !loaded}
    <div 
      class="placeholder" 
      aria-hidden="true" 
      style:background={placeholder}
      style:background-size="cover"
      style:background-position={objectPosition}
    ></div>
  {/if}
  
  {#if isVisible}
    <picture>
      {#if webpSrcset}
        <source type="image/webp" srcset={webpSrcset} {sizes}>
      {/if}
      <img
        bind:this={imgElement}
        {src}
        {alt}
        {width}
        {height}
        sizes={responsiveSizes}
        loading={imgLoading}
        {decoding}
        fetchpriority={fetchpriority}
        srcset={srcset}
        style:object-fit={objectFit}
        style:object-position={objectPosition}
        on:load={handleLoad}
        class:loaded
      />
    </picture>
  {:else}
    <!-- Invisible placeholder div with same dimensions -->
    <div 
      class="invisible-placeholder" 
      bind:this={imgElement}
      style:width={width ? `${width}px` : '100%'}
      style:height={height ? `${height}px` : 'auto'}
    ></div>
  {/if}
</div>

<style>
  .image-container {
    position: relative;
    overflow: hidden;
    width: 100%;
    display: block;
    background-color: #f5f5f5; /* Light gray background before image loads */
  }
  
  img {
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  img.loaded {
    opacity: 1;
  }
  
  .placeholder {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f0f0f0;
    background-size: cover;
    filter: blur(10px);
    transform: scale(1.05); /* Prevent blur edges from showing */
  }
  
  .invisible-placeholder {
    display: block;
  }
  
  /* Optimize the rendering on mobile devices */
  @media (max-width: 640px) {
    .image-container {
      will-change: transform; /* Hint for mobile browsers to use hardware acceleration */
      contain: layout paint; /* Performance optimization for mobile */
    }
    
    .placeholder {
      /* Blur is expensive on mobile, use a more performant version on small screens */
      filter: blur(5px);
    }
    
    img {
      /* More performant transitions on mobile */
      transition: opacity 0.2s ease;
    }
  }
</style> 