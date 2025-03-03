import { browser } from '$app/environment';

// Feature detection function for storage availability
function isStorageAvailable(type) {
  if (!browser) return false;
  
  try {
    const storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return false;
  }
}

// Create an in-memory fallback storage
const memoryStorage = new Map();

// Check if localStorage and sessionStorage are available
const hasLocalStorage = isStorageAvailable('localStorage');
const hasSessionStorage = isStorageAvailable('sessionStorage');

// Safe localStorage wrapper
const safeLocalStorage = {
  getItem(key) {
    try {
      if (!browser || !hasLocalStorage) return null;
      return localStorage.getItem(key);
    } catch (e) {
      console.warn('localStorage access error:', e);
      return null;
    }
  },
  
  setItem(key, value) {
    try {
      if (!browser || !hasLocalStorage) return false;
      localStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn('localStorage write error:', e);
      return false;
    }
  },
  
  removeItem(key) {
    try {
      if (!browser || !hasLocalStorage) return false;
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn('localStorage remove error:', e);
      return false;
    }
  }
};

// Safe sessionStorage wrapper
const safeSessionStorage = {
  getItem(key) {
    try {
      if (!browser || !hasSessionStorage) return null;
      return sessionStorage.getItem(key);
    } catch (e) {
      console.warn('sessionStorage access error:', e);
      return null;
    }
  },
  
  setItem(key, value) {
    try {
      if (!browser || !hasSessionStorage) return false;
      sessionStorage.setItem(key, value);
      return true;
    } catch (e) {
      console.warn('sessionStorage write error:', e);
      return false;
    }
  },
  
  removeItem(key) {
    try {
      if (!browser || !hasSessionStorage) return false;
      sessionStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn('sessionStorage remove error:', e);
      return false;
    }
  }
};

// Memory storage fallback
const fallbackStorage = {
  getItem(key) {
    return memoryStorage.get(key) || null;
  },
  
  setItem(key, value) {
    memoryStorage.set(key, value);
    return true;
  },
  
  removeItem(key) {
    memoryStorage.delete(key);
    return true;
  }
};

// Unified storage interface with automatic fallback
export const storage = {
  getItem(key) {
    // Try localStorage first, then fallback
    const value = safeLocalStorage.getItem(key);
    return value !== null ? value : fallbackStorage.getItem(key);
  },
  
  setItem(key, value) {
    // Always save to fallback in case localStorage fails
    fallbackStorage.setItem(key, value);
    // Attempt to save to localStorage too
    return safeLocalStorage.setItem(key, value);
  },
  
  removeItem(key) {
    // Clean up both storages
    fallbackStorage.removeItem(key);
    return safeLocalStorage.removeItem(key);
  }
};

// Also export session storage for when session-specific storage is needed
export const sessionStorage = {
  getItem(key) {
    const value = safeSessionStorage.getItem(key);
    // Don't fall back to memory for session storage
    return value;
  },
  
  setItem(key, value) {
    return safeSessionStorage.setItem(key, value);
  },
  
  removeItem(key) {
    return safeSessionStorage.removeItem(key);
  }
}; 