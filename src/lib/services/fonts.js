/**
 * Font Service
 * Handles font loading, states, and font-related utilities
 */

import { browser } from '$app/environment';
import { writable, derived } from 'svelte/store';

// Font configuration - keep in sync with download-fonts.js
export const fontConfig = {
  sans: {
    family: 'Inter',
    weights: [400, 500, 600, 700],
    styles: ['normal', 'italic'],
    fallback: '-apple-system, BlinkMacSystemFont, system-ui, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
  },
  mono: {
    family: 'Fira Code',
    weights: [400, 500, 700],
    styles: ['normal'],
    fallback: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
  }
};

// Font loading state
export const fontState = writable('loading'); // 'loading', 'loaded', 'failed'

// Derived store for checking if fonts are loaded
export const fontsLoaded = derived(fontState, $state => $state === 'loaded');

/**
 * Initialize font loading
 * Handles font loading lifecycle and state management
 */
export function initFonts() {
  if (!browser) return;
  
  // Check if fonts are already cached
  if (localStorage.getItem('fonts-loaded')) {
    fontState.set('loaded');
    applyFontLoadedClass();
    return;
  }
  
  // Set loading state
  applyFontLoadingClass();
  
  // Use Font Loading API if available
  if ('fonts' in document) {
    // Create loading promises for each critical font
    const fontPromises = [
      document.fonts.load(`1em ${fontConfig.sans.family}`),
      document.fonts.load(`bold 1em ${fontConfig.sans.family}`),
      document.fonts.load(`1em ${fontConfig.mono.family}`)
    ];
    
    // Add timeout promise for failsafe
    const timeoutPromise = new Promise(resolve => {
      setTimeout(() => {
        console.warn('Font loading timed out');
        resolve('timeout');
      }, 3000);
    });
    
    // Race promises against timeout
    Promise.race([
      Promise.all(fontPromises),
      timeoutPromise
    ])
    .then(result => {
      if (result === 'timeout') {
        // If timed out, still mark as loaded for better UX
        fontState.set('loaded');
      } else {
        // Fonts loaded successfully
        fontState.set('loaded');
        localStorage.setItem('fonts-loaded', 'true');
      }
      applyFontLoadedClass();
    })
    .catch(err => {
      console.error('Error loading fonts:', err);
      fontState.set('failed');
      applyFontLoadedClass(); // Still remove loading class for better UX
    });
  } else {
    // Fallback for browsers without Font Loading API
    fontState.set('loaded');
    applyFontLoadedClass();
  }
  
  // Subscribe to font state changes
  const unsubscribe = fontState.subscribe(state => {
    if (state === 'loaded') {
      document.documentElement.classList.add('fonts-loaded');
      document.documentElement.classList.remove('fonts-loading');
    } else if (state === 'loading') {
      document.documentElement.classList.add('fonts-loading');
      document.documentElement.classList.remove('fonts-loaded');
    } else {
      document.documentElement.classList.remove('fonts-loading', 'fonts-loaded');
    }
  });
  
  // Return unsubscribe function for cleanup
  return unsubscribe;
}

/**
 * Apply font loading class to document
 */
function applyFontLoadingClass() {
  if (!browser) return;
  document.documentElement.classList.add('fonts-loading');
  document.documentElement.classList.remove('fonts-loaded');
}

/**
 * Apply font loaded class to document
 */
function applyFontLoadedClass() {
  if (!browser) return;
  document.documentElement.classList.remove('fonts-loading');
  document.documentElement.classList.add('fonts-loaded');
}

/**
 * Get font family string with fallbacks
 * @param {string} type - 'sans' or 'mono'
 * @returns {string} Font family string with fallbacks
 */
export function getFontFamily(type = 'sans') {
  const config = fontConfig[type];
  if (!config) return type === 'mono' ? fontConfig.mono.fallback : fontConfig.sans.fallback;
  
  return `"${config.family}", ${config.fallback}`;
}

/**
 * Clear font cache
 * Useful for debugging or when fonts are updated
 */
export function clearFontCache() {
  if (!browser) return;
  localStorage.removeItem('fonts-loaded');
  fontState.set('loading');
  applyFontLoadingClass();
  
  // Force reload of fonts
  initFonts();
}

// Initialize fonts automatically
if (browser) {
  initFonts();
} 