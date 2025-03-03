import { browser } from '$app/environment';

/**
 * Tests if a specific type of storage is available in the current environment
 * @param {string} type - 'localStorage' or 'sessionStorage'
 * @returns {boolean} - Whether the storage is available
 */
function isStorageAvailable(type) {
    if (!browser) return false;
    
    try {
        const storage = window[type];
        const testKey = '__storage_test__';
        storage.setItem(testKey, testKey);
        storage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
}

// Check storage availability only in browser context
const localStorageAvailable = isStorageAvailable('localStorage');
const sessionStorageAvailable = isStorageAvailable('sessionStorage');

// In-memory fallback storage
const fallbackStorage = new Map();

/**
 * Safe localStorage wrapper that handles errors and fallback
 */
const safeLocalStorage = {
    getItem(key) {
        if (localStorageAvailable) {
            try {
                return localStorage.getItem(key);
            } catch (e) {
                console.warn('Error accessing localStorage:', e);
            }
        }
        return fallbackStorage.get(key) || null;
    },
    
    setItem(key, value) {
        if (localStorageAvailable) {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch (e) {
                console.warn('Error writing to localStorage:', e);
            }
        }
        fallbackStorage.set(key, value);
        return true;
    },
    
    removeItem(key) {
        if (localStorageAvailable) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.warn('Error removing from localStorage:', e);
            }
        }
        fallbackStorage.delete(key);
        return true;
    }
};

/**
 * Safe sessionStorage wrapper that handles errors and fallback
 */
const safeSessionStorage = {
    getItem(key) {
        if (sessionStorageAvailable) {
            try {
                return sessionStorage.getItem(key);
            } catch (e) {
                console.warn('Error accessing sessionStorage:', e);
            }
        }
        return null;
    },
    
    setItem(key, value) {
        if (sessionStorageAvailable) {
            try {
                sessionStorage.setItem(key, value);
                return true;
            } catch (e) {
                console.warn('Error writing to sessionStorage:', e);
            }
        }
        return false;
    },
    
    removeItem(key) {
        if (sessionStorageAvailable) {
            try {
                sessionStorage.removeItem(key);
                return true;
            } catch (e) {
                console.warn('Error removing from sessionStorage:', e);
            }
        }
        return false;
    }
};

/**
 * Primary storage utility that handles both localStorage and sessionStorage
 * with appropriate fallbacks and error handling
 */
export const storage = browser ? safeLocalStorage : {
    getItem: () => null,
    setItem: () => false,
    removeItem: () => false
};

/**
 * Session storage utility - separate interface for session-specific storage
 */
export const sessionStorage = browser ? safeSessionStorage : {
    getItem: () => null,
    setItem: () => false,
    removeItem: () => false
};

/**
 * Default export for convenience
 */
export default storage; 