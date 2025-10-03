/**
 * History Context - Handles conversation history and search
 */
import React, { createContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import {
  getConversationHistory,
  getConversationDetails,
  search_convo,
  deleteConversation,
} from "../services/api";
import { CHAT_CONFIG } from "../constants";

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
  // History state
  const [history, setHistory] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Fetch conversation history
  const fetchHistory = useCallback(async () => {
    setHistoryLoading(true);
    setHistoryError(null);

    try {
      console.log("📚 Fetching conversation history...");
      const response = await getConversationHistory();

      if (response && Array.isArray(response)) {
        console.log(`📚 Fetched ${response.length} conversations`);
        setHistory(response);
      } else {
        console.warn("Invalid history response:", response);
        setHistory([]);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
      setHistoryError(error.message);
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Fetch specific conversation details
  const fetchConversationDetails = useCallback(async (conversationId) => {
    if (!conversationId) {
      console.warn("No conversation ID provided");
      return null;
    }

    setHistoryLoading(true);
    setHistoryError(null);

    try {
      console.log("📖 Fetching conversation details for:", conversationId);
      const details = await getConversationDetails(conversationId);

      if (details) {
        console.log("📖 Conversation details fetched:", details);
        setSelectedConversation(details);
        return details;
      } else {
        throw new Error("No conversation details found");
      }
    } catch (error) {
      console.error("Failed to fetch conversation details:", error);
      setHistoryError(error.message);
      setSelectedConversation(null);
      return null;
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  // Search conversations
  const searchConversations = useCallback(
    async (query, limit = CHAT_CONFIG.SEARCH_LIMIT) => {
      if (!query?.trim()) {
        setSearchResults([]);
        setSearchQuery("");
        return [];
      }

      setSearchLoading(true);
      setSearchError(null);
      setSearchQuery(query);

      try {
        console.log("🔍 Searching conversations for:", query);
        const results = await search_convo(query, limit);

        if (Array.isArray(results)) {
          console.log(`🔍 Found ${results.length} search results`);
          setSearchResults(results);
          return results;
        } else {
          console.warn("Invalid search results:", results);
          setSearchResults([]);
          return [];
        }
      } catch (error) {
        console.error("Search failed:", error);
        setSearchError(error.message);
        setSearchResults([]);
        throw error;
      } finally {
        setSearchLoading(false);
      }
    },
    []
  );

  // Clear search
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchError(null);
  }, []);

  // Select conversation
  const selectConversation = useCallback((conversation) => {
    setSelectedConversation(conversation);
  }, []);

  // Clear selected conversation
  const clearSelectedConversation = useCallback(() => {
    setSelectedConversation(null);
  }, []);

  // Delete conversation
  const deleteConversationById = useCallback(
    async (sessionId) => {
      if (!sessionId) {
        console.warn("No session ID provided for deletion");
        return false;
      }

      setHistoryLoading(true);
      setHistoryError(null);

      try {
        console.log("🗑️ Deleting conversation:", sessionId);
        const result = await deleteConversation(sessionId);

        if (result && result.status === "success") {
          console.log("🗑️ Conversation deleted successfully");

          // Remove from local history state
          setHistory((prev) =>
            prev.filter((conv) => conv.session_id !== sessionId)
          );

          // Clear selected conversation if it was the one being deleted
          if (selectedConversation?.session_id === sessionId) {
            setSelectedConversation(null);
          }

          // Remove from search results if present
          setSearchResults((prev) =>
            prev.filter((conv) => conv.session_id !== sessionId)
          );

          return true;
        } else {
          throw new Error("Delete operation failed");
        }
      } catch (error) {
        console.error("Failed to delete conversation:", error);
        setHistoryError(error.message);
        return false;
      } finally {
        setHistoryLoading(false);
      }
    },
    [selectedConversation]
  );

  // Refresh history (useful after creating new conversation)
  const refreshHistory = useCallback(async () => {
    await fetchHistory();
  }, [fetchHistory]);

  const value = {
    // History state
    history,
    selectedConversation,
    historyLoading,
    historyError,

    // Search state
    searchQuery,
    searchResults,
    searchLoading,
    searchError,

    // Actions
    fetchHistory,
    fetchConversationDetails,
    searchConversations,
    clearSearch,
    selectConversation,
    clearSelectedConversation,
    refreshHistory,
    setSearchQuery,
    deleteConversationById,

    // Configuration
    config: CHAT_CONFIG,
  };

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
};

HistoryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { HistoryContext };
