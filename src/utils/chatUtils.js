/**
 * Chat-specific utility functions
 */

import { MESSAGE_TYPES, UI_CONFIG } from "../constants";
import { formatTime } from "./dateUtils";

/**
 * Formats a chat message for display
 * @param {Object} message - The message object
 * @param {string} message.text - Message text
 * @param {string} message.type - Message type (user/assistant)
 * @param {string|Date} message.timestamp - Message timestamp
 * @returns {Object} Formatted message object
 */
export const formatChatMessage = (message) => {
  return {
    text: message.text || "",
    type: message.type || MESSAGE_TYPES.ASSISTANT,
    timestamp: formatTime(message.timestamp),
    id:
      message.id ||
      `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
};

/**
 * Generates a new session ID
 * @returns {string} UUID string
 */
export const generateSessionId = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Builds conversation string from chat history
 * @param {Array} history - Array of messages
 * @returns {string} Formatted conversation string
 */
export const buildConversationString = (history) => {
  if (!Array.isArray(history) || history.length === 0) {
    return "";
  }

  return history
    .map(
      (msg) =>
        `${msg.type === MESSAGE_TYPES.USER ? "User" : "Assistant"}: ${msg.text}`
    )
    .join("\n\n");
};

/**
 * Parses chat response from different formats
 * @param {string|Object} response - Raw response from API
 * @returns {string} Parsed response text
 */
export const parseChatResponse = (response) => {
  if (typeof response === "string") {
    return response;
  }

  if (typeof response === "object") {
    // Handle different response structures
    if (response.message) return response.message;
    if (response.text) return response.text;
    if (response.content) return response.content;
    if (response.response) return response.response;
  }

  return String(response || "");
};

/**
 * Auto-scrolls chat container to bottom
 * @param {HTMLElement} container - Chat container element
 * @param {boolean} smooth - Whether to use smooth scrolling
 */
export const scrollToBottom = (container, smooth = true) => {
  if (!container) return;

  if (smooth){
    container.scrollTo({top:container.scrollHeight,behavior:"smooth"});

  }else{
    container.scrollTop=container.scrollHeight;
  }
};

/**
 * Checks if user is at bottom of chat
 * @param {HTMLElement} container - Chat container element
 * @param {number} threshold - Threshold in pixels (default: 100)
 * @returns {boolean} Whether user is at bottom
 */
export const isAtBottom = (container, threshold = 100) => {
  if (!container) return true;

  const { scrollTop, scrollHeight, clientHeight } = container;
  return scrollHeight - scrollTop - clientHeight < threshold;
};

/**
 * Sanitizes user input for security
 * @param {string} input - User input string
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return "";

  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/javascript:/gi, "")
    .slice(0, UI_CONFIG.MAX_MESSAGE_LENGTH);
};

/**
 * Formats file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

/**
 * Validates file before upload
 * @param {File} file - File object to validate
 * @returns {Object} Validation result with isValid and error properties
 */
export const validateFile = (file) => {
  if (!file) {
    return { isValid: false, error: "No file selected" };
  }

  if (file.size > UI_CONFIG.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds ${formatFileSize(
        UI_CONFIG.MAX_FILE_SIZE
      )} limit`,
    };
  }

  if (!UI_CONFIG.SUPPORTED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: "Unsupported file type. Please upload PDF, DOC, or TXT files.",
    };
  }

  return { isValid: true, error: null };
};

/**
 * Debounces function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Copies text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Success status
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const success = document.execCommand("copy");
      textArea.remove();
      return success;
    }
  } catch (error) {
    console.error("Failed to copy text:", error);
    return false;
  }
};
