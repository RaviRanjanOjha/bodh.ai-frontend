import React, { useState } from "react";
import Modal from "../modal/Modal";
import {
  FaSearch,
  FaPaperclip,
  FaSmile,
  FaBell,
  FaMicrophone,
  FaUserCircle,
  FaArrowRight,
} from "react-icons/fa";
import "./SmartInput.css";
const SmartInput = ({
  placeholder = "Type something...",
  iconsStart = [FaSearch, FaPaperclip],
  iconsEnd = [FaSmile, FaBell],
  iconStart = <FaUserCircle />,
  iconEnd = <FaArrowRight />,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const handleVoiceToText = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition not supported");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();
    setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
  };
  return (
    <>
      <div className="smart-input" onClick={() => setShowModal(true)}>
        {iconStart && <span className="input-icon">{iconStart}</span>}
        {iconsStart.map((Icon, index) => (
          <span key={index} className="input-icon">
            <Icon />
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          placeholder={placeholder}
          readOnly
        />
        {iconsEnd.map((Icon, index) => (
          <span key={index} className="input-icon">
            <Icon />
          </span>
        ))}
        {iconEnd && <span className="input-icon">{iconEnd}</span>}
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <div className="modal-input-wrapper">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="modal-input"
            autoFocus
          />
          <button className="voice-btn" onClick={handleVoiceToText}>
            <FaMicrophone />
          </button>
        </div>
      </Modal>
    </>
  );
};
export default SmartInput;
