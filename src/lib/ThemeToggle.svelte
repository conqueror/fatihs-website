<script>
  import { onMount } from 'svelte';
  
  // State for theme
  let isDarkMode = false;
  
  onMount(() => {
    // Check for saved theme preference or prefer-color-scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    isDarkMode = savedTheme === 'dark' || (savedTheme === null && prefersDark);
    updateTheme(isDarkMode);
    
    // Ensure component reflects the current theme
    return () => {
      document.documentElement.classList.remove('dark');
    };
  });
  
  function toggleTheme() {
    isDarkMode = !isDarkMode;
    updateTheme(isDarkMode);
  }
  
  function updateTheme(dark) {
    // Update DOM
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }
</script>

<button 
  on:click={toggleTheme}
  class="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
  aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
>
  {#if isDarkMode}
    <!-- Sun icon for dark mode -->
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700 hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  {:else}
    <!-- Moon icon for light mode -->
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-700 hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  {/if}
</button> 