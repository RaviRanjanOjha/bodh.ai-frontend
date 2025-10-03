/**
 * Local storage utility functions
 */

/**
 * Safely gets item from localStorage
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist
 * @returns {*} Stored value or default value
 */
export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;

    // Try to parse JSON, fall back to string
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (error) {
    console.warn(`Failed to get storage item '${key}':`, error);
    return defaultValue;
  }
};

/**
 * Safely sets item in localStorage
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export const setStorageItem = (key, value) => {
  try {
    const serializedValue =
      typeof value === "string" ? value : JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.warn(`Failed to set storage item '${key}':`, error);
    return false;
  }
};

/**
 * Safely removes item from localStorage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`Failed to remove storage item '${key}':`, error);
    return false;
  }
};

/**
 * Clears all localStorage items with optional prefix filter
 * @param {string} prefix - Optional prefix to filter keys
 * @returns {boolean} Success status
 */
export const clearStorage = (prefix = null) => {
  try {
    if (prefix) {
      const keys = Object.keys(localStorage);
      keys.forEach((key) => {
        if (key.startsWith(prefix)) {
          localStorage.removeItem(key);
        }
      });
    } else {
      localStorage.clear();
    }
    return true;
  } catch (error) {
    console.warn("Failed to clear storage:", error);
    return false;
  }
};

/**
 * Gets all localStorage items with optional prefix filter
 * @param {string} prefix - Optional prefix to filter keys
 * @returns {Object} Object with key-value pairs
 */
export const getAllStorageItems = (prefix = null) => {
  try {
    const items = {};
    const keys = Object.keys(localStorage);

    keys.forEach((key) => {
      if (!prefix || key.startsWith(prefix)) {
        items[key] = getStorageItem(key);
      }
    });

    return items;
  } catch (error) {
    console.warn("Failed to get all storage items:", error);
    return {};
  }
};

/**
 * Checks if localStorage is available
 * @returns {boolean} Whether localStorage is available
 */
export const isStorageAvailable = () => {
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

/**
 * Gets storage usage information
 * @returns {Object} Storage usage stats
 */
export const getStorageUsage = () => {
  if (!isStorageAvailable()) {
    return { used: 0, total: 0, available: 0, percentage: 0 };
  }

  try {
    // Estimate storage usage
    let used = 0;
    const keys = Object.keys(localStorage);

    keys.forEach((key) => {
      used += localStorage.getItem(key).length;
    });

    // Most browsers have ~5-10MB limit for localStorage
    const estimatedTotal = 5 * 1024 * 1024; // 5MB in bytes
    const available = estimatedTotal - used;
    const percentage = (used / estimatedTotal) * 100;

    return {
      used,
      total: estimatedTotal,
      available: Math.max(0, available),
      percentage: Math.min(100, percentage),
    };
  } catch (error) {
    console.warn("Failed to calculate storage usage:", error);
    return { used: 0, total: 0, available: 0, percentage: 0 };
  }
};

// Session-specific storage utilities
export const SESSION_KEYS = {
  CURRENT_SESSION: "current_session_id",
  USER_PREFERENCES: "user_preferences",
  CHAT_DRAFT: "chat_input_draft",
  THEME: "app_theme",
  SIDEBAR_STATE: "sidebar_collapsed",
};

/**
 * Session storage utilities
 */
export const sessionStorage = {
  get: (key, defaultValue = null) => getStorageItem(key, defaultValue),
  set: (key, value) => setStorageItem(key, value),
  remove: (key) => removeStorageItem(key),
  clear: (prefix) => clearStorage(prefix),
};
