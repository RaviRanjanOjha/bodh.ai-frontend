
import React, { createContext, useCallback } from "react";
import PropTypes from "prop-types";
import { useChat } from "../hooks/useChat";
import { CHAT_CONFIG } from "../constants";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const {
    // Chat state
    input,
    setInput,
    recentPrompt,
    prevPrompts,
    showResults,
    loading,
    resultData,
    currentSessionId,
    abortStream,
    isStreaming,
    lastPrompt,

    // Chat actions
    onSent,
    stopResponse,
    resetChat,
    newChat,
    generateNewSessionId,
  } = useChat();

  // Enhanced chat actions with error handling
  const sendMessage = useCallback(
    async (message, options = {}) => {
      try {
        if (!message?.trim()) {
          throw new Error("Message cannot be empty");
        }

        const result = await onSent(message, options);
        return result;
      } catch (error) {
        console.error("Failed to send message:", error);
        throw error;
      }
    },
    [onSent]
  );

  const startNewChat = useCallback(() => {
    try {
      const sessionId = newChat();
      console.log("New chat started with session:", sessionId);
      return sessionId;
    } catch (error) {
      console.error("Failed to start new chat:", error);
      throw error;
    }
  }, [newChat]);

  const stopCurrentResponse = useCallback(async () => {
    try {
      await stopResponse();
      console.log("Response stopped successfully");
    } catch (error) {
      console.error("Failed to stop response:", error);
      throw error;
    }
  }, [stopResponse]);

  const value = {
    // State
    input,
    setInput,
    recentPrompt,
    prevPrompts,
    showResults,
    loading,
    resultData,
    currentSessionId,
    abortStream,
    isStreaming,
    lastPrompt,

    // Actions
    sendMessage,
    startNewChat,
    stopCurrentResponse,
    resetChat,
    generateNewSessionId,

    // Raw actions (for backward compatibility)
    onSent,
    stopResponse,
    newChat,

    // Configuration
    config: CHAT_CONFIG,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

ChatProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { ChatContext };
