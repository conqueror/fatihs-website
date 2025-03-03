import { browser } from '$app/environment';

/**
 * Tests if a specific type of storage is available in the current environment
 * More thorough than basic detection - catches iframe/CSP restrictions
 * @param {string} type - 'localStorage' or 'sessionStorage'
 * @returns {boolean} - Whether the storage is available
 */
function isStorageAvailable(type) {
    // Always return false in non-browser contexts
    if (!browser) return false;
    
    try {
        // First check if the property exists
        if (!(type in window)) return false;
        
        const storage = window[type];
        const testKey = `__storage_test__${Math.random()}`;
        
        // Try writing to and reading from storage
        storage.setItem(testKey, testKey);
        const testResult = storage.getItem(testKey);
        storage.removeItem(testKey);
        
        // Verify the read value matches what we wrote
        return testResult === testKey;
    } catch (e) {
        // Any exception means storage is not available/allowed
        return false;
    }
}

// In-memory fallback storage - always available
const memoryStorage = new Map();

// For session values
const sessionMemoryStorage = new Map();

/**
 * Safe localStorage wrapper with complete error handling
 * This implementation will dynamically check if storage is available each time
 * it's accessed, making it more resilient to changing CSP contexts
 */
const safeLocalStorage = {
    getItem(key) {
        if (!browser) return null;
        
        // Dynamically check availability on each access for maximum resilience
        if (isStorageAvailable('localStorage')) {
            try {
                return localStorage.getItem(key);
            } catch (e) {
                // Silent failure - fall through to fallback
            }
        }
        return memoryStorage.get(key) || null;
    },
    
    setItem(key, value) {
        if (!browser) return false;
        
        // Always update memory storage as backup
        memoryStorage.set(key, value);
        
        // Dynamically check availability
        if (isStorageAvailable('localStorage')) {
            try {
                localStorage.setItem(key, value);
                return true;
            } catch (e) {
                // Already stored in memory, so still return true
                return true;
            }
        }
        return true; // Memory storage worked
    },
    
    removeItem(key) {
        if (!browser) return false;
        
        // Always clear from memory
        memoryStorage.delete(key);
        
        // Dynamically check availability
        if (isStorageAvailable('localStorage')) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                // Silent failure
            }
        }
        return true; // Memory storage removal worked
    },
    
    clear() {
        if (!browser) return false;
        
        // Clear memory storage
        memoryStorage.clear();
        
        // Dynamically check availability
        if (isStorageAvailable('localStorage')) {
            try {
                localStorage.clear();
            } catch (e) {
                // Silent failure
            }
        }
        return true;
    }
};

/**
 * Safe sessionStorage wrapper that never throws errors
 * With dynamic availability checking and memory fallback
 */
const safeSessionStorage = {
    getItem(key) {
        if (!browser) return null;
        
        // Dynamically check availability
        if (isStorageAvailable('sessionStorage')) {
            try {
                return sessionStorage.getItem(key);
            } catch (e) {
                // Fall through to memory fallback
            }
        }
        
        // Memory fallback for session storage too
        return sessionMemoryStorage.get(key) || null;
    },
    
    setItem(key, value) {
        if (!browser) return false;
        
        // Always update memory fallback
        sessionMemoryStorage.set(key, value);
        
        // Dynamically check availability
        if (isStorageAvailable('sessionStorage')) {
            try {
                sessionStorage.setItem(key, value);
                return true;
            } catch (e) {
                return true; // Memory fallback worked
            }
        }
        return true; // Memory fallback worked
    },
    
    removeItem(key) {
        if (!browser) return false;
        
        // Always clear from memory
        sessionMemoryStorage.delete(key);
        
        // Dynamically check availability
        if (isStorageAvailable('sessionStorage')) {
            try {
                sessionStorage.removeItem(key);
                return true;
            } catch (e) {
                return true; // Memory removal worked
            }
        }
        return true; // Memory removal worked
    },
    
    clear() {
        if (!browser) return false;
        
        // Clear memory storage
        sessionMemoryStorage.clear();
        
        // Dynamically check availability
        if (isStorageAvailable('sessionStorage')) {
            try {
                sessionStorage.clear();
                return true;
            } catch (e) {
                return true; // Memory clear worked
            }
        }
        return true; // Memory clear worked
    }
};

/**
 * Primary storage utility with memory fallback - guaranteed to never throw errors
 */
export const storage = safeLocalStorage;

/**
 * Session storage utility - may not work in all contexts but will fall back to memory
 */
export const session = safeSessionStorage;

/**
 * Default export for convenience
 */
export default storage; 