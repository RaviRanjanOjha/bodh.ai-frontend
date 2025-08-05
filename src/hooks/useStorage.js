/**
 * Local Storage Hook
 */
import { useState, useEffect, useCallback } from "react";
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  isStorageAvailable,
} from "../utils/storageUtils";

export const useLocalStorage = (key, defaultValue = null) => {
  const [value, setValue] = useState(() => {
    if (!isStorageAvailable()) {
      console.warn("localStorage is not available");
      return defaultValue;
    }
    return getStorageItem(key, defaultValue);
  });

  const [error, setError] = useState(null);

  // Set value and update storage
  const setStoredValue = useCallback(
    (newValue) => {
      try {
        setValue(newValue);

        if (newValue === null || newValue === undefined) {
          removeStorageItem(key);
        } else {
          setStorageItem(key, newValue);
        }

        setError(null);
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
        setError(error.message);
      }
    },
    [key]
  );

  // Remove value from storage
  const removeValue = useCallback(() => {
    try {
      setValue(defaultValue);
      removeStorageItem(key);
      setError(null);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
      setError(error.message);
    }
  }, [key, defaultValue]);

  // Listen for storage changes in other tabs
  useEffect(() => {
    if (!isStorageAvailable()) return;

    const handleStorageChange = (e) => {
      if (e.key === key) {
        if (e.newValue === null) {
          setValue(defaultValue);
        } else {
          try {
            setValue(JSON.parse(e.newValue));
          } catch {
            setValue(e.newValue);
          }
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, defaultValue]);

  return [value, setStoredValue, removeValue, error];
};

/**
 * Session Storage Hook (similar to localStorage but for session)
 */
export const useSessionStorage = (key, defaultValue = null) => {
  const [value, setValue] = useState(() => {
    try {
      const item = sessionStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch {
      return defaultValue;
    }
  });

  const setStoredValue = useCallback(
    (newValue) => {
      try {
        setValue(newValue);
        if (newValue === null || newValue === undefined) {
          sessionStorage.removeItem(key);
        } else {
          sessionStorage.setItem(key, JSON.stringify(newValue));
        }
      } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key]
  );

  const removeValue = useCallback(() => {
    setValue(defaultValue);
    sessionStorage.removeItem(key);
  }, [key, defaultValue]);

  return [value, setStoredValue, removeValue];
};
