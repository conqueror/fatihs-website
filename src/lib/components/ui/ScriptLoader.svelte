<script>
  // Script loader component for optimized loading of external scripts
  // Options for loading external JavaScripts with different strategies
  export let src = '';              // Script URL to load
  export let type = 'text/javascript'; // Script type
  export let strategy = 'defer';    // Loading strategy: defer, async, lazy, immediate
  export let id = '';               // Optional ID for the script
  export let crossorigin = false;   // Add crossorigin attribute
  export let integrity = '';        // Optional SRI hash for security
  export let onLoad = () => {};     // Callback when script is loaded
  export let inline = '';           // Inline script content (alternative to src)
  export let lazyThreshold = '200px'; // Margin for lazy loading

  import { onMount } from 'svelte';
  
  let scriptEl;
  let observer;
  let isClient = typeof window !== 'undefined';
  let isScriptLoaded = false;
  
  // Function to load the script
  function loadScript() {
    if (!isClient || isScriptLoaded) return;
    
    // Create script element
    const script = document.createElement('script');
    script.type = type;
    
    if (src) {
      script.src = src;
    }
    
    if (id) {
      script.id = id;
    }
    
    if (integrity) {
      script.integrity = integrity;
    }
    
    if (crossorigin) {
      script.crossOrigin = typeof crossorigin === 'string' ? crossorigin : 'anonymous';
    }
    
    // Set loading strategy
    if (strategy === 'defer') {
      script.defer = true;
    } else if (strategy === 'async') {
      script.async = true;
    }
    
    // Add onload handler
    script.onload = () => {
      isScriptLoaded = true;
      onLoad();
      
      // Clean up observer if it exists
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    };
    
    // If inline script, set the content
    if (inline && !src) {
      script.textContent = inline;
    }
    
    // Append to document head or body
    document.head.appendChild(script);
    scriptEl = script;
  }
  
  onMount(() => {
    // Skip if not in browser
    if (!isClient) return;
    
    // Handle different loading strategies
    if (strategy === 'immediate') {
      loadScript();
    } else if (strategy === 'lazy' && 'IntersectionObserver' in window) {
      // Create a placeholder element to observe
      const placeholder = document.createElement('div');
      placeholder.style.display = 'none';
      document.body.appendChild(placeholder);
      
      // Create observer for lazy loading
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadScript();
          }
        },
        { 
          rootMargin: lazyThreshold 
        }
      );
      
      observer.observe(placeholder);
      
      return () => {
        // Clean up
        if (observer) {
          observer.disconnect();
        }
        if (placeholder && placeholder.parentNode) {
          placeholder.parentNode.removeChild(placeholder);
        }
      };
    } else {
      // Default to defer if lazy not supported
      loadScript();
    }
    
    return () => {
      // Clean up script if needed on component destroy
      // This is generally not recommended as it can cause issues,
      // but here as an option for specific use cases
      if (scriptEl && scriptEl.parentNode && id) {
        // Only remove scripts with explicit IDs to avoid removing scripts that might be used elsewhere
        scriptEl.parentNode.removeChild(scriptEl);
      }
    };
  });
</script>

{#if inline && !src && strategy === 'inline'}
  <script {type}>{inline}</script>
{/if} 