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
  // Image props
  export let src = '';
  export let alt = '';
  export let width = undefined;
  export let height = undefined;
  export let aspectRatio = undefined;
  export let lazy = true;
  export let fetchpriority = 'auto';
  export let className = '';
  export let sizes = '100vw';
  export let objectFit = 'cover';
  export let objectPosition = 'center';
  export let loading = lazy ? 'lazy' : 'eager';
  export let blurPlaceholder = true;
  export let debug = false; // Disable debugging by default
  export let square = false; // Add square property for 1:1 aspect ratio
  export let disableLargestSizes = false; // Add disableLargestSizes property
  export let transitionDuration = '0.5s'; // Allow customizing transition duration
  export let fadeIn = true; // Allow disabling fade-in effect
  
  import { onMount, afterUpdate, tick } from 'svelte';
  
  // Calculate aspect ratio if dimensions are provided
  const calculatedAspectRatio = square ? '1/1' : (aspectRatio || (width && height ? `${width}/${height}` : undefined));
  
  // Standardize width to match available optimized sizes
  // This helps avoid 404s when requesting sizes that don't exist
  function standardizeWidth(requestedWidth) {
    if (!requestedWidth) return 640; // Default to 640 if no width provided
    
    // Available widths from the optimizer
    const availableWidths = [320, 640, 960, 1280, 1920];
    
    // Find the closest available width
    let closestWidth = availableWidths[0];
    let minDiff = Math.abs(requestedWidth - closestWidth);
    
    for (let i = 1; i < availableWidths.length; i++) {
      const diff = Math.abs(requestedWidth - availableWidths[i]);
      if (diff < minDiff) {
        minDiff = diff;
        closestWidth = availableWidths[i];
      }
    }
    
    return closestWidth;
  }
  
  // Standardize the width if provided
  const standardWidth = width ? standardizeWidth(width) : undefined;
  
  // HELPERS FOR PATH CONSTRUCTION
  // Extract the file name from the source path
  function getFilename(path) {
    if (!path) return '';
    
    // Get the part after the last slash
    const filename = path.split('/').pop();
    
    // Remove the extension if present
    return filename ? (filename.includes('.') ? filename.split('.')[0] : filename) : '';
  }
  
  // Build an optimized image path
  function buildOptimizedPath(name, width, format = 'avif', isPlaceholder = false) {
    // Always use the /images/optimized/ path for consistency
    const optimizedDir = '/images/optimized';
    
    // For placeholder
    if (isPlaceholder) {
      return `${optimizedDir}/${name}-placeholder.webp`;
    }
    
    // For regular optimized image with width
    if (width) {
      return `${optimizedDir}/${name}-${width}.${format}`;
    }
    
    // Original path fallback
    return `${optimizedDir}/${name}.${format}`;
  }
  
  // State variables
  let imgRef;
  let placeholderImgRef;
  let loaded = false;
  let placeholderLoaded = false;
  let visible = !lazy;
  let error = false; // Track loading errors
  let observer;
  let preloading = false; // Track if image is being preloaded
  let currentSrc = src; // Keep track of current src to detect changes
  let requestId = Math.random().toString(36).substring(2, 15); // Unique ID for this component instance
  let loadStartTime = 0; // Track when loading started
  let transitionStarted = false; // Track if transition has started
  
  // Store image paths
  let filename;
  let placeholderSrc;
  let finalSrc;
  let finalSrcset = '';
  
  // Create a preload image element to load the final image in the background
  // This reduces flickering by ensuring the final image is ready before showing it
  function preloadFinalImage() {
    if (preloading || !finalSrc) return;
    
    loadStartTime = performance.now();
    preloading = true;
    if (debug) console.log(`[${requestId}] Preloading final image:`, finalSrc);
    
    const preloadImg = new Image();
    preloadImg.src = finalSrc;
    if (finalSrcset) preloadImg.srcset = finalSrcset;
    preloadImg.onload = () => {
      const loadTime = performance.now() - loadStartTime;
      loaded = true;
      preloading = false;
      if (debug) console.log(`[${requestId}] Preload complete in ${loadTime.toFixed(0)}ms:`, finalSrc);
      
      // Add a small delay for smoother transition (only if placeholder was shown)
      if (placeholderLoaded && !transitionStarted) {
        transitionStarted = true;
        setTimeout(() => {
          // This is when the transition actually starts
          if (debug) console.log(`[${requestId}] Starting image transition`);
        }, 50); // Small delay for smoother transition
      }
    };
    preloadImg.onerror = () => {
      error = true;
      preloading = false;
      if (debug) console.error(`[${requestId}] Preload failed:`, finalSrc);
    };
  }
  
  // Update image paths when src changes
  function updateImagePaths() {
    // Reset state when src changes
    if (currentSrc !== src) {
      loaded = false;
      placeholderLoaded = false;
      error = false;
      preloading = false;
      transitionStarted = false;
      currentSrc = src;
      
      if (debug) console.log(`[${requestId}] Source changed, updating paths`);
    }
    
    // Extract the filename from the src
    filename = getFilename(src);
    
    // Generate paths
    placeholderSrc = buildOptimizedPath(filename, null, null, true);
    finalSrc = buildOptimizedPath(filename, standardWidth, 'avif', false);
    
    // Generate srcset for responsive loading
    if (filename) {
      try {
        // Generate srcset with multiple sizes
        const breakpoints = disableLargestSizes 
          ? [320, 640, 960] 
          : [320, 640, 960, 1280, 1920];
          
        finalSrcset = breakpoints
          .map(bp => {
            const optimizedPath = buildOptimizedPath(filename, bp, 'avif', false);
            return `${optimizedPath} ${bp}w`;
          })
          .join(', ');
        
        if (debug) console.log(`[${requestId}] Generated srcset:`, finalSrcset);
      } catch (err) {
        if (debug) console.error(`[${requestId}] Error generating srcset:`, err);
        finalSrcset = '';
      }
    }
    
    // Debug output - log all component parameters when debug mode is enabled
    if (debug && typeof console !== 'undefined') {
      console.log(`[${requestId}] Image component debug info:`);
      console.log(`[${requestId}] - Original src:`, src);
      console.log(`[${requestId}] - Extracted filename:`, filename);
      console.log(`[${requestId}] - Standardized width:`, standardWidth);
      console.log(`[${requestId}] - Placeholder src:`, placeholderSrc);
      console.log(`[${requestId}] - Final src:`, finalSrc);
      console.log(`[${requestId}] - Width/Height:`, width, height);
      console.log(`[${requestId}] - Aspect Ratio:`, calculatedAspectRatio);
      console.log(`[${requestId}] - Square:`, square);
      console.log(`[${requestId}] - Lazy Loading:`, lazy);
      console.log(`[${requestId}] - disableLargestSizes:`, disableLargestSizes);
    }
  }
  
  // Setup IntersectionObserver for lazy loading
  function setupObserver() {
    if (lazy && 'IntersectionObserver' in window && imgRef) {
      if (debug) console.log(`[${requestId}] Setting up IntersectionObserver for lazy loading`);
      
      // Disconnect previous observer if it exists
      if (observer) observer.disconnect();
      
      observer = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting) {
            if (debug) console.log(`[${requestId}] Image is now visible in viewport`);
            visible = true;
            observer.disconnect();
            
            // Start preloading the final image once visible
            tick().then(() => {
              if (blurPlaceholder && placeholderImgRef) {
                // If we're using placeholders, wait for the placeholder to load
                if (placeholderLoaded) {
                  preloadFinalImage();
                }
              } else {
                // Otherwise, start preloading immediately
                preloadFinalImage();
              }
            });
          }
        },
        { rootMargin: '200px' }
      );
      
      observer.observe(imgRef);
      if (debug) console.log(`[${requestId}] Observer attached to image element`);
    } else {
      // If not using lazy loading or no IntersectionObserver, make visible immediately
      visible = true;
      // Start preloading the final image immediately
      tick().then(() => preloadFinalImage());
    }
  }
  
  // Initial path generation and updates when src changes
  updateImagePaths();
  
  // Handle component lifecycle
  onMount(() => {
    if (debug) console.log(`[${requestId}] Image component mounted, lazy:`, lazy);
    setupObserver();
    
    return () => {
      if (observer) observer.disconnect();
    };
  });
  
  // Update image paths and re-observe when src changes
  afterUpdate(() => {
    if (currentSrc !== src) {
      updateImagePaths();
      setupObserver();
    }
  });
  
  function handleLoad() {
    const loadTime = performance.now() - loadStartTime;
    if (debug) console.log(`[${requestId}] Image loaded successfully in ${loadTime.toFixed(0)}ms:`, finalSrc);
    loaded = true;
  }
  
  function handlePlaceholderLoad() {
    if (debug) console.log(`[${requestId}] Placeholder loaded successfully:`, placeholderSrc);
    placeholderLoaded = true;
    // Start preloading the final image once placeholder is loaded
    preloadFinalImage();
  }
  
  function handleError(e) {
    if (debug) {
      console.error(`[${requestId}] Image failed to load:`, e.target.src);
      console.log(`[${requestId}] Attempting to use original src as fallback`);
    }
    
    // Try falling back to the unoptimized source if it's different
    if (e.target.src !== src && src) {
      error = true;
      e.target.src = src;
    } else {
      // If we're already using the original src or there is no original,
      // just mark as error but don't try to load anything else
      error = true;
    }
  }
  
  function handlePlaceholderError() {
    if (debug) console.log(`[${requestId}] Placeholder image failed to load:`, placeholderSrc);
    // If placeholder fails, just try loading the final image
    preloadFinalImage();
  }
</script>

<div 
  class="image-wrapper {className}" 
  style:aspect-ratio={calculatedAspectRatio}
  style:width={width ? `${width}px` : '100%'}
  style:max-width={width ? `${width}px` : 'none'}
  data-debug={debug}
  data-error={error}
  data-loaded={loaded}
  data-visible={visible}
  data-request-id={requestId}
>
  {#if debug}
    <!-- Debug info overlay, only shown in debug mode -->
    <div class="debug-info">
      <div>id: {requestId.slice(0, 5)}</div>
      <div>src: {src.split('/').pop()}</div>
      <div>status: {error ? 'error' : (loaded ? 'loaded' : 'loading')}</div>
      <div>filename: {filename}</div>
    </div>
  {/if}

  {#if !loaded && blurPlaceholder}
    <div class="placeholder" aria-hidden="true">
      {#if visible}
        <img 
          bind:this={placeholderImgRef}
          src={placeholderSrc} 
          alt="" 
          class="placeholder-img" 
          width={standardWidth || width} 
          height={height}
          on:load={handlePlaceholderLoad}
          on:error={handlePlaceholderError}
        />
      {/if}
    </div>
  {/if}
  
  {#if visible}
    <img
      bind:this={imgRef}
      src={finalSrc}
      {alt}
      width={standardWidth || width}
      height={height}
      {loading}
      {sizes}
      {fetchpriority}
      style:object-fit={objectFit}
      style:object-position={objectPosition}
      class="image"
      class:loaded
      class:fade-in={fadeIn}
      style:--transition-duration={transitionDuration}
      on:load={handleLoad}
      on:error={handleError}
      srcset={finalSrcset}
      decoding="async"
    />
  {/if}
</div>

<style>
  .image-wrapper {
    position: relative;
    overflow: hidden;
    background-color: #f5f5f5;
    display: inline-block;
    width: 100%;
    height: auto;
  }
  
  :global(.dark) .image-wrapper {
    background-color: #374151;
  }
  
  .placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  :global(.dark) .placeholder {
    background-color: #374151;
  }
  
  .placeholder-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(10px);
    transform: scale(1.05);
    opacity: 0.7;
  }
  
  .image {
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0;
    position: relative;
    z-index: 1;
    transform: scale(1.03); /* Slightly scaled up initially */
  }
  
  .image.loaded {
    opacity: 1;
    transform: scale(1); /* Scale to normal size when loaded */
  }
  
  .image.fade-in {
    transition: 
      opacity var(--transition-duration, 0.5s) ease-out,
      transform var(--transition-duration, 0.5s) cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  
  /* Debug info styling */
  .debug-info {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(255, 0, 0, 0.7);
    color: white;
    font-size: 10px;
    padding: 2px 5px;
    z-index: 10;
    pointer-events: none;
    border-radius: 0 0 4px 0;
  }
</style> 