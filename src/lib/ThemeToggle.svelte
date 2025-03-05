<script>
  import { onMount } from 'svelte';
  import { theme } from './stores';
  import { browser } from '$app/environment';
  
  // Keep local state in sync with the theme store
  let isDarkMode;
  
  // Subscribe to theme store changes
  theme.subscribe(value => {
    isDarkMode = value === 'dark';
  });
  
  // Make sure to initialize the component with the current theme
  onMount(() => {
    // If we have the initialTheme from the inline script, use that
    if (browser && window.initialTheme) {
      theme.set(window.initialTheme);
      isDarkMode = window.initialTheme === 'dark';
    } else {
      // Fallback to localStorage or system preference
      const savedTheme = browser ? localStorage.getItem('theme') : null;
      if (savedTheme) {
        theme.set(savedTheme);
        isDarkMode = savedTheme === 'dark';
      } else if (browser) {
        // Use system preference as fallback
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        theme.set(systemTheme);
        isDarkMode = systemTheme === 'dark';
      }
    }
  });
  
  function toggleTheme() {
    const newTheme = isDarkMode ? 'light' : 'dark';
    
    // Update the theme store
    theme.set(newTheme);
    
    // Update the DOM
    document.documentElement.setAttribute('data-theme', newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('theme', newTheme);
  }
</script>

<button 
  on:click={toggleTheme}
  aria-label="Toggle dark mode"
  class="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-blue-400 dark:focus:ring-offset-gray-900 transition-colors"
>
  {#if isDarkMode}
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path 
        fill-rule="evenodd" 
        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" 
        clip-rule="evenodd" 
      />
    </svg>
  {:else}
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
  {/if}
</button> 