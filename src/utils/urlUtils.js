/**
 * URL and navigation utility functions
 */

/**
 * Updates URL with session ID
 * @param {string} sessionId - Current session ID
 * @param {boolean} replace - Whether to replace or push state
 */
export const updateUrlWithSession = (sessionId, replace = true) => {
  // const urlParams = new URLSearchParams(window.location.search);
  // const appVersion = urlParams.get('v');
  if (!sessionId) {
    // Clean URL if no session
    const cleanUrl = `${window.location.pathname}`;
    if (replace) {
      window.history.replaceState({}, "", cleanUrl);
    } else {
      window.history.pushState({}, "", cleanUrl);
    }
    return;
  }

  const url = new URL(window.location);
  url.searchParams.set("session", sessionId);
  // url.searchParams.set("v", appVersion);

  const newUrl = url.toString();
  const state = { sessionId };

  if (replace) {
    window.history.replaceState(state, "", newUrl);
  } else {
    window.history.pushState(state, "", newUrl);
  }
};

/**
 * Gets session ID from URL
 * @returns {string|null} Session ID from URL parameters
 */
export const getSessionIdFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("session");
};

/**
 * Cleans URL parameters
 * @param {Array<string>} paramsToRemove - Array of parameter names to remove
 */
export const cleanUrlParams = (paramsToRemove = []) => {
  const url = new URL(window.location);

  paramsToRemove.forEach((param) => {
    url.searchParams.delete(param);
  });

  window.history.replaceState({}, "", url.toString());
};

/**
 * Gets query parameters as object
 * @returns {Object} Query parameters object
 */
export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};

  for (const [key, value] of params) {
    result[key] = value;
  }

  return result;
};

/**
 * Sets multiple query parameters
 * @param {Object} params - Object with key-value pairs to set
 * @param {boolean} replace - Whether to replace or push state
 */
export const setQueryParams = (params, replace = true) => {
  const url = new URL(window.location);

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });

  const newUrl = url.toString();

  if (replace) {
    window.history.replaceState({}, "", newUrl);
  } else {
    window.history.pushState({}, "", newUrl);
  }
};

/**
 * Navigates to a specific conversation
 * @param {string} conversationId - Conversation ID to navigate to
 */
export const navigateToConversation = (conversationId) => {
  setQueryParams({ session: conversationId });
};

/**
 * Checks if current page matches a route pattern
 * @param {string} pattern - Route pattern to match
 * @returns {boolean} Whether current route matches pattern
 */
export const matchesRoute = (pattern) => {
  const currentPath = window.location.pathname;

  // Simple pattern matching - can be extended for more complex routing
  if (pattern === currentPath) return true;

  // Check for wildcard patterns
  if (pattern.endsWith("*")) {
    const basePath = pattern.slice(0, -1);
    return currentPath.startsWith(basePath);
  }

  return false;
};

/**
 * Gets base URL for the application
 * @returns {string} Base URL
 */
export const getBaseUrl = () => {
  return `${window.location.protocol}//${window.location.host}`;
};

/**
 * Builds full URL from relative path
 * @param {string} relativePath - Relative path
 * @returns {string} Full URL
 */
export const buildFullUrl = (relativePath) => {
  const baseUrl = getBaseUrl();
  const cleanPath = relativePath.startsWith("/")
    ? relativePath
    : `/${relativePath}`;
  return `${baseUrl}${cleanPath}`;
};
