<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { consentStore } from '$lib/stores';
  
  let visible = false;
  let mounted = false;
  
  // Check for existing consent
  onMount(() => {
    if (!browser) return;
    
    const savedConsent = localStorage.getItem('cookie-consent');
    if (savedConsent) {
      try {
        consentStore.set(JSON.parse(savedConsent));
      } catch (e) {
        console.error('Error parsing saved consent:', e);
        visible = true;
      }
    } else {
      visible = true;
    }
    
    // Mark component as mounted
    mounted = true;
    
    // Listen for the custom event from the privacy policy page
    window.addEventListener('open-cookie-preferences', () => {
      visible = true;
    });
    
    // Clean up event listener on component destroy
    return () => {
      window.removeEventListener('open-cookie-preferences', () => {
        visible = true;
      });
    };
  });
  
  function acceptAll() {
    consentStore.set({
      analytics: true,
      preferences: true,
      marketing: false
    });
    saveConsent();
  }
  
  function acceptNecessaryOnly() {
    consentStore.set({
      analytics: false,
      preferences: false,
      marketing: false
    });
    saveConsent();
  }
  
  function managePreferences() {
    // This would open a more detailed preferences dialog
    // For now, we just toggle visibility
    visible = !visible;
  }
  
  function saveConsent() {
    if (!browser) return;
    
    let currentConsent;
    const unsubscribe = consentStore.subscribe(value => {
      currentConsent = value;
    });
    unsubscribe();
    
    localStorage.setItem('cookie-consent', JSON.stringify(currentConsent));
    visible = false;
  }
</script>

<!-- Only render once mounted to avoid SSR hydration mismatch -->
{#if mounted}
  <div class="cookie-banner-container" aria-hidden={!visible}>
    <div class="cookie-banner dark:bg-gray-800 dark:text-white" class:visible>
      <div class="cookie-content">
        <h3 class="dark:text-white">Privacy Choices</h3>
        <p class="dark:text-gray-200">
          This website uses cookies to enhance your browsing experience, serve personalized content, 
          and analyze our traffic. You can choose whether to accept analytics cookies that help us 
          understand how you interact with our website.
        </p>
        <div class="cookie-buttons">
          <button on:click={acceptNecessaryOnly} class="secondary dark:bg-gray-700 dark:text-gray-100">
            Necessary Only
          </button>
          <button on:click={acceptAll} class="primary">
            Accept All
          </button>
        </div>
        <div class="cookie-footer">
          <a href="/privacy" class="text-sm text-gray-600 dark:text-gray-300 hover:underline">
            View our full Privacy Policy
          </a>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  .cookie-banner-container {
    position: fixed;
    bottom: 1rem;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    z-index: 9999;
    pointer-events: none;
  }

  .cookie-banner-container[aria-hidden="true"] {
    visibility: hidden;
  }

  .cookie-banner-container[aria-hidden="false"] {
    visibility: visible;
  }
  
  .cookie-banner {
    background-color: #fff;  /* Light mode background */
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 1.25rem;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: none;
    max-width: 500px;
    width: calc(100% - 2rem);
    margin: 0 1rem;
  }
  
  .cookie-banner.visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
  
  /* Add dark mode style for the cookie banner */
  :global(html.dark) .cookie-banner {
    background-color: #1f2937; /* Dark gray background for dark mode (matches bg-gray-800) */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
  
  .cookie-content h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
  }
  
  .cookie-content p {
    margin-bottom: 1rem;
    line-height: 1.5;
    font-size: 0.95rem;
  }
  
  .cookie-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1rem;
  }
  
  .cookie-footer {
    margin-top: 1rem;
    text-align: center;
    padding-top: 0.5rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    border: 1px solid #ddd;
    background: none;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  button:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  
  button.secondary {
    background-color: #f8f8f8;
    color: #333;
  }
  
  button.secondary:hover {
    background-color: #eaeaea;
  }
  
  button.primary {
    /* Darker blue for better contrast - meets WCAG AA 4.5:1 ratio */
    background-color: #1a4bbd;
    color: white;
    border-color: #1a4bbd;
  }
  
  button.primary:hover {
    background-color: #1e40af;
    border-color: #1e40af;
  }
  
  /* Dark mode button overrides */
  :global(html.dark) button.primary {
    background-color: #1e40af;
    border-color: #1e40af;
  }
  
  :global(html.dark) button.primary:hover {
    background-color: #1e3a8a;
    border-color: #1e3a8a;
  }
</style> 