/**
 * Image utility functions for optimized image handling
 */

/**
 * Get the image dimensions from filename if it contains dimensions in format
 * example-image-800x600.jpg -> { width: 800, height: 600 }
 * 
 * @param {string} src - The image source URL
 * @returns {Object|null} The dimensions object or null if not found
 */
export function getImageDimensions(src) {
  if (!src) return null;
  
  // Try to extract dimensions from filename
  const match = src.match(/[-_](\d+)x(\d+)\.[a-zA-Z]+$/);
  
  if (match && match[1] && match[2]) {
    return {
      width: parseInt(match[1], 10),
      height: parseInt(match[2], 10),
    };
  }
  
  return null;
}

/**
 * Generate proper sizes attribute based on layout context
 * 
 * @param {string} layout - The layout context ('full', 'half', 'third', 'quarter', etc.)
 * @returns {string} The sizes attribute
 */
export function getSizes(layout = 'full') {
  switch (layout) {
    case 'full':
      return '(max-width: 640px) 100vw, 100vw';
    case 'half':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw';
    case 'third':
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33.3vw';
    case 'quarter':
      return '(max-width: 640px) 50vw, (max-width: 1024px) 33.3vw, 25vw';
    case 'avatar':
      return '(max-width: 640px) 80px, 120px';
    case 'thumbnail':
      return '(max-width: 640px) 150px, 200px';
    case 'hero':
      return '100vw';
    default:
      return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33.3vw';
  }
}

/**
 * Determine if an image should be eager loaded
 * 
 * @param {string} priority - The priority level ('high', 'medium', 'low')
 * @param {boolean} isAboveFold - Whether the image is above the fold
 * @returns {Object} Loading properties
 */
export function getLoadingPriority(priority = 'low', isAboveFold = false) {
  // Hero image, header logo, or critical content image should be high priority
  if (priority === 'high' || (isAboveFold && priority === 'medium')) {
    return {
      loading: 'eager',
      fetchpriority: 'high',
      decoding: 'sync'
    };
  }
  
  // Medium priority images still above fold
  if (isAboveFold) {
    return {
      loading: 'eager',
      fetchpriority: 'auto',
      decoding: 'async'
    }; 
  }
  
  // All other images use default lazy loading
  return {
    loading: 'lazy',
    fetchpriority: 'auto',
    decoding: 'async'
  };
}

/**
 * Get mobile-optimized image props
 * 
 * @param {string} src - Image source
 * @param {Object} options - Additional options
 * @returns {Object} Image props optimized for mobile
 */
export function getMobileImageProps(src, options = {}) {
  // Extract dimensions from filename if not provided
  const dimensions = getImageDimensions(src);
  
  // Determine loading priority
  const loadingProps = getLoadingPriority(
    options.priority, 
    options.isAboveFold
  );
  
  // Determine sizes attribute based on layout
  const sizeAttr = getSizes(options.layout);
  
  return {
    src,
    alt: options.alt || '',
    width: options.width || (dimensions ? dimensions.width : undefined),
    height: options.height || (dimensions ? dimensions.height : undefined),
    sizes: sizeAttr,
    blur: options.blur !== undefined ? options.blur : true,
    objectFit: options.objectFit || 'cover',
    ...loadingProps
  };
} 