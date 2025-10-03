import { useState, useRef } from 'react';
import { assets } from '../../assets/assets';
import { useContext, useCallback } from 'react';
import { Context } from '../../context/Context';
import {
  FaPlus,
  FaSearch,
  FaUser,
  FaCog,
  FaTrash,
  FaGreaterThan,
} from 'react-icons/fa';
import { MdAttachment } from 'react-icons/md';
import { debounce } from '../../utils/chatUtils';
import { CHAT_CONFIG, UI_CONFIG } from '../../constants';
import DateAccordion from './collapseHistory';
import './sidebar.css';

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
        console.warn('Invalid date string:', dateString);
        return '';
      }

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      });
    } catch (error) {
      console.warn('Date parsing error:', error);
      return '';
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
        'Are you sure you want to delete this conversation? This action cannot be undone.'
      );

      if (!confirmed) return;

      try {
        const success = await deleteConversationById(sessionId);
        if (success) {
          console.log('✅ Conversation deleted successfully');
          await fetchHistory();
        }
      } catch (error) {
        console.error('❌ Failed to delete conversation:', error);
        alert('Failed to delete conversation. Please try again.');
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
        />
      )}
      <div className={`sidebarouter ${isCollapsed ? 'collapsed' : ''}`}>
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
              </div>
            </div>
          </div>

          <div className="bottom">
            <div className="bottom-item" onClick={handleAttachCLick}>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: 'none' }}
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
