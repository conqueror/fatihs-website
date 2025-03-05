<!-- 
  Image.svelte - An optimized image component that supports:
  - WebP format with fallbacks
  - Responsive sizing with srcset
  - Lazy loading
  - Proper width/height to prevent layout shifts
  - Blur-up loading effect for better UX
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
  
  // Generate srcset based on the original image
  // This assumes your build process creates responsive versions
  // or you're manually creating them
  function generateSrcset(src) {
    // Extract file extension and path
    const fileExt = src.split('.').pop();
    const basePath = src.substring(0, src.lastIndexOf('.'));
    
    // Different size variations
    const widths = [320, 640, 960, 1280, 1920];
    
    // Generate WebP srcset
    const webpSrcset = widths
      .map(w => `${basePath}-${w}.webp ${w}w`)
      .join(', ');
      
    // Generate original format srcset as fallback
    const originalSrcset = widths
      .map(w => `${basePath}-${w}.${fileExt} ${w}w`)
      .join(', ');
    
    return {
      webp: webpSrcset,
      original: originalSrcset
    };
  }
  
  // Generate srcsets if width and height are provided
  const srcsets = width && height ? generateSrcset(src) : null;
  
  // Low quality placeholder image (if no blurhash provided)
  let loadingComplete = false;
  
  // Handle image load event
  function handleLoad() {
    loadingComplete = true;
  }
</script>

<div class="image-container {className}" style="aspect-ratio: {width}/{height}; background-color: #f0f0f0;">
  {#if blurhash}
    <div class="blur-placeholder" 
         style="background-image: url({blurhash}); opacity: {loadingComplete ? 0 : 1};"
         aria-hidden="true"></div>
  {/if}
  
  {#if srcsets}
    <picture>
      <!-- WebP format for modern browsers -->
      <source 
        type="image/webp" 
        srcset={srcsets.webp} 
        sizes={sizes} />
      
      <!-- Original format as fallback -->
      <source 
        type="image/{fileExt}" 
        srcset={srcsets.original} 
        sizes={sizes} />
      
      <!-- Fallback img tag -->
      <img 
        {src} 
        {alt} 
        {width} 
        {height}
        loading={lazy ? "lazy" : "eager"} 
        decoding="async"
        style="object-fit: {objectFit}; object-position: {objectPosition};"
        on:load={handleLoad} />
    </picture>
  {:else}
    <!-- Simple img tag when no srcset available -->
    <img 
      {src} 
      {alt} 
      {width} 
      {height}
      loading={lazy ? "lazy" : "eager"} 
      decoding="async"
      style="object-fit: {objectFit}; object-position: {objectPosition};"
      on:load={handleLoad} />
  {/if}
</div>

<style>
  .image-container {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: auto;
    background-color: #f0f0f0; /* Placeholder color before image loads */
  }
  
  img {
    display: block;
    width: 100%;
    height: 100%;
    transition: opacity 0.3s ease;
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
  
  img {
    position: relative;
    z-index: 2;
  }
</style> 