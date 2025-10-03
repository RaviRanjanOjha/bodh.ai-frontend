import { useRef, useState, useEffect, useCallback, createContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  chat,
  getConversationHistory,
  getConversationDetails,
  search_convo,
  uploadDocuments,
  deleteConversation,
  toggleFavoriteConversation,
  getFavoriteConversations,
  reorderFavorites,
  getSuggestions,
  getFAQs,
} from '../services/api';
const API_BASE_URL = 'https://localhost:8000';
export const Context = createContext();

const ContextProvider = (props) => {
  const abortRef = useRef(false);
  const [input, setInput] = useState('');
  const [recentPrompt, setRecentPrompt] = useState('');
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState(null);

  const [history, setHistory] = useState([]);
  const [isChatHistoryLoading, setIsChatHistoryLoading] = useState(false);
  const [hasChatHistoryError, setHasChatHistoryError] = useState(null);

  const [selectedConversation, setSelectedConversation] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  // Favorite conversations state
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [favoritesError, setFavoritesError] = useState(null);

  const [isStreaming, setIsStreaming] = useState(false);

  const [lastPrompt, setLastPrompt] = useState('');
  const [suggestions, setSuggestions] = useState([]); //this also added in 3/07

  const [faqList, setFaqList] = useState([]);
  const [showSkeleton, setShowSkeleton] = useState(false);
  // Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Modal Functions
  const handleOpenUploadModal = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const fetchFAQList = async () => {
    try {
      const faqs = await getFAQs();
      setFaqList(faqs);
    } catch (error) {
      console.error('Error in fetchFAQList: ', error);
    }
  };

  const searchConversations = useCallback(async (query, limit = 10) => {
    setSearchLoading(true);
    setSearchError(null);
    try {
      const results = await search_convo(query, limit);
      setSearchResults(results);
      return results;
    } catch (error) {
      setSearchError(error.message);
      throw error;
    } finally {
      setSearchLoading(false);
    }
  }, []);
  // Update URL based on session ID
  const updateUrlForSession = (sessionId) => {
    const urlParams = new URLSearchParams(window.location.search);
    const appVersion = urlParams.get('v');
    let newUrl;
    const appendVersion = appVersion ? `&v=${appVersion}` : '';
    if (sessionId) {
      newUrl = `${window.location.pathname}?session=${sessionId}${appendVersion}`;
    } else {
      newUrl = `${window.location.pathname}?v=${appVersion}`;
    }
    window.history.pushState({ sessionId }, '', newUrl);
  };

  const fetchHistory = useCallback(async () => {
    // remove setHistoryLoading from here and use setIsChatHistoryLoading for chat history
    // setHistoryLoading(true);
    setIsChatHistoryLoading(true);
    setHistoryError(null);
    setHasChatHistoryError(null);
    try {
      const data = await getConversationHistory();
      setHistory(data);
    } catch (error) {
      setHistoryError(error.message);
      setHasChatHistoryError(error.message);
    } finally {
      // remove setHistoryLoading from here and use setIsChatHistoryLoading for chat history
      setHistoryLoading(false);
      setIsChatHistoryLoading(false);
    }
  }, []);

  const fetchConversationDetails = useCallback(async (sessionId) => {
    setHistoryLoading(false);
    setHistoryError(null);
    const urlParams = new URLSearchParams(window.location.search);
    const appVersion = urlParams.get('v');
    try {
      const data = await getConversationDetails(sessionId);
      setSelectedConversation(data);
      setCurrentSessionId(sessionId);
      updateUrlForSession(sessionId, appVersion);
      setRecentPrompt(data.summary || 'Previous conversation');

      // Include timestamp information in the message formatting
      const conversationTimestamp = data.timestamp;
      console.log('🕒 Conversation timestamp received:', conversationTimestamp);
      console.log('🕒 Parsed date:', new Date(conversationTimestamp));
      console.log(
        '🕒 Local time:',
        new Date(conversationTimestamp).toLocaleString()
      );

      const messages = data.messages
        .map((msg) => {
          // Add timestamp info to each message for better parsing
          const timestamp = conversationTimestamp;
          return `<strong>${msg.role}:</strong> ${msg.content} [${timestamp}]`;
        })
        .join('<br/><br/>');

      setResultData(messages);
      setShowSkeleton(false); 
      setShowResults(true);
    } catch (error) {
      setHistoryError(error.message);
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  const newChat = useCallback(() => {
    console.log('Starting new chat conversation');
    setIsStreaming(false);
    setLoading(false);
    setShowResults(false);

    setSelectedConversation(null); // Clear selected conversation
    setCurrentSessionId(null); // Clear current session
    setRecentPrompt('');
    setResultData('');
    setInput('');

    setUploadStatus(null);
    setUploadError(null);

    // Generate new session ID for the new conversation
    const newSessionId = uuidv4();
    setCurrentSessionId(newSessionId);
    updateUrlForSession(newSessionId);
    console.log('New session created:', newSessionId);

    fetchFAQList();
  }, []);

  const onSent = async (promptArg) => {
    abortRef.current = false;
    setLoading(true);
    setIsStreaming(false);
    setShowResults(true);
    // await fetchSuggestions(session_id);

    const prompt = promptArg ?? input;
    setLastPrompt(prompt);
    setInput('');
    setIsStreaming(true);

    let charArray = [];
    let existingConversation = '';

    try {
      // Use selectedConversation session_id if available, otherwise use currentSessionId
      const targetSessionId =
        selectedConversation?.session_id || currentSessionId;
      console.log('🟡 Using session ID:', targetSessionId);
      console.log('🟡 selectedConversation:', selectedConversation);
      console.log('🟡 currentSessionId:', currentSessionId);

      // Load existing conversation history if we have a session ID and we're continuing a conversation
      if (targetSessionId && selectedConversation) {
        // We're continuing an existing conversation, so keep the existing conversation data
        existingConversation = resultData; // Use the currently displayed conversation
      } else if (targetSessionId && targetSessionId !== currentSessionId) {
        // We're switching to a different conversation, load its history
        try {
          const conversationData = await getConversationDetails(
            targetSessionId
          );
          if (conversationData && conversationData.messages) {
            existingConversation = conversationData.messages
              .map((msg) => `<strong>${msg.role}:</strong> ${msg.content}`)
              .join('<br/><br/>');
            setSelectedConversation(conversationData);
          }
        } catch (error) {
          console.log('Could not load existing conversation:', error);
        }
      }

      // Immediately add the user's message to the display
      const userMessage = `<strong>user:</strong> ${prompt}`;
      const conversationWithUserMessage = existingConversation
        ? `${existingConversation}<br/><br/>${userMessage}`
        : userMessage;

      // Add the user message first
      setResultData(conversationWithUserMessage);

      // Then add the "Analysing..." placeholder for the assistant
      const conversationWithAnalysing = `${conversationWithUserMessage}<br/><br/><strong>assistant:</strong> Analysing..`;
      setResultData(conversationWithAnalysing);

      // Always send the message to backend for proper storage and session management
      console.log('Sending message to backend:', prompt);
      console.log(' Using session ID:', targetSessionId);

      // Send the original user prompt to backend - let backend handle document queries and enrichment
      const responseObj = await chat(prompt, targetSessionId);

      if (abortRef.current) {
        console.log('User aborted before streaming began');
        setLoading(false);
        return;
      }

      setRecentPrompt(prompt);
      if (!promptArg) {
        setPrevPrompts((prev) => [...prev, prompt]);
      }

      // Update session state only if we get a valid response with session_id
      if (responseObj?.session_id) {
        // If no current session or if this is a new conversation
        if (
          !currentSessionId ||
          (!selectedConversation && responseObj.session_id !== currentSessionId)
        ) {
          setCurrentSessionId(responseObj.session_id);
          updateUrlForSession(responseObj.session_id);
        }

        // If we're not in an existing conversation, update the session
        if (!selectedConversation) {
          setCurrentSessionId(responseObj.session_id);
          updateUrlForSession(responseObj.session_id);
        }
      }

      const rawResponse = responseObj?.response ?? '';
      const formattedResponse = rawResponse
        .split('**')
        .map((chunk, i) => (i % 2 === 1 ? `<b>${chunk}</b>` : chunk))
        .join('')
        .split('*')
        .join('<br/>');

      // Build the complete conversation display without the "Analysing..." placeholder
      const fullConversationBase = `${conversationWithUserMessage}<br/><br/><strong>assistant:</strong> `;

      // Set the base conversation (everything except the streaming response)
      setResultData(fullConversationBase);
      charArray = formattedResponse.split('');

      setIsStreaming(true);
      setLoading(false);

      // Stream the response
      charArray.forEach((char, i) => {
        setTimeout(() => {
          if (abortRef.current) return;
          setResultData((prev) => prev + char);

          if (i === charArray.length - 1) {
            setIsStreaming(false);
            setLoading(false);
            // Refresh conversation history after completion
            fetchHistory();

            // If we're in a specific conversation, refresh its details to keep it current
            if (responseObj?.session_id) {
              setTimeout(() => {
                fetchConversationDetails(responseObj.session_id);
              }, 100);
            }
          }
        }, 10 * i);
      });

      await fetchHistory();
    } catch (error) {
      console.error('Error during chat:', error);
      setResultData((prev) =>
        prev.replace(
          '<div class="typing-indicator">Analysing...</div>',
          `Error: ${error.message}`
        )
      );
    } finally {
      const totalDelay = charArray.length * 10 + 50;

      setTimeout(() => {
        requestAnimationFrame(() => {
          setIsStreaming(false);
          if (!abortRef.current) {
            setLoading(false);
          }
        });
      }, totalDelay + 100);
    }
  };

  const processVoiceInput = async (base64Audio, language = 'en-IN') => {
    try {
      const response = await fetch(`${API_BASE_URL}/chat/voice-input`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          audio_data: base64Audio,
          language,
        }),
      });
      if (!response.ok) throw new Error('Voice input failed');
      return response.json();
      // const data=await response.json();
      // if (data.text){
      // 	setInput(data.text);
      // 	onSent(data.text);
      // }
    } catch (error) {
      console.error('Voice input error:', error.message);
      return null;
    }
  };

  const stopResponse = async () => {
    abortRef.current = true;
    setIsStreaming(false);
    setLoading(false);

    setInput(lastPrompt);

    try {
      await fetch(`${API_BASE_URL}/chat/stop`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Failed to stop response generation: ', error);
    }
  };

  useEffect(() => {
    // Load initial session from URL if exists
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session');

    if (sessionId) {
      fetchConversationDetails(sessionId);
    } else {
      const newSessionId = uuidv4();
      setCurrentSessionId(newSessionId);
    }
    setHistoryLoading(true);
    fetchHistory();
    fetchFAQList();

    // Add popstate listener for browser back/forward navigation
    const handlePopState = (event) => {
      if (event.state && event.state.sessionId) {
        fetchConversationDetails(event.state.sessionId);
      } else {
        newChat();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [fetchConversationDetails, newChat]);

  const onUploadDocument = async (files) => {
    setUploadStatus('uploading');
    setUploadError(null);

    try {
      if (!files || files.length === 0) {
        throw new Error('No files selected');
      }

      // Convert FileList to array if needed
      const filesArray = Array.isArray(files) ? files : Array.from(files);

      const result = await uploadDocuments(filesArray);
      setUploadStatus('uploaded');

      // Optionally notify about successful upload
      const message = `Uploaded ${result.documents.length} file(s) successfully`;
      setResultData(message);
      setShowResults(true);

      return result;
    } catch (error) {
      setUploadError(error.message);
      setUploadStatus('error');
      setResultData(`Upload failed: ${error.message}`);
      setShowResults(true);
      throw error;
    }
  };

  // Delete conversation
  const deleteConversationById = useCallback(
    async (sessionId) => {
      if (!sessionId) {
        console.warn('No session ID provided for deletion');
        return false;
      }

      // setHistoryLoading(true);
      setHistoryError(null);

      try {
        console.log('🗑️ Deleting conversation:', sessionId);
        const result = await deleteConversation(sessionId);

        if (result && result.status === 'success') {
          console.log('🗑️ Conversation deleted successfully');

          // Remove from local history state
          setHistory((prev) =>
            prev.filter((conv) => conv.session_id !== sessionId)
          );
          setFavorites((prev) =>
            prev.filter((conv) => conv.session_id !== sessionId)
          );

          // Clear selected conversation if it was the one being deleted
          if (selectedConversation?.session_id === sessionId) {
            setSelectedConversation(null);
            setCurrentSessionId(null);
            setShowResults(false);
            setResultData('');
          }

          // Remove from search results if present
          setSearchResults((prev) =>
            prev.filter((conv) => conv.session_id !== sessionId)
          );

          return true;
        } else {
          throw new Error('Delete operation failed');
        }
      } catch (error) {
        console.error('Failed to delete conversation:', error);
        setHistoryError(error.message);
        return false;
      } finally {
        setHistoryLoading(false);
      }
    },
    [selectedConversation?.session_id]
  );

  const fetchSuggestions = async (sessionId) => {
    try {
      const res = await getSuggestions(sessionId);
      setSuggestions(res.suggestions || []);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error.message);
      setSuggestions([]);
    }
  };

  // Favorite conversation functions
  const fetchFavorites = useCallback(async () => {
    setFavoritesLoading(true);
    setFavoritesError(null);
    try {
      const data = await getFavoriteConversations();
      setFavorites(data);
    } catch (error) {
      setFavoritesError(error.message);
    } finally {
      setFavoritesLoading(false);
    }
  }, []);

  const toggleFavorite = useCallback(
    async (sessionId) => {
      if (!sessionId) {
        console.warn('No session ID provided for favorite toggle');
        return false;
      }

      try {
        console.log('⭐ Toggling favorite for conversation:', sessionId);
        const result = await toggleFavoriteConversation(sessionId);

        if (result && result.status === 'success') {
          console.log('⭐ Favorite toggled successfully');

          // Update the conversation in history
          setHistory((prev) =>
            prev.map((conv) =>
              conv.session_id === sessionId
                ? { ...conv, is_favorite: result.is_favorite }
                : conv
            )
          );

          // Update selected conversation if it's the one being favorited
          if (selectedConversation?.session_id === sessionId) {
            setSelectedConversation((prev) => ({
              ...prev,
              is_favorite: result.is_favorite,
            }));
          }

          // Update search results if present
          setSearchResults((prev) =>
            prev.map((conv) =>
              conv.session_id === sessionId
                ? { ...conv, is_favorite: result.is_favorite }
                : conv
            )
          );

          // Refresh favorites list
          await fetchFavorites();

          return true;
        } else {
          throw new Error('Favorite toggle operation failed');
        }
      } catch (error) {
        console.error('Failed to toggle favorite:', error);
        setFavoritesError(error.message);
        return false;
      }
    },
    [selectedConversation?.session_id, fetchFavorites]
  );

  const reorderFavoriteConversations = async (newOrder) => {
    if (!newOrder || newOrder.length === 0) {
      console.warn('No new order provided for favorites reorder');
      return false;
    }

    try {
      console.log('⭐ Reordering favorites:', newOrder);
      const result = await reorderFavorites(newOrder);

      if (result && result.status === 'success') {
        console.log('⭐ Favorites reordered successfully');
        // Refresh favorites list to get updated order
        await fetchFavorites();
        return true;
      } else {
        throw new Error('Favorites reorder operation failed');
      }
    } catch (error) {
      console.error('Failed to reorder favorites:', error);
      setFavoritesError(error.message);
      return false;
    }
  };

  const contextValue = {
    faqList,
    fetchFAQList,
    suggestions,
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    input,
    setInput,
    showResults,
    loading,
    resultData,
    newChat,
    history,
    isChatHistoryLoading,
    hasChatHistoryError,
    selectedConversation,
    fetchHistory,
    fetchConversationDetails,
    historyLoading,
    historyError,
    stopResponse,
    processVoiceInput,
    isStreaming,
    setIsStreaming,
    currentSessionId,
    searchQuery,
    setSearchQuery,
    searchResults,
    searchLoading,
    searchError,
    searchConversations,
    onUploadDocument,
    uploadStatus,
    uploadError,
    deleteConversationById,
    fetchFavorites,
    favorites,
    favoritesLoading,
    favoritesError,
    toggleFavorite,
    reorderFavoriteConversations,
    handleOpenUploadModal,
    handleCloseUploadModal,
    isUploadModalOpen,
    showSkeleton,
    setShowSkeleton,
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
