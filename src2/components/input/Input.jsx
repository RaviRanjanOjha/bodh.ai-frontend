import React, { useRef, useContext } from "react";
import "./input.css";
import { assets } from "../../assets/assets";
import Button from "../button/Button.jsx";
import {
  FaArrowRight,
  FaMicrophone,
  FaPaperclip,
  FaStop,
} from "react-icons/fa6";
import { Context } from "../../context/Context";

const Input = ({
  value,
  onChange,
  onSend,
  onStop,
  disabled,
  onFocus,
  onBlur,
  onUploadDocument,
  uploadStatus,
  uploadError,
}) => {
  const { loading, isStreaming, processVoiceInput } = useContext(Context);

  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Your browser doesn’t support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onChange({ target: { value: transcript } }); // Inject text into input
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };

    recognition.start();
  };

  const handleAttachCLick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (onUploadDocument) {
      onUploadDocument(files);
    }

    event.target.value = null;
  };

  return (
    <div className={`search-box ${disabled ? "disabled" : ""}`}>
      <textarea
        className="chat-textarea"
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Type your prompt here..."
        disabled={disabled}
        rows={2}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && !disabled && value.trim()) {
            e.preventDefault();
            onSend();
          }
        }}
      />

      <div>
        <Button
          icon={<FaMicrophone />}
          shape="round"
          variant="primary"
          onClick={handleVoiceInput}
        />
        <Button
          icon={isStreaming ? <FaStop /> : <FaArrowRight />}
          shape="round"
          variant="primary"
          onClick={isStreaming ? onStop : onSend}
          disabled={!value.trim() && !isStreaming}
        />
      </div>
    </div>
  );
};

export default Input;
