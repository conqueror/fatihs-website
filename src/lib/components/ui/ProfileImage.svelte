<!-- 
  ProfileImage.svelte - A specialized image component for profile photos with:
  - Art direction for different viewports (different crops for mobile vs desktop)
  - Optimal formats (AVIF, WebP, JPG) for each viewport
  - Responsive sizes with appropriate srcset
  - Proper width/height to prevent layout shifts
  - Blur-up loading for better UX
  - Square option with customizable aspect ratios for different viewports
-->
<script>
  // Image props
  export let src = '/images/profile.avif'; // Default to main profile image
  export let alt = 'Profile photo';
  export let width = 600; // Default width
  export let height = 600; // Default height
  export let className = '';
  export let square = true; // Default to square for profile photos
  export let objectFit = 'cover';
  export let objectPosition = 'center'; // Can be adjusted for different crops
  export let lazy = false; // Default is false since this is often an LCP element
  export let loading = lazy ? 'lazy' : 'eager'; // Make sure loading matches lazy setting
  export let fetchpriority = 'high'; // Default is high for faster loading as this is an LCP element
  export let blurPlaceholder = true;
  export let transitionDuration = '0.3s';
  
  // Mobile/desktop specific props
  export let mobileObjectPosition = objectPosition; // Allow different focal points on mobile
  export let desktopObjectPosition = objectPosition; // Allow different focal points on desktop
  export let mobileAspectRatio = square ? '1/1' : undefined;
  export let desktopAspectRatio = square ? '1/1' : undefined;
  
  // Responsive sizes props
  export let sizes = '(max-width: 768px) 100vw, 600px';
  
  import { onMount, tick } from 'svelte';
  import { browser } from '$app/environment';
  
  // State variables
  let loaded = false;
  let placeholderLoaded = false;
  let imageContainer;
  let isVisible = !lazy;
  let observer;
  let isMobile = false;
  
  // Extract file info from src path
  const getFileInfo = (path) => {
    if (!path) return { name: '', ext: 'avif' };
    
    // Get the filename without path
    const filename = path.split('/').pop();
    
    // Split filename and extension
    if (filename.includes('.')) {
      const parts = filename.split('.');
      return { 
        name: parts.slice(0, -1).join('.'), 
        ext: parts[parts.length - 1] 
      };
    }
    
    // Default if no extension found
    return { name: filename, ext: 'avif' };
  };
  
  // Get file info
  const { name: filename, ext: originalExt } = getFileInfo(src);
  
  // Generate path for optimized images
  const getOptimizedPath = (size, format) => {
    return `/images/optimized/${filename}-${size}.${format}`;
  };
  
  // Generate placeholder path
  const placeholderPath = `/images/optimized/${filename}-placeholder.webp`;
  
  // Available image widths - only keep sizes needed for max 600px display
  const imageSizes = [320, 480, 640]; // Removed larger sizes
  
  // Mobile vs desktop breakpoint in pixels
  const mobileBreakpoint = 768;
  
  // Generate srcset strings
  const avifSrcset = imageSizes.map(size => `${getOptimizedPath(size, 'avif')} ${size}w`).join(', ');
  const webpSrcset = imageSizes.map(size => `${getOptimizedPath(size, 'webp')} ${size}w`).join(', ');
  const jpgSrcset = imageSizes.map(size => `${getOptimizedPath(size, 'jpg')} ${size}w`).join(', ');
  
  // Handle viewport changes
  const updateViewport = () => {
    if (!browser) return;
    isMobile = window.innerWidth < mobileBreakpoint;
  };
  
  // Setup intersection observer for lazy loading
  const setupObserver = () => {
    if (lazy && browser && 'IntersectionObserver' in window && imageContainer) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            isVisible = true;
            observer.disconnect();
          }
        },
        { rootMargin: '200px' } // Start loading 200px before visible
      );
      
      observer.observe(imageContainer);
      
      return () => {
        if (observer) observer.disconnect();
      };
    }
  };
  
  // Handle image load
  const handleLoad = () => {
    loaded = true;
  };
  
  // Handle placeholder load
  const handlePlaceholderLoad = () => {
    placeholderLoaded = true;
  };
  
  onMount(() => {
    updateViewport();
    
    // Set up resize listener
    if (browser) {
      window.addEventListener('resize', updateViewport);
    }
    
    // Set up intersection observer
    setupObserver();
    
    // Clean up
    return () => {
      if (browser) {
        window.removeEventListener('resize', updateViewport);
      }
      if (observer) {
        observer.disconnect();
      }
    };
  });
</script>

<div 
  bind:this={imageContainer}
  class="profile-image-container {className}" 
  style:aspect-ratio={isMobile ? mobileAspectRatio : desktopAspectRatio}
  style:width={width ? `${width}px` : '100%'}
  style:max-width="100%"
>
  <!-- Blur placeholder that shows immediately -->
  {#if blurPlaceholder && !loaded}
    <div class="placeholder-container">
      <img 
        src={placeholderPath} 
        alt="" 
        aria-hidden="true"
        class="placeholder-image" 
        on:load={handlePlaceholderLoad}
        style:object-position={isMobile ? mobileObjectPosition : desktopObjectPosition}
      />
    </div>
  {/if}
  
  <!-- Actual image with responsive sources -->
  {#if isVisible}
    <div class="image-container">
      <picture class="image-picture">
        <!-- AVIF format sources - best compression -->
        <source 
          type="image/avif" 
          srcset={avifSrcset} 
          {sizes}
        >
        
        <!-- WebP format sources - good fallback -->
        <source 
          type="image/webp" 
          srcset={webpSrcset} 
          {sizes}
        >
        
        <!-- JPEG format sources - universal fallback -->
        <source 
          srcset={jpgSrcset} 
          {sizes}
        >
        
        <!-- Fallback image -->
        <img 
          src={getOptimizedPath(640, originalExt)} 
          {alt}
          width={width} 
          height={height}
          class="image {loaded ? 'loaded' : ''}"
          style:object-fit={objectFit}
          style:object-position={isMobile ? mobileObjectPosition : desktopObjectPosition}
          style:--transition-duration={transitionDuration}
          {loading}
          fetchpriority={fetchpriority}
          decoding="async"
          on:load={handleLoad}
        />
      </picture>
    </div>
  {/if}
</div>

<style>
  .profile-image-container {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: auto;
    background-color: #f0f0f0;
  }
  
  .placeholder-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    overflow: hidden;
  }
  
  .placeholder-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(20px);
    transform: scale(1.1); /* Prevent edge artifacts from blur */
    transition: opacity 0.3s ease;
  }
  
  .image-container {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
  
  .image-picture {
    display: block;
    width: 100%;
    height: 100%;
  }
  
  .image {
    display: block;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity var(--transition-duration) ease;
  }
  
  .image.loaded {
    opacity: 1;
  }
  
  /* Optimization for mobile devices */
  @media (max-width: 768px) {
    .placeholder-image {
      filter: blur(10px); /* Less blur on mobile for better performance */
    }
  }
</style> 