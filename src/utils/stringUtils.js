/**
 * String processing and formatting utilities
 */

/**
 * Formats chat response by applying text styling
 * @param {string} response - Raw response text
 * @returns {string} Formatted HTML string
 */
export const formatChatResponse = (response) => {
  if (!response) return "";

  return response
    .split("**")
    .map((chunk, i) => (i % 2 === 1 ? `<b>${chunk}</b>` : chunk))
    .join("")
    .split("*")
    .join("<br/>");
};

/**
 * Parses conversation data into structured message format
 * @param {string} resultData - Raw conversation data
 * @returns {Array} Array of message objects
 */
export const parseConversationData = (resultData) => {
  if (!resultData) return [];

  const sections = resultData
    .split("<br/><br/>")
    .filter((section) => section.trim());

  const messages = [];

  sections.forEach((section, index) => {
    const cleanSection = section.trim();

    if (cleanSection.includes("<strong>user:</strong>")) {
      const userMessage = cleanSection
        .replace("<strong>user:</strong>", "")
        .trim();

      // Try to extract timestamp from the message if available
      const timestampMatch = userMessage.match(
        /\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*?)\]/
      );
      const timestamp = timestampMatch ? timestampMatch[1] : null;
      const content = timestamp
        ? userMessage.replace(/\[.*?\]/, "").trim()
        : userMessage;

      messages.push({
        type: "user",
        content: content,
        timestamp: timestamp,
        index: `user-${index}`,
      });
    } else if (cleanSection.includes("<strong>assistant:</strong>")) {
      const assistantMessage = cleanSection
        .replace("<strong>assistant:</strong>", "")
        .trim();

      // Try to extract timestamp from the message if available
      const timestampMatch = assistantMessage.match(
        /\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*?)\]/
      );
      const timestamp = timestampMatch ? timestampMatch[1] : null;
      const content = timestamp
        ? assistantMessage.replace(/\[.*?\]/, "").trim()
        : assistantMessage;

      messages.push({
        type: "assistant",
        content: content,
        timestamp: timestamp,
        index: `assistant-${index}`,
      });
    } else if (cleanSection && !cleanSection.includes("<strong>")) {
      // Handle content that might not have proper tags
      messages.push({
        type: "assistant",
        content: cleanSection,
        timestamp: null,
        index: `content-${index}`,
      });
    }
  });

  return messages;
};

/**
 * Builds conversation display string from messages
 * @param {Array} messages - Array of message objects
 * @param {string} conversationTimestamp - Base timestamp for the conversation
 * @returns {string} Formatted conversation string
 */
export const buildConversationString = (messages, conversationTimestamp) => {
  return messages
    .map((msg) => {
      const timestamp = conversationTimestamp;
      return `<strong>${msg.role}:</strong> ${msg.content} [${timestamp}]`;
    })
    .join("<br/><br/>");
};

/**
 * Truncates text to specified length with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

/**
 * Sanitizes HTML content
 * @param {string} html - HTML content to sanitize
 * @returns {string} Sanitized HTML
 */
export const sanitizeHtml = (html) => {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  if (!html) return "";

  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
};
