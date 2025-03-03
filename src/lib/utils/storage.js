import { browser } from '$app/environment';

/**
 * Safe wrapper for localStorage that handles access errors
 */
export const safeLocalStorage = {
  getItem(key) {
    if (!browser) return null;
    
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
      return null;
    }
  },
  
  setItem(key, value) {
    if (!browser) return;
    
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
    }
  },
  
  removeItem(key) {
    if (!browser) return;
    
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Error removing from localStorage:', error);
    }
  }
};

/**
 * Safe wrapper for sessionStorage that handles access errors
 */
export const safeSessionStorage = {
  getItem(key) {
    if (!browser) return null;
    
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      console.warn('Error accessing sessionStorage:', error);
      return null;
    }
  },
  
  setItem(key, value) {
    if (!browser) return;
    
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      console.warn('Error writing to sessionStorage:', error);
    }
  },
  
  removeItem(key) {
    if (!browser) return;
    
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn('Error removing from sessionStorage:', error);
    }
  }
};

/**
 * In-memory fallback storage for environments where browser storage is unavailable
 */
const memoryStorage = new Map();

export const fallbackStorage = {
  getItem(key) {
    return memoryStorage.get(key) || null;
  },
  
  setItem(key, value) {
    memoryStorage.set(key, value);
  },
  
  removeItem(key) {
    memoryStorage.delete(key);
  }
};

/**
 * Storage utility that automatically falls back to in-memory storage if browser storage is unavailable
 */
export const storage = {
  getItem(key) {
    const value = safeLocalStorage.getItem(key);
    if (value === null) {
      return fallbackStorage.getItem(key);
    }
    return value;
  },
  
  setItem(key, value) {
    safeLocalStorage.setItem(key, value);
    fallbackStorage.setItem(key, value);
  },
  
  removeItem(key) {
    safeLocalStorage.removeItem(key);
    fallbackStorage.removeItem(key);
  }
}; 