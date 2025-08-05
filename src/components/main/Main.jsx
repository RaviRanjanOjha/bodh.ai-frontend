import {
  useContext,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import { assets } from "../../assets/assets";
import "./main.css";
import { Context } from "../../context/Context.jsx";
import Card from "../card/Card";
import Button from "../button/Button.jsx";
import Input from "../input/Input.jsx";
import { FaBars, FaUser } from "react-icons/fa";
import { formatTime } from "../../utils/dateUtils";
// import { DEFAULT_CARD_DATA } from "../../constants";
import { scrollToBottom } from "../../utils/chatUtils";
import { updateUrlWithSession } from "../../utils/urlUtils";
import AuthPopup from "../Auth/Authpopup.jsx";
import { Button as MUIButton, Menu, MenuItem } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FrontHandIcon from "@mui/icons-material/FrontHand";
import ChatIcon from "@mui/icons-material/Chat";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import OutboundOutlinedIcon from "@mui/icons-material/OutboundOutlined";
// import {UserCircleDashed} from "phosphor-react";
import ReactMarkdown from "react-markdown";

const Main = ({ isSidebarVisible, toggleSidebar }) => {
  const chatContainerRef = useRef(null);

  const {
    suggestions,
    onSent,
    showResults,
    loading,
    resultData,
    setInput,
    input,
    stopResponse,
    onUploadDocument,
    uploadStatus,
    uploadError,
    currentSessionId,
    newChat,
    selectedConversation,
    faqList,
  } = useContext(Context);

  useLayoutEffect(() => {
    if (chatContainerRef.current && resultData && loading === false) {
      scrollToBottom(chatContainerRef.current, true);
    }
  }, [resultData, loading]);

  // useEffect(() => {
  //   if (chatContainerRef.current && resultData && loading === false) {
  //     scrollToBottom(chatContainerRef.current, true);
  //   }
  // }, [resultData, loading]);

  // useEffect(() => {
  //   if (selectedConversation && chatContainerRef.current) {
  //     setTimeout(() => {
  //       scrollToBottom(chatContainerRef.current, false); // No smooth scroll for initial load
  //     }, 200);
  //   }
  // }, [selectedConversation]);

  // useEffect(() => {
  //   if (showResults && chatContainerRef.current) {
  //     setTimeout(() => {
  //       scrollToBottom(chatContainerRef.current, false); // Instant scroll for initial appearance
  //     }, 100);
  //   }
  // }, [showResults]);

  // useEffect(() => {
  //   if (chatContainerRef.current && (resultData || selectedConversation)) {
  //     setTimeout(() => {
  //       scrollToBottom(chatContainerRef.current, false);
  //     }, 50);
  //   }
  // }, [resultData, selectedConversation]);

  // Sync URL with current session - using utility
  useEffect(() => {
    if (currentSessionId) {
      updateUrlWithSession(currentSessionId);
    } else if (window.location.search) {
      // Clean URL if no session but one exists in URL
      updateUrlWithSession(null);
    }
  }, [currentSessionId]);

  // Use constants for card data
  const cardData = [
    {
      title: "Our Capabilities",
      desc: "A brief idea on what we do",
      iconLeft: <FrontHandIcon />,
      iconRight: <OutboundOutlinedIcon />,
    },
    {
      title: "Available Languages",
      desc: "What languages can we chat in?",
      iconLeft: <GTranslateIcon />,
      iconRight: <OutboundOutlinedIcon />,
    },
    {
      title: "Clients We Work With",
      desc: "Our list of elite clients across the globe",
      iconLeft: <ChatIcon />,
      iconRight: <OutboundOutlinedIcon />,
    },
    {
      title: (
        <>
          Advisor <br /> Chat Guide
        </>
      ),
      desc: "How to chat with an advisor?",
      iconLeft: <AccountCircleIcon />,
      iconRight: <OutboundOutlinedIcon />,
    },
  ];
  const handleCardClick = async (promptText) => {
    setInput(promptText);

    await onSent(promptText); // Send the prompt directly

    if (chatContainerRef.current) {
      setTimeout(() => {
        scrollToBottom(chatContainerRef.current, true);
      }, 50);
    }

    console.log(promptText);
  };

  // Wrapper for onSent that includes auto-scroll
  const handleSendMessage = async () => {
    // Trigger the original onSent function
    await onSent();

    // Immediately scroll to bottom to show user's message
    if (chatContainerRef.current) {
      setTimeout(() => {
        scrollToBottom(chatContainerRef.current, true);
      }, 50);
    }
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleDropdownClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const [showAuthPopup, setShowAuthPopup] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated")) {
      setShowAuthPopup(false);
    }
  }, []);

  const truncateText = (text, maxWords = 12) => {
    const words = text.split(" ");
    return words.length > maxWords
      ? words.slice(0, maxWords).join(" ") + "..."
      : text;
  };

  return (
    <>
      {showAuthPopup && (
        <AuthPopup
          onLoginSuccess={(user) => {
            console.log("Logged in:", user);
            setShowAuthPopup(false); // or redirect user
          }}
          onClose={() => setShowAuthPopup(false)}
        />
      )}

      <div className="main">
        <div className="nav">
          <div className="dropdown-container">
            <MUIButton
              onClick={handleDropdownClick}
              endIcon={<ArrowDropDownIcon />}
              className="dropdown-btn"
              style={{ textTransform: "lowercase" }}
            >
              bodh.ai v1.0
            </MUIButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleDropdownClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem onClick={handleDropdownClose}>bodh.ai v1.0</MenuItem>
            </Menu>
          </div>
        </div>
        <div className="main-container">
          {!showResults && !uploadStatus ? (
            <div className="welcome-section">
              <div className="greet">
                <p>
                  How can we <span>assist</span> you today?
                </p>
                <p className="subhead">
                  Get expert guidance powered by AI agents specializing in
                  Sales, Marketing, and Negotiation. Choose the agent that suits
                  your needs and start your conversation with ease.
                </p>
              </div>

              <div
                className="cards-container"
                style={{
                  display: "flex",
                  gap: "30px",
                  justifyContent: "center",
                  maxWidth: "900px",
                  margin: "0 auto",
                }}
              >
                {faqList.length > 0 ? (
                  faqList.slice(0, 4).map((question, index) => (
                    <Card
                      key={index}
                      size="medium"
                      iconLeft={<ChatIcon />}
                      iconRight={<OutboundOutlinedIcon />}
                      onClick={() => handleCardClick(question)}
                    >
                      <div>
                        <strong className="card-content">
                          {truncateText(question, 8)}
                        </strong>
                        <p>Click to ask this again</p>
                      </div>
                    </Card>
                  ))
                ) : (
                  <p>No FAQs available yet.</p>
                )}
              </div>
            </div>
          ) : (
            <div className="chat-container" ref={chatContainerRef}>
              <div className="chat-messages">
                {/* Show upload messages in chat */}
                {(uploadStatus || uploadError) && !resultData && (
                  <div className="conversation-thread">
                    <div className="message-row assistant-row">
                      <div className="message-bubble assistant-bubble">
                        <div className="message-avatar genui-avatar">
                          <div className="genui-icon"></div>
                        </div>
                        <div className="message-content">
                          <div className="message-header">
                            <span className="message-label">bodh.ai</span>
                            <span className="message-time">{formatTime()}</span>
                          </div>
                          <div className="message-text">
                            {uploadStatus === "uploading" &&
                              "Uploading documents..."}
                            {uploadStatus === "uploaded" &&
                              "Documents uploaded successfully! You can now ask questions about the uploaded documents."}
                            {uploadError && `Upload error: ${uploadError}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Show conversation messages */}
                {resultData && (
                  <div className="conversation-thread">
                    {(() => {
                      // Parse the conversation data more intelligently
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
                          const timestamp = timestampMatch
                            ? timestampMatch[1]
                            : null;
                          const content = timestamp
                            ? userMessage.replace(/\[.*?\]/, "").trim()
                            : userMessage;

                          messages.push({
                            type: "user",
                            content: content,
                            timestamp: timestamp,
                            index: `user-${index}`,
                          });
                        } else if (
                          cleanSection.includes("<strong>assistant:</strong>")
                        ) {
                          const assistantMessage = cleanSection
                            .replace("<strong>assistant:</strong>", "")
                            .trim();
                          // Try to extract timestamp from the message if available
                          const timestampMatch = assistantMessage.match(
                            /\[(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*?)\]/
                          );
                          const timestamp = timestampMatch
                            ? timestampMatch[1]
                            : null;
                          const content = timestamp
                            ? assistantMessage.replace(/\[.*?\]/, "").trim()
                            : assistantMessage;

                          messages.push({
                            type: "assistant",
                            content: content,
                            timestamp: timestamp,
                            index: `assistant-${index}`,
                          });
                        } else if (
                          cleanSection &&
                          !cleanSection.includes("<strong>")
                        ) {
                          // Handle content that might not have proper tags
                          messages.push({
                            type: "assistant",
                            content: cleanSection,
                            timestamp: null,
                            index: `content-${index}`,
                          });
                        }
                      });

                      const normalizeMessage = (raw) => {
                        return raw.replace(/<br\s*\/?>/gi, "\n");
                      };

                      return messages.map((message, idx) => {
                        if (message.type === "user") {
                          return (
                            <div
                              key={message.index}
                              className="message-row user-row"
                            >
                              <div className="message-bubble user-bubble">
                                <div className="message-avatar">
                                  <FaUser />
                                  {/* <UserCircleDashed size={32} /> */}
                                </div>
                                <div className="message-content">
                                  <div className="message-header">
                                    <span className="message-label">You</span>
                                    <span className="message-time">
                                      {formatTime(message.timestamp)}
                                    </span>
                                  </div>
                                  <div className="message-text">
                                    {loading && idx === messages.length - 1 ? (
                                      Analysing
                                    ) : message.content.includes(
                                        "typing-indicator"
                                      ) ? null : (
                                      <ReactMarkdown
                                        components={{
                                          p: ({ node, ...props }) => (
                                            <p
                                              style={{
                                                marginBottom: "0.8em",
                                                lineHeight: "1.6",
                                              }}
                                              {...props}
                                            />
                                          ),
                                          strong: ({ node, ...props }) => (
                                            <strong
                                              style={{
                                                color: "#000",
                                                fontWeight: 600,
                                              }}
                                              {...props}
                                            />
                                          ),
                                          li: ({ node, ...props }) => (
                                            <li
                                              style={{
                                                marginBottom: "0.4em",
                                                marginLeft: "1.2em",
                                              }}
                                              {...props}
                                            />
                                          ),
                                          ul: ({ node, ...props }) => (
                                            <ul
                                              style={{
                                                paddingLeft: "1.5em",
                                                marginBottom: "1em",
                                              }}
                                              {...props}
                                            />
                                          ),
                                          table: ({ node, ...props }) => (
                                            <table
                                              style={{
                                                width: "100%",
                                                borderCollapse: "collapse",
                                                marginBottom: "1em",
                                              }}
                                              {...props}
                                            />
                                          ),
                                          thead: ({ node, ...props }) => (
                                            <thead
                                              style={{
                                                backgroundColor: "#f0f0f0",
                                              }}
                                              {...props}
                                            />
                                          ),
                                          tbody: ({ node, ...props }) => (
                                            <tbody {...props} />
                                          ),
                                          tr: ({ node, ...props }) => (
                                            <tr
                                              style={{
                                                borderBottom: "1px solid #ddd",
                                              }}
                                              {...props}
                                            />
                                          ),
                                          th: ({ node, ...props }) => (
                                            <th
                                              style={{
                                                textAlign: "left",
                                                padding: "8px",
                                                fontWeight: "bold",
                                                border: "1px solid #ccc",
                                              }}
                                              {...props}
                                            />
                                          ),
                                          td: ({ node, ...props }) => (
                                            <td
                                              style={{
                                                padding: "8px",
                                                border: "1px solid #ccc",
                                              }}
                                              {...props}
                                            />
                                          ),
                                        }}
                                      >
                                        {normalizeMessage(message.content)}
                                      </ReactMarkdown>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div
                              key={message.index}
                              className="message-row assistant-row"
                            >
                              <div className="message-bubble assistant-bubble">
                                <div className="message-avatar genui-avatar">
                                  <div className="genui-icon">
                                    <img src={assets.bodhAilogo} />
                                  </div>
                                </div>
                                <div className="message-content">
                                  <div className="message-header">
                                    <span className="message-label">
                                      bodh.ai
                                    </span>
                                    <span className="message-time">
                                      {formatTime(message.timestamp)}
                                    </span>
                                  </div>
                                  <div className="message-text">
                                    <ReactMarkdown
                                      components={{
                                        p: ({ node, ...props }) => (
                                          <p
                                            style={{
                                              marginBottom: "0.8em",
                                              lineHeight: "1.6",
                                            }}
                                            {...props}
                                          />
                                        ),
                                        strong: ({ node, ...props }) => (
                                          <strong
                                            style={{
                                              color: "#000",
                                              fontWeight: 600,
                                            }}
                                            {...props}
                                          />
                                        ),
                                        li: ({ node, ...props }) => (
                                          <li
                                            style={{
                                              marginBottom: "0.4em",
                                              marginLeft: "1.2em",
                                            }}
                                            {...props}
                                          />
                                        ),
                                        ul: ({ node, ...props }) => (
                                          <ul
                                            style={{
                                              paddingLeft: "1.5em",
                                              marginBottom: "1em",
                                            }}
                                            {...props}
                                          />
                                        ),
                                        table: ({ node, ...props }) => (
                                          <table
                                            style={{
                                              width: "100%",
                                              borderCollapse: "collapse",
                                              marginBottom: "1em",
                                            }}
                                            {...props}
                                          />
                                        ),
                                        thead: ({ node, ...props }) => (
                                          <thead
                                            style={{
                                              backgroundColor: "#f0f0f0",
                                            }}
                                            {...props}
                                          />
                                        ),
                                        tbody: ({ node, ...props }) => (
                                          <tbody {...props} />
                                        ),
                                        tr: ({ node, ...props }) => (
                                          <tr
                                            style={{
                                              borderBottom: "1px solid #ddd",
                                            }}
                                            {...props}
                                          />
                                        ),
                                        th: ({ node, ...props }) => (
                                          <th
                                            style={{
                                              textAlign: "left",
                                              padding: "8px",
                                              fontWeight: "bold",
                                              border: "1px solid #ccc",
                                            }}
                                            {...props}
                                          />
                                        ),
                                        td: ({ node, ...props }) => (
                                          <td
                                            style={{
                                              padding: "8px",
                                              border: "1px solid #ccc",
                                            }}
                                            {...props}
                                          />
                                        ),
                                      }}
                                    >
                                      {normalizeMessage(message.content)}
                                    </ReactMarkdown>

                                    {!loading &&
                                      suggestions.length > 0 &&
                                      idx === messages.length - 1 && (
                                        <div className="suggested-prompots">
                                          {suggestions.map((prompt, index) => (
                                            <button
                                              key={index}
                                              className="suggestion-button"
                                              onClick={() => {
                                                setInput(prompt);
                                                onSent(prompt);
                                              }}
                                            >
                                              {prompt}
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      });
                    })()}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="main-bottom">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onSend={() => handleSendMessage()}
              disabled={false}
              onFocus={() => console.log("Input focused")}
              onBlur={() => console.log("Input blurred")}
              onStop={stopResponse}
              onUploadDocument={onUploadDocument}
              uploadStatus={uploadStatus}
              uploadError={uploadError}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Main;
