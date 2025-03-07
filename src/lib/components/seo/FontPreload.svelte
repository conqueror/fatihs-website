<script>
  // This component handles font preloading to improve Largest Contentful Paint (LCP)
  // and reduce Cumulative Layout Shift (CLS) by loading fonts earlier
</script>

<svelte:head>
  <!-- Preload critical fonts with high priority -->
  <link rel="preload" href="/fonts/Inter-400.woff2" as="font" type="font/woff2" crossorigin fetchpriority="high">
  <link rel="preload" href="/fonts/Inter-700.woff2" as="font" type="font/woff2" crossorigin fetchpriority="high">
  <link rel="preload" href="/fonts/FiraCode-400.woff2" as="font" type="font/woff2" crossorigin>

  <!-- Inline script for immediate font loading detection -->
  {@html `
    <script>
      (function() {
        // Add class to document while fonts are loading
        document.documentElement.classList.add('fonts-loading');
        
        if ('fonts' in document) {
          Promise.all([
            document.fonts.load('1em Inter'),
            document.fonts.load('400 1em Inter'),
            document.fonts.load('700 1em Inter'),
            document.fonts.load('1em Fira Code')
          ]).then(() => {
            document.documentElement.classList.remove('fonts-loading');
            document.documentElement.classList.add('fonts-loaded');
          }).catch(() => {
            // Fallback if font loading fails
            document.documentElement.classList.remove('fonts-loading');
          });
        }
      })();
    </script>
  `}
</svelte:head> 