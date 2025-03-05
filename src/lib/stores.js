import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Helper function to determine initial theme
function getInitialTheme() {
  if (!browser) return 'dark'; // Default to dark for SSR
  
  // Check for saved theme in localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) return savedTheme;
  
  // Check system preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

// Theme store to manage light/dark mode
export const theme = writable(getInitialTheme());

// Store for managing the user's cookie consent preferences
export const consentStore = writable({
  analytics: false,
  preferences: false,
  marketing: false
});

// Store for managing authentication state, if needed
export const authStore = writable({
  isAuthenticated: false,
  user: null
});

// Store for managing site-wide notifications
export const notificationStore = writable([]);

// Function to add a notification
export function addNotification(message, type = 'info', timeout = 5000) {
  const id = Date.now();
  notificationStore.update(notifications => [
    ...notifications,
    { id, message, type, timeout }
  ]);
  
  // Auto-remove after timeout
  if (timeout > 0) {
    setTimeout(() => {
      removeNotification(id);
    }, timeout);
  }
  
  return id;
}

// Function to remove a notification
export function removeNotification(id) {
  notificationStore.update(notifications => 
    notifications.filter(notification => notification.id !== id)
  );
} 