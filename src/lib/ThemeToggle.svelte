<script>
  import { theme, toggleTheme } from '$lib/services/theme';
  
  // Animated properties
  let animationClass = '';
  
  // Handle toggle with animation
  function handleToggle() {
    // Add animation class
    animationClass = $theme === 'light' ? 'to-dark' : 'to-light';
    
    // Toggle theme
    toggleTheme();
    
    // Remove animation class after transition
    setTimeout(() => {
      animationClass = '';
    }, 500);
  }
</script>

<button 
  aria-label="Toggle dark mode" 
  class="theme-toggle {animationClass}"
  on:click={handleToggle}
  on:keydown={e => e.key === 'Enter' && handleToggle()}
  tabindex="0"
>
  <span class="sr-only">Toggle dark mode</span>
  
  <!-- Sun icon for light mode -->
  <svg xmlns="http://www.w3.org/2000/svg" class="sun-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="5"></circle>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
  </svg>
  
  <!-- Moon icon for dark mode -->
  <svg xmlns="http://www.w3.org/2000/svg" class="moon-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
</button>

<style>
  .theme-toggle {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    color: var(--text-color);
    border: none;
    background: transparent;
    cursor: pointer;
    border-radius: 9999px;
    transition: background-color 0.2s ease;
  }
  
  .theme-toggle:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  :global(.dark) .theme-toggle:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
  
  svg {
    width: 1.5rem;
    height: 1.5rem;
    transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  }
  
  .sun-icon {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
  
  .moon-icon {
    position: absolute;
    opacity: 0;
    transform: scale(0) rotate(90deg);
  }
  
  :global(.dark) .sun-icon {
    opacity: 0;
    transform: scale(0) rotate(-90deg);
  }
  
  :global(.dark) .moon-icon {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
  
  /* Animation classes */
  .to-dark .sun-icon {
    animation: rotate-out 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  }
  
  .to-dark .moon-icon {
    animation: rotate-in 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  }
  
  .to-light .sun-icon {
    animation: rotate-in 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  }
  
  .to-light .moon-icon {
    animation: rotate-out 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
  }
  
  @keyframes rotate-in {
    from {
      opacity: 0;
      transform: scale(0) rotate(90deg);
    }
    to {
      opacity: 1;
      transform: scale(1) rotate(0);
    }
  }
  
  @keyframes rotate-out {
    from {
      opacity: 1;
      transform: scale(1) rotate(0);
    }
    to {
      opacity: 0;
      transform: scale(0) rotate(-90deg);
    }
  }
</style> 