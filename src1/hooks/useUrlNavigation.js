import { useState, useEffect, useCallback } from "react";
import {
  updateUrlWithSession,
  getSessionIdFromUrl,
  setQueryParams,
  getQueryParams,
} from "../utils/urlUtils";

export const useUrlNavigation = () => {
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [queryParams, setQueryParamsState] = useState({});

  // Initialize from URL on mount
  useEffect(() => {
    const sessionId = getSessionIdFromUrl();
    const params = getQueryParams();

    setCurrentSessionId(sessionId);
    setQueryParamsState(params);
  }, []);

  // Navigate to a specific session
  const navigateToSession = useCallback((sessionId, replace = true) => {
    setCurrentSessionId(sessionId);
    updateUrlWithSession(sessionId, replace);

    // Update query params state
    const newParams = getQueryParams();
    setQueryParamsState(newParams);
  }, []);

  // Update query parameters
  const updateQueryParams = useCallback((params, replace = true) => {
    setQueryParams(params, replace);

    // Update local state
    const newParams = getQueryParams();
    setQueryParamsState(newParams);
  }, []);

  // Clear session from URL
  const clearSession = useCallback((replace = true) => {
    setCurrentSessionId(null);
    updateUrlWithSession(null, replace);

    const newParams = getQueryParams();
    setQueryParamsState(newParams);
  }, []);

  // Listen for browser navigation (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const sessionId = getSessionIdFromUrl();
      const params = getQueryParams();

      setCurrentSessionId(sessionId);
      setQueryParamsState(params);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return {
    currentSessionId,
    queryParams,
    navigateToSession,
    updateQueryParams,
    clearSession,
    getSessionIdFromUrl,
    getQueryParams,
  };
};
