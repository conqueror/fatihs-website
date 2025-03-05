<!-- 
  Image.svelte - An optimized image component that supports:
  - AVIF and WebP formats with appropriate fallbacks
  - Responsive sizing with srcset
  - Lazy loading
  - Proper width/height to prevent layout shifts
  - Blur-up loading effect for better UX
  - Square option for consistent proportions
-->
<script>
  // Core image properties
  export let src = '';
  export let alt = '';
  export let width = undefined;
  export let height = undefined;
  
  // Optional properties for optimization
  export let lazy = true;
  export let sizes = '100vw';
  export let className = '';
  export let objectFit = 'cover';
  export let objectPosition = 'center';
  export let blurhash = null;
  export let style = '';
  export let square = false; // New option to force square aspect ratio
  export let debug = false; // Debug flag, default to false
  
  // For debugging
  let srcPath = src;
  
  // Generate srcset based on the original image
  // This assumes your build process creates responsive versions
  // or you're manually creating them
  function generateSrcset(src) {
    // Skip for external URLs
    if (src.startsWith('http') || src.startsWith('data:')) {
      return {
        avif: '',
        webp: '',
        original: ''
      };
    }
    
    // Extract file extension and path
    const fileExt = src.split('.').pop().toLowerCase();
    const basePath = src.substring(0, src.lastIndexOf('.'));
    
    // Convert path to use optimized folder path if it's not already there
    let optimizedBasePath = basePath;
    if (!optimizedBasePath.includes('/optimized/')) {
      const parts = optimizedBasePath.split('/');
      const filename = parts.pop();
      optimizedBasePath = [...parts, 'optimized', filename].join('/');
    }
    
    // Different size variations
    const widths = [320, 640, 960, 1280, 1920];
    
    // Generate AVIF srcset (best compression)
    const avifSrcset = widths
      .map(w => `${optimizedBasePath}-${w}.avif ${w}w`)
      .join(', ');
    
    // Generate WebP srcset (good compatibility)
    const webpSrcset = widths
      .map(w => `${optimizedBasePath}-${w}.webp ${w}w`)
      .join(', ');
      
    // Generate original format srcset as fallback
    const originalSrcset = widths
      .map(w => `${optimizedBasePath}-${w}.${fileExt} ${w}w`)
      .join(', ');
    
    return {
      avif: avifSrcset,
      webp: webpSrcset,
      original: originalSrcset
    };
  }
  
  // Generate srcsets if width and height are provided
  const srcsets = generateSrcset(src);
  
  // Set default dimensions if not provided to prevent layout shifts
  let imgWidth = width;
  let imgHeight = height;
  let aspectRatio = '';
  
  // If square option is enabled, force 1:1 aspect ratio
  if (square) {
    aspectRatio = '1/1';
  } else if (width && height) {
    aspectRatio = `${width}/${height}`;
  }
  
  // Calculate padding-bottom for the aspect ratio placeholder
  // This ensures space is reserved before the image loads
  let paddingBottom = '';
  if (square) {
    paddingBottom = '100%';
  } else if (width && height) {
    paddingBottom = `${(height / width) * 100}%`;
  }
  
  // Placeholder image path
  let placeholder = null;
  if (!blurhash && src && !src.startsWith('http') && !src.startsWith('data:')) {
    const fileExt = src.split('.').pop().toLowerCase();
    const basePath = src.substring(0, src.lastIndexOf('.'));
    
    // Convert path to use optimized folder path if it's not already there
    let optimizedBasePath = basePath;
    if (!optimizedBasePath.includes('/optimized/')) {
      const parts = optimizedBasePath.split('/');
      const filename = parts.pop();
      optimizedBasePath = [...parts, 'optimized', filename].join('/');
    }
    
    placeholder = `${optimizedBasePath}-placeholder.webp`;
  }
  
  // Loading state tracking
  let loadingComplete = false;
  
  // Handle image load event
  function handleLoad() {
    loadingComplete = true;
  }
  
  // Handle image error event - fallback to original
  function handleError(e) {
    console.error('Image failed to load:', e);
    // If optimized image fails, fallback to original
    if (e.target.src.includes('/optimized/')) {
      e.target.src = src;
    }
  }
  
  // Extract file extension for fallback type
  const fileExt = src.split('.').pop().toLowerCase();
</script>

<div class="image-container enhanced-image {className}" 
     style="{aspectRatio ? `aspect-ratio: ${aspectRatio};` : ''} 
            {paddingBottom ? `padding-bottom: ${paddingBottom};` : ''} 
            {style}"
     data-width={width}
     data-height={height}>
  
  {#if placeholder || blurhash}
    <div 
      class="blur-placeholder" 
      style="background-image: url({blurhash || placeholder}); opacity: {loadingComplete ? 0 : 1};"
      aria-hidden="true">
    </div>
  {/if}
  
  <!-- Fallback text for debugging - only visible when debug mode is enabled -->
  {#if debug}
    <div class="image-debug" style="opacity: {loadingComplete ? 0 : 0.7};">
      Loading: {src.split('/').pop()}
    </div>
  {/if}
  
  <picture class="image-picture">
    <!-- AVIF format for modern browsers with best compression -->
    {#if srcsets.avif}
      <source 
        type="image/avif" 
        srcset={srcsets.avif} 
        sizes={sizes} />
    {/if}
      
    <!-- WebP format for broader browser support -->
    {#if srcsets.webp}
      <source 
        type="image/webp" 
        srcset={srcsets.webp} 
        sizes={sizes} />
    {/if}
    
    <!-- Original format as fallback -->
    {#if srcsets.original}
      <source 
        type={`image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`} 
        srcset={srcsets.original} 
        sizes={sizes} />
    {/if}
    
    <!-- Direct fallback to original image -->
    <source 
      srcset={src}
      sizes={sizes} />
    
    <!-- Fallback img tag with explicit dimensions -->
    <img 
      {src} 
      {alt} 
      width={imgWidth}
      height={imgHeight}
      loading={lazy ? "lazy" : "eager"} 
      decoding="async"
      fetchpriority={lazy ? "auto" : "high"}
      style="object-fit: {objectFit}; object-position: {objectPosition};"
      on:load={handleLoad}
      on:error={handleError} />
  </picture>
</div>

<style>
  .image-container {
    position: relative;
    overflow: hidden;
    width: 100%;
    display: block;
    background-color: #f0f0f0; /* Placeholder color before image loads */
    min-height: 0; /* Remove minimum height to prevent layout shifts */
  }
  
  /* Dark mode support for placeholder background */
  @media (prefers-color-scheme: dark) {
    .image-container {
      background-color: #2a2a2a;
    }
  }
  
  .enhanced-image {
    /* Remove the min-height to prevent layout shifts */
    /* This container now uses padding-bottom instead */
  }
  
  .image-picture {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: block;
  }
  
  .image-debug {
    position: absolute;
    z-index: 10;
    top: 50%;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 10px;
    color: #000;
    background: rgba(255,255,255,0.7);
    padding: 2px;
    transform: translateY(-50%);
    transition: opacity 0.3s ease;
  }
  
  img {
    display: block;
    width: 100%;
    height: 100%;
    max-width: 100%;
    transition: opacity 0.3s ease;
    object-fit: var(--object-fit, cover);
    object-position: var(--object-position, center);
    position: relative;
    z-index: 2;
  }
  
  .blur-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-position: center;
    filter: blur(20px);
    transition: opacity 0.3s ease;
    z-index: 1;
  }
</style> 