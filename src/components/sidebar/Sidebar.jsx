import "./sidebar.css";
import { useState, useRef } from "react";
import { assets } from "../../assets/assets";
import { useContext, useCallback } from "react";
import { Context } from "../../context/Context";
import {
  FaPlus,
  FaSearch,
  FaUser,
  FaCog,
  FaTrash,
  FaGreaterThan,
} from "react-icons/fa";
import { MdAttachment } from "react-icons/md";
import { debounce } from "../../utils/chatUtils";
import { CHAT_CONFIG, UI_CONFIG } from "../../constants";
import DateAccordion from "./collapseHistory";

const Sidebar = (isVisible) => {
  const {
    newChat,
    history,
    fetchHistory,
    fetchConversationDetails,
    historyLoading,
    historyError,
    selectedConversation,
    searchQuery,
    setSearchQuery,
    searchResults,
    searchLoading,
    searchError,
    searchConversations,
    deleteConversationById,
    onUploadDocument,
  } = useContext(Context);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const fileInputRef = useRef(null);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn("Invalid date string:", dateString);
        return "";
      }

      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    } catch (error) {
      console.warn("Date parsing error:", error);
      return "";
    }
  };

  const handleNewChat = async () => {
    newChat();
    await fetchHistory();
  };

  // Create debounced search function
  const handleSearchChange = useCallback(
    (text) => {
      setSearchQuery(text);
      if (text.trim()) {
        const debouncedFn = debounce(() => {
          searchConversations(text, CHAT_CONFIG.SEARCH_LIMIT);
        }, UI_CONFIG.DEBOUNCE_DELAY);
        debouncedFn();
      }
    },
    [searchConversations, setSearchQuery]
  );

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

  // Handle delete conversation
  const handleDeleteConversation = useCallback(
    async (sessionId, event) => {
      // Prevent event bubbling to parent onClick
      event.stopPropagation();

      const confirmed = window.confirm(
        "Are you sure you want to delete this conversation? This action cannot be undone."
      );

      if (!confirmed) return;

      try {
        const success = await deleteConversationById(sessionId);
        if (success) {
          console.log("✅ Conversation deleted successfully");
          // Optionally refresh history to ensure sync
          await fetchHistory();
        }
      } catch (error) {
        console.error("❌ Failed to delete conversation:", error);
        alert("Failed to delete conversation. Please try again.");
      }
    },
    [deleteConversationById, fetchHistory]
  );

  return (
    <>
      {isCollapsed && (
        <img
          src={assets.sidebar_colaspe}
          className="open-sidebar-btn"
          alt="menu-icon"
          onClick={() => setIsCollapsed(false)}
          // Collapse sidebar
        />
      )}
      <div className={`sidebarouter ${isCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar">
          <img
            src={assets.sidebar_colaspe}
            className="sidebar_colaspe_icon"
            alt="menu-icon"
            onClick={() => setIsCollapsed(true)}
          />

          <div className="top">
            <img src={assets.bodhai} className="menu" alt="menu-icon" />
            <div className="logo-content">A Product of Tech Mahindra Ltd</div>

            <div className="new-chat" onClick={handleNewChat}>
              <button className="begin">Begin new Chat</button>
              <FaPlus className="plus-icon" />
            </div>

            <div className="recent">
              <div className="search-bar">
                <input
                  className="search"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => {
                    const text = e.target.value;
                    handleSearchChange(text);
                  }}
                />
                <FaSearch className="search-icon" />
              </div>

              <div className="conversation-history">
                {/* Search results section */}
                <DateAccordion
                  history={searchQuery ? searchResults : history}
                  historyLoading={
                    historyLoading || (searchQuery && searchLoading)
                  }
                  historyError={historyError || (searchQuery && searchError)}
                  selectedConversation={selectedConversation}
                  fetchConversationDetails={fetchConversationDetails}
                  assets={assets}
                  formatDate={formatDate}
                  searchQuery={searchQuery}
                />
                {/* {searchQuery && (
              <>
                <p className="recent-title">Search Results</p>
                {searchLoading && <div className="loading">Searching...</div>}
                {searchError && (
                  <div className="error">Search error: {searchError}</div>
                )}

                {!searchLoading &&
                  !searchError &&
                  searchResults.length === 0 && (
                    <div className="empty-state">
                      No matching conversations found
                    </div>
                  )}

                {searchResults.map((result) => (
                  <div
                    key={`search-${result.session_id}`}
                    className={`conversation-item ${
                      selectedConversation?.session_id === result.session_id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() => fetchConversationDetails(result.session_id)}
                    title={result.summary || "Conversation"}
                  >
                    <img
                      src={assets.message_icon}
                      alt="chat"
                      className="chat-icon"
                    />
                    <div className="conversation-details">
                      <p className="conversation-summary">
                        {result.summary || "Conversation"}
                      </p>
                      <div className="highlight">
                        "{result.matching_message}..."
                      </div>
                      <span className="message-date">
                        {formatDate(
                          result.message_timestamp || result.timestamp
                        )}
                      </span>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={(e) =>
                        handleDeleteConversation(result.session_id, e)
                      }
                      title="Delete conversation"
                      aria-label="Delete conversation"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </>
            )} 

            {/* Regular conversation history */}
                {/* {(!searchQuery || searchResults.length === 0) && (
              <>
                <p className="recent-title">Conversations</p>
                {historyLoading && (
                  <div className="loading">Loading conversations...</div>
                )}
                {historyError && (
                  <div className="error">Error loading history</div>
                )}

                {!historyLoading && !historyError && history.length === 0 && (
                  <div className="empty-state">No conversations yet</div>
                )}

                {history.map((conv) => {
                  const validMessages = Array.isArray(conv.messages)
                    ? conv.messages.filter((msg) => msg?.content)
                    : [];
                  const messageCount = validMessages.length;
                  const lastMessage =
                    validMessages[validMessages.length - 1]?.content || "";

                  return (
                    <div
                      key={conv.session_id}
                      className={`conversation-item ${
                        selectedConversation?.session_id === conv.session_id
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => fetchConversationDetails(conv.session_id)}
                      title={conv.summary || "New conversation"}
                    >
                      <img
                        src={assets.message_icon}
                        alt="chat"
                        className="chat-icon"
                      />
                      <div className="conversation-details">
                        <p className="conversation-summary">
                          {conv.summary || "New conversation"}
                        </p>
                        <div className="conversation-meta">
                          {messageCount > 0 && (
                            <span className="message-count">
                              {messageCount}{" "}
                              {messageCount === 1 ? "message" : "messages"}
                            </span>
                          )}
                          <span className="message-date">
                            {formatDate(conv.updated_at || conv.timestamp)}
                          </span>
                        </div>
                        {lastMessage && (
                          <p className="conversation-preview">
                            {lastMessage.substring(0, 60)}
                            {lastMessage.length > 60 ? "..." : ""}
                          </p>
                        )}
                      </div>
                      <div className="conversation-actions">
                        <FaTrash
                          className="delete-icon"
                          onClick={(e) =>
                            handleDeleteConversation(conv.session_id, e)
                          }
                          title="Delete conversation"
                        />
                      </div>
                    </div>
                  );
                })} 
              </>
            )} */}
              </div>
            </div>
          </div>

          <div className="bottom">
            <div className="bottom-item" onClick={handleAttachCLick}>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <p>Upload Document</p>
              <MdAttachment color="#48454F" />
            </div>
            <br />
            <div className="bottom-item">
              <FaUser className="user-icon" />
              <p>User Profile</p>
              <FaCog className="settings-icon" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
