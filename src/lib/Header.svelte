<script>
  import { page } from '$app/stores';
  import ThemeToggle from './ThemeToggle.svelte';
  
  // For responsive menu
  let isMenuOpen = false;
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  // Close menu when navigating to a new page
  $: if ($page) {
    isMenuOpen = false;
  }
</script>

<header class="fixed w-full top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center h-16">
      <!-- Logo and site name -->
      <div class="flex items-center">
        <a href="/" class="flex items-center space-x-2">
          <span class="font-bold text-xl text-gray-900 dark:text-white">Fatih Nayebi</span>
        </a>
      </div>
      
      <!-- Desktop navigation -->
      <nav class="hidden md:flex items-center space-x-4">
        <a 
          href="/" 
          class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors {$page.url.pathname === '/' ? 'text-blue-600 dark:text-blue-400' : ''}"
        >
          Home
        </a>
        <a 
          href="/about" 
          class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors {$page.url.pathname === '/about' ? 'text-blue-600 dark:text-blue-400' : ''}"
        >
          About
        </a>
        <a 
          href="/research" 
          class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors {$page.url.pathname.startsWith('/research') ? 'text-blue-600 dark:text-blue-400' : ''}"
        >
          Research
        </a>
        <a 
          href="/publications" 
          class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors {$page.url.pathname.startsWith('/publications') ? 'text-blue-600 dark:text-blue-400' : ''}"
        >
          Publications
        </a>
        <a 
          href="/blog" 
          class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors {$page.url.pathname.startsWith('/blog') ? 'text-blue-600 dark:text-blue-400' : ''}"
        >
          Blog
        </a>
        <a 
          href="/contact" 
          class="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors {$page.url.pathname === '/contact' ? 'text-blue-600 dark:text-blue-400' : ''}"
        >
          Contact
        </a>
      </nav>
      
      <!-- Theme toggle and mobile menu button -->
      <div class="flex items-center space-x-2">
        <ThemeToggle />
        
        <!-- Mobile menu button -->
        <button 
          on:click={toggleMenu}
          class="md:hidden p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none"
          aria-expanded={isMenuOpen}
        >
          <span class="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
  
  <!-- Mobile menu, show/hide based on menu state -->
  {#if isMenuOpen}
    <div class="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-2 shadow-lg">
      <div class="px-2 pt-2 pb-3 space-y-1">
        <a 
          href="/" 
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 {$page.url.pathname === '/' ? 'bg-gray-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400' : ''}"
        >
          Home
        </a>
        <a 
          href="/about" 
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 {$page.url.pathname === '/about' ? 'bg-gray-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400' : ''}"
        >
          About
        </a>
        <a 
          href="/research" 
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 {$page.url.pathname.startsWith('/research') ? 'bg-gray-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400' : ''}"
        >
          Research
        </a>
        <a 
          href="/publications" 
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 {$page.url.pathname.startsWith('/publications') ? 'bg-gray-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400' : ''}"
        >
          Publications
        </a>
        <a 
          href="/blog" 
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 {$page.url.pathname.startsWith('/blog') ? 'bg-gray-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400' : ''}"
        >
          Blog
        </a>
        <a 
          href="/contact" 
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 {$page.url.pathname === '/contact' ? 'bg-gray-50 dark:bg-gray-800 text-blue-600 dark:text-blue-400' : ''}"
        >
          Contact
        </a>
      </div>
    </div>
  {/if}
</header> 