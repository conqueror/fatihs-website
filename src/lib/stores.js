import { writable } from 'svelte/store';

// Theme store to manage light/dark mode
export const theme = writable('light');

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