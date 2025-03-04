/**
 * This script helps handle page refreshes by:
 * 1. Checking if we're on a 404 page
 * 2. Attempting to clean the URL and redirect to the base application
 * 3. Preserving the current path so the client-side routing can take over
 */

(function() {
  // Check if we might be on a 404 page (detected by checking for specific elements)
  const is404Page = window.location.pathname.includes('/404.html') || 
                    document.title.includes('404') || 
                    document.title.includes('Not Found');
  
  // If we're on a 404 page or want to ensure clean navigation
  if (is404Page || window.__HANDLE_REFRESH__) {
    // Extract the path from the URL and clean it
    const originalPath = window.location.pathname.replace('/404.html', '');
    const cleanPath = originalPath.replace(/\/+$/, '');
    
    // Get the base path from SvelteKit's configuration
    const baseUrl = window.__SVELTEKIT_BASE__ || '';
    
    // Construct new URL, preserving query parameters and hash
    const newUrl = baseUrl + cleanPath + window.location.search + window.location.hash;
    
    // Set a cache buster flag to prevent infinite redirects
    if (!sessionStorage.getItem('refreshAttempted_' + cleanPath)) {
      sessionStorage.setItem('refreshAttempted_' + cleanPath, 'true');
      
      // Only redirect if we're not already at the right URL
      if (window.location.href !== newUrl && cleanPath) {
        window.history.replaceState(null, '', newUrl);
        window.location.reload();
      }
    } else {
      // Clear the flag after a delay
      setTimeout(() => {
        sessionStorage.removeItem('refreshAttempted_' + cleanPath);
      }, 30000);
    }
  }
})(); 