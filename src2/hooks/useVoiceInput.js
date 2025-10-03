import { useState, useCallback, useRef } from "react";

export const useVoiceInput = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  const initializeSpeechRecognition = useCallback(() => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      setIsSupported(false);
      setError("Speech recognition is not supported in this browser");
      return null;
    }

    setIsSupported(true);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    return recognition;
  }, []);

  // Start listening
  const startListening = useCallback(
    (onResult, onError, language = "en-US") => {
      if (!isSupported) {
        const errorMsg = "Speech recognition is not supported";
        setError(errorMsg);
        if (onError) onError(new Error(errorMsg));
        return;
      }

      if (isListening) {
        console.warn("Already listening");
        return;
      }

      const recognition = initializeSpeechRecognition();
      if (!recognition) return;

      recognition.lang = language;
      recognitionRef.current = recognition;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
        console.log("Voice recognition started");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("Voice input result:", transcript);
        if (onResult) onResult(transcript);
      };

      recognition.onerror = (event) => {
        const errorMsg = `Speech recognition error: ${event.error}`;
        console.error(errorMsg);
        setError(errorMsg);
        setIsListening(false);
        if (onError) onError(new Error(errorMsg));
      };

      recognition.onend = () => {
        setIsListening(false);
        console.log("Voice recognition ended");
      };

      try {
        recognition.start();
      } catch (error) {
        const errorMsg = `Failed to start speech recognition: ${error.message}`;
        setError(errorMsg);
        setIsListening(false);
        if (onError) onError(error);
      }
    },
    [isSupported, isListening, initializeSpeechRecognition]
  );

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  // Process voice input (convert to base64 for API)
  const processVoiceInput = useCallback(async (audioBlob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64Audio = reader.result.split(",")[1]; // Remove data URL prefix
        resolve(base64Audio);
      };

      reader.onerror = () => {
        reject(new Error("Failed to convert audio to base64"));
      };

      reader.readAsDataURL(audioBlob);
    });
  }, []);

  // Check if browser supports speech recognition
  const checkSupport = useCallback(() => {
    const supported =
      "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
    setIsSupported(supported);
    return supported;
  }, []);

  return {
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    processVoiceInput,
    checkSupport,
  };
};
