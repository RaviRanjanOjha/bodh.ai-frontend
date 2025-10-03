/**
 * Date and time utility functions
 */

/**
 * Formats timestamp to local time string
 * @param {string|Date|number} timestamp - The timestamp to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted time string
 */
export const formatTime = (timestamp, options = {}) => {
  const defaultOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };

  const formatOptions = { ...defaultOptions, ...options };

  if (!timestamp) {
    return new Date().toLocaleTimeString("en-US", formatOptions).toUpperCase();
  }

  let date;

  // Handle different timestamp formats
  if (timestamp instanceof Date) {
    date = timestamp;
  } else if (typeof timestamp === "string") {
    // Ensure ISO format timestamps are treated as UTC
    if (
      timestamp.includes("T") &&
      !timestamp.includes("+") &&
      !timestamp.endsWith("Z")
    ) {
      date = new Date(
        timestamp + (timestamp.includes(".") ? "" : ".000") + "Z"
      );
    } else {
      date = new Date(timestamp);
    }
  } else if (typeof timestamp === "number") {
    date = new Date(timestamp);
  } else {
    date = new Date(timestamp);
  }

  // Verify the date is valid
  if (isNaN(date.getTime())) {
    console.warn("Invalid timestamp:", timestamp);
    return new Date().toLocaleTimeString("en-US", formatOptions).toUpperCase();
  }

  return date.toLocaleTimeString("en-US", formatOptions).toUpperCase();
};

/**
 * Formats date to local date string
 * @param {string|Date} dateString - The date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  const formatOptions = { ...defaultOptions, ...options };

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn("Invalid date string:", dateString);
      return "";
    }

    return date.toLocaleDateString("en-US", formatOptions);
  } catch (error) {
    console.warn("Date parsing error:", error);
    return "";
  }
};

/**
 * Gets the current timestamp in ISO format
 * @returns {string} Current timestamp
 */
export const getCurrentTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Checks if a timestamp is from today
 * @param {string|Date} timestamp - The timestamp to check
 * @returns {boolean} True if timestamp is from today
 */
export const isToday = (timestamp) => {
  const date = new Date(timestamp);
  const today = new Date();

  return date.toDateString() === today.toDateString();
};
