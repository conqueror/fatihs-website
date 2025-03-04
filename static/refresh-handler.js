// This script helps fix refresh issues on iOS devices
(function() {
  // Check if this is an iOS device
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  
  if (isIOS) {
    // Store the current path in sessionStorage
    if (window.location.pathname !== '/') {
      sessionStorage.setItem('lastPath', window.location.pathname + window.location.search);
    }
    
    // If we were redirected to the root due to a refresh, navigate back to the stored path
    if (window.location.pathname === '/' && sessionStorage.getItem('lastPath')) {
      const lastPath = sessionStorage.getItem('lastPath');
      // Use history.replaceState to avoid creating a new history entry
      window.history.replaceState(null, '', lastPath);
      // Clear the stored path to avoid issues with normal navigation
      sessionStorage.removeItem('lastPath');
    }
  }
})(); 