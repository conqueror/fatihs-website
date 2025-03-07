import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Theme store
export const theme = writable('light');

// Initialize theme synchronously to prevent flash of wrong theme
export function initTheme() {
  if (!browser) return;
  
  // Get saved theme or use system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  
  // Update store
  theme.set(initialTheme);
  
  // Apply theme
  applyTheme(initialTheme);
  
  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    // Only update if user hasn't set a manual preference
    if (!localStorage.getItem('theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      theme.set(newTheme);
      applyTheme(newTheme);
    }
  });
}

// Apply theme to document
export function applyTheme(theme) {
  if (!browser) return;
  
  // Toggle class on html element
  document.documentElement.classList.toggle('dark', theme === 'dark');
  
  // Update meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#1f2937' : '#ffffff');
  }
  
  // Dispatch custom event for any non-Svelte components
  document.documentElement.dispatchEvent(
    new CustomEvent('themechange', { detail: { theme } })
  );
}

// Toggle theme
export function toggleTheme() {
  theme.update(current => {
    const newTheme = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    return newTheme;
  });
}

// Subscribe to theme changes
if (browser) {
  theme.subscribe(newTheme => {
    applyTheme(newTheme);
  });
} 