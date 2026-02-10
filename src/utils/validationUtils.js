/**
 * Validation utility functions
 */

/**
 * Validates if a session ID is valid
 * @param {string} sessionId - Session ID to validate
 * @returns {boolean} True if valid
 */
export const isValidSessionId = (sessionId) => {
  return (
    sessionId && typeof sessionId === 'string' && sessionId.trim().length > 0
  );
};

/**
 * Validates if files are valid for upload
 * @param {FileList|Array} files - Files to validate
 * @returns {Object} Validation result with isValid and error message
 */
export const validateUploadFiles = (files) => {
  if (!files || files.length === 0) {
    return {
      isValid: false,
      error: 'No files selected',
    };
  }

  const filesArray = Array.isArray(files) ? files : Array.from(files);
  const maxFileSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = [
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  for (let file of filesArray) {
    if (file.size > maxFileSize) {
      return {
        isValid: false,
        error: `File ${file.name} is too large. Maximum size is 10MB.`,
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `File type ${file.type} is not supported.`,
      };
    }
  }

  return {
    isValid: true,
    error: null,
  };
};

/**
 * Validates conversation messages format
 * @param {Array} messages - Messages to validate
 * @returns {boolean} True if valid
 */
export const validateConversationMessages = (messages) => {
  if (!Array.isArray(messages)) return false;
  if (messages.length === 0) return false;

  // Check if messages are in valid format
  return messages.every(
    (msg) =>
      msg &&
      typeof msg === 'object' &&
      msg.role &&
      msg.content &&
      ['user', 'assistant'].includes(msg.role)
  );
};

/**
 * Validates if a string is a valid prompt
 * @param {string} prompt - Prompt to validate
 * @returns {Object} Validation result
 */
export const validatePrompt = (prompt) => {
  if (!prompt || typeof prompt !== 'string') {
    return {
      isValid: false,
      error: 'Prompt is required',
    };
  }

  const trimmedPrompt = prompt.trim();

  if (trimmedPrompt.length === 0) {
    return {
      isValid: false,
      error: 'Prompt cannot be empty',
    };
  }

  if (trimmedPrompt.length > 5000) {
    return {
      isValid: false,
      error: 'Prompt is too long. Maximum 5000 characters allowed.',
    };
  }

  return {
    isValid: true,
    error: null,
  };
};
