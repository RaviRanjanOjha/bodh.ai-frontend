/**
 * Custom hook for chat functionality
 */
import { useState, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { chat } from "../services/api";
import {
  formatChatResponse,
  buildConversationString,
} from "../utils/stringUtils";
import { validatePrompt } from "../utils/validationUtils";
import { UI_CONFIG, LOADING_STATES, MESSAGE_TYPES } from "../constants";

export const useChat = () => {
  const abortRef = useRef(false);
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [abortStream, setAbortStream] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [lastPrompt, setLastPrompt] = useState("");

  const generateNewSessionId = useCallback(() => {
    const newSessionId = uuidv4();
    setCurrentSessionId(newSessionId);
    return newSessionId;
  }, []);

  const resetChat = useCallback(() => {
    console.log("Resetting chat state");
    setIsStreaming(false);
    setLoading(false);
    setShowResults(false);
    setRecentPrompt("");
    setResultData("");
    setInput("");
    abortRef.current = false;
    setAbortStream(false);
  }, []);

  const newChat = useCallback(() => {
    console.log("Starting new chat conversation");
    resetChat();
    const newSessionId = generateNewSessionId();
    console.log("New session created:", newSessionId);
    return newSessionId;
  }, [resetChat, generateNewSessionId]);

  const stopResponse = useCallback(async () => {
    abortRef.current = true;
    setIsStreaming(false);
    setLoading(false);
    setInput(lastPrompt);

    try {
      await fetch(`${API_BASE_URL}/chat/stop`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Failed to stop response generation: ", error);
    }
  }, [lastPrompt]);

  const sendMessage = useCallback(
    async (
      promptArg,
      targetSessionId,
      existingConversation = "",
      onSuccess = () => {},
      onError = () => {}
    ) => {
      // Validate prompt
      const prompt = promptArg ?? input;
      const validation = validatePrompt(prompt);

      if (!validation.isValid) {
        onError(new Error(validation.error));
        return;
      }

      abortRef.current = false;
      setLoading(true);
      setIsStreaming(false);
      setShowResults(true);
      setAbortStream(false);
      setLastPrompt(prompt);
      setInput("");

      let charArray = [];

      try {
        console.log("🟡 Sending message to backend:", prompt);
        console.log("🟡 Using session ID:", targetSessionId);

        const responseObj = await chat(prompt, targetSessionId);

        if (abortRef.current) {
          console.log("User aborted before streaming began");
          setLoading(false);
          return;
        }

        setRecentPrompt(prompt);
        if (!promptArg) {
          setPrevPrompts((prev) => [...prev, prompt]);
        }

        const rawResponse = responseObj?.response ?? "";
        const formattedResponse = formatChatResponse(rawResponse);

        // Build the complete conversation display
        const userMessage = `<strong>${MESSAGE_TYPES.USER}:</strong> ${prompt}`;
        const fullConversationBase = existingConversation
          ? `${existingConversation}<br/><br/>${userMessage}<br/><br/><strong>${MESSAGE_TYPES.ASSISTANT}:</strong> `
          : `${userMessage}<br/><br/><strong>${MESSAGE_TYPES.ASSISTANT}:</strong> `;

        setResultData(fullConversationBase);
        charArray = formattedResponse.split("");
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
              onSuccess(responseObj);
            }
          }, UI_CONFIG.TYPING_DELAY * i);
        });
      } catch (error) {
        console.error("Error during chat:", error);
        setResultData("Error: " + error.message);
        setLoading(false);
        setIsStreaming(false);
        onError(error);
      } finally {
        const totalDelay = charArray.length * UI_CONFIG.TYPING_DELAY + 50;
        setTimeout(() => {
          requestAnimationFrame(() => {
            setIsStreaming(false);
            if (!abortRef.current) {
              setLoading(false);
            }
          });
        }, totalDelay + UI_CONFIG.AUTO_SCROLL_DELAY);
      }
    },
    [input]
  );

  return {
    // State
    input,
    recentPrompt,
    prevPrompts,
    showResults,
    loading,
    resultData,
    currentSessionId,
    isStreaming,
    lastPrompt,
    abortStream,

    // Actions
    setInput,
    setRecentPrompt,
    setPrevPrompts,
    setShowResults,
    setResultData,
    setCurrentSessionId,
    newChat,
    resetChat,
    sendMessage,
    stopResponse,
    generateNewSessionId,
  };
};
