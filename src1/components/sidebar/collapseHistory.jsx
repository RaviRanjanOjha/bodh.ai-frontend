import React, { useState, useEffect } from 'react';
import { useCallback, useContext } from 'react';
import { Context } from '../../context/Context';
import {
  FaTrash,
  FaStar,
  FaEnvelope,
  FaAngleUp,
  FaEllipsisH,
} from 'react-icons/fa';

import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  Spinner,
} from '@material-tailwind/react';
import './collapseHistory.css';

const DateAccordion = ({
  history = [],
  historyLoading,
  historyError,
  selectedConversation,
  fetchConversationDetails,
  assets = { message_icon: '' },
  formatDate = (date) => date,
  searchQuery = '',
}) => {
  const {
    fetchHistory,
    deleteConversationById,
    fetchFavorites,
    favorites,
    toggleFavorite,
  } = useContext(Context);

  const [openAccordions, setOpenAccordions] = useState({
    1: false, // Favorites
    2: false, // Today
    3: false, // Yesterday
    4: false, // Last 30 Days
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);
  const [menuConvId, setMenuConvId] = useState(null);
  const [menuSection, setMenuSection] = useState(null);

  const handleAccordionOpen = (value) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [value]: !prev[value],
    }));
  };

  const handleMenuOpen = (event, convId, section) => {
    event.stopPropagation(); // Prevent triggering the conversation click
    setAnchorEl(event.currentTarget);
    setMenuConvId(convId);
    setMenuSection(section);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuConvId(null);
  };

  const handleAction = (action) => {
    if (action === 'Favourite' || action === 'Unfavourite') {
      handleToggleFavorite(menuConvId);
    }
    console.log('Action:', action);
    handleMenuClose();
  };

  const handleToggleFavorite = useCallback(
    async (sessionId) => {
      if (!sessionId) return;

      try {
        const success = await toggleFavorite(sessionId);
        if (success) {
          console.log('⭐ Favorite toggled successfully');
          // Refresh history to ensure sync
          await fetchHistory();
        }
      } catch (error) {
        console.error('❌ Failed to toggle favorite:', error);
        alert('Failed to toggle favorite. Please try again.');
      }
    },
    [toggleFavorite, fetchHistory]
  );

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
          // Optionally refresh history to ensure sync
          await fetchHistory();
        }
      } catch (error) {
        console.error('❌ Failed to delete conversation:', error);
        alert('Failed to delete conversation. Please try again.');
      }
    },
    [deleteConversationById, fetchHistory]
  );

  // Function to highlight search query in text
  const highlightSearchQuery = (text, query) => {
    if (!query || !text) return text;

    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          style={{
            backgroundColor: '#ffd700',
            color: '#000',
            padding: '0 2px',
          }}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  // Group conversations by date (replace with your actual grouping logic if needed)
  const groupedHistory = {
    Favorites: [],
    Today: [],
    Yesterday: [],
    'Last 30 Days': [],
  };

  if (!searchQuery) {
    history.forEach((conv) => {
      const updated = new Date(conv.updated_at || conv.timestamp);
      const now = new Date();
      const diff = (now - updated) / (1000 * 60 * 60 * 24);

      if (diff < 1) groupedHistory.Today.push(conv);
      else if (diff < 2) groupedHistory.Yesterday.push(conv);
      else groupedHistory['Last 30 Days'].push(conv);
    });

    // Add favorites to the Favorites group
    favorites.forEach((conv) => {
      groupedHistory.Favorites.push(conv);
    });
  }

  const renderConversations = (convs, sectionLabel, sectionId) => {
    if (historyLoading)
      return (
        <div className="flex items-center p-4 bg-gray-800 text-gray-300">
          <Spinner className="h-5 w-5 mr-2" />
          <Typography variant="small">Loading conversations...</Typography>
        </div>
      );
    if (historyError)
      return (
        <Typography variant="small" className="text-red-500 p-4">
          Error loading history
        </Typography>
      );
    if (convs.length === 0) {
      if (searchQuery) {
        return (
          <Typography variant="small" className="text-gray-400 text-center p-4">
            No conversations found matching "{searchQuery}"
          </Typography>
        );
      }
      return (
        <Typography variant="small" className="text-gray-400 p-4">
          No conversations yet
        </Typography>
      );
    }

    return (
      <div>
        {convs.map((conv) => {
          const validMessages = Array.isArray(conv.messages)
            ? conv.messages.filter((msg) => msg?.content)
            : [];
          const messageCount = validMessages.length;
          const lastMessage =
            validMessages[validMessages.length - 1]?.content || '';

          return (
            <div
              key={conv.session_id}
              className={`flex items-center p-3 cursor-pointer transition-colors hover:bg-gray-700 ${
                selectedConversation?.session_id === conv.session_id
                  ? 'bg-gray-700 shadow-lg'
                  : 'bg-gray-800'
              }`}
              onClick={() => fetchConversationDetails(conv.session_id)}
              // secondaryAction={
              //   <button
              //     onClick={(e) => {
              //       e.stopPropagation();
              //       handleMenuOpen(e, conv.session_id, sectionLabel);
              //     }}
              //     sx={{ color: '#ccc' }}
              //   >
              //     <FaEllipsisH />
              //   </button>
              // }
            >
              {/* Chat Icon */}
              <div className="flex-shrink-0 mr-3">
                {assets.message_icon ? (
                  <img src={assets.chat} alt="chat" className="w-4 h-4" />
                ) : (
                  <div className="w-6 h-6 bg-gray-600 rounded-full" />
                )}
              </div>

              {/* Conversation Content */}
              <div className="flex-grow min-w-0">
                <Typography
                  variant="small"
                  className="text-gray-200 font-medium truncate"
                >
                  {highlightSearchQuery(
                    conv.summary || 'New conversation',
                    searchQuery
                  )}
                </Typography>
                <div className="flex items-center mt-1">
                  {messageCount > 0 && (
                    <Typography
                      variant="small"
                      className="text-gray-400 mr-2 text-xs"
                    >
                      {messageCount}{' '}
                      {messageCount === 1 ? 'message' : 'messages'}
                    </Typography>
                  )}
                </div>

                {lastMessage && (
                  <Typography
                    variant="small"
                    className="text-gray-400 text-xs mt-1 truncate"
                  >
                    {highlightSearchQuery(
                      lastMessage.substring(0, 60) +
                        (lastMessage.length > 60 ? '...' : ''),
                      searchQuery
                    )}
                  </Typography>
                )}

                {/* <div className="ml-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpen(true);
                      handleMenuOpen(e, conv.session_id, sectionLabel);
                      console.log(menuOpen);
                    }}
                    sx={{ color: '#ccc' }}
                  >
                    <FaEllipsisH />
                  </button>
                </div> */}
              </div>

              {/* Menu Button */}
              <div className="flex-shrink-0 ml-3 z-999">
                <Menu
                  open={menuOpen === `${sectionId}${conv.session_id}`}
                  handler={setMenuOpen}
                  placement="bottom-end"
                >
                  <MenuHandler>
                    <div className="ml-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpen(`${sectionId}${conv.session_id}`);
                          handleMenuOpen(e, conv.session_id, sectionLabel);
                          console.log(menuOpen);
                        }}
                        sx={{ color: '#ccc' }}
                      >
                        <FaEllipsisH />
                      </button>
                    </div>
                  </MenuHandler>
                  <MenuList className="bg-gray-700 border-gray-600">
                    {menuSection === 'Favorites' ? (
                      <MenuItem
                        className="text-gray-200 hover:bg-gray-600 flex items-center gap-2"
                        onClick={() => handleAction('Unfavourite')}
                      >
                        <FaStar className="h-3 w-3" />
                        Unfavourite
                      </MenuItem>
                    ) : (
                      <MenuItem
                        className="text-gray-200 hover:bg-gray-600 flex items-center gap-2"
                        onClick={() => handleAction('Favourite')}
                      >
                        <FaStar className="h-3 w-3" />
                        Favourite
                      </MenuItem>
                    )}
                    <MenuItem
                      className="text-gray-200 hover:bg-gray-600 flex items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(menuConvId, e);
                        setMenuOpen(false);
                      }}
                    >
                      <FaTrash className="h-3 w-3" />
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Load favorites when component mounts
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const accordionSections = [
    { id: 1, label: 'Favorites', conversations: groupedHistory.Favorites },
    { id: 2, label: 'Today', conversations: groupedHistory.Today },
    { id: 3, label: 'Yesterday', conversations: groupedHistory.Yesterday },
    {
      id: 4,
      label: 'Last 30 Days',
      conversations: groupedHistory['Last 30 Days'],
    },
  ];

  return (
    <div className="w-full max-w-md text-gray-200">
      {/* <Accordian /> */}
      {searchQuery ? (
        // If searching, show search results without accordion grouping
        <div>
          <h6
            style={{
              color: 'red',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderBottom: '1px solid #333',
            }}
          >
            Search Results
          </h6>
          <div sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
            {renderConversations(history)}
          </div>
        </div>
      ) : (
        <div className="space-y-1">
          {accordionSections.map((section) => (
            <Accordion
              key={section.id}
              open={openAccordions[section.id]}
              className="mb-2 rounded-lg border border-gray-600 bg-gray-800"
            >
              <AccordionHeader
                onClick={() => handleAccordionOpen(section.id)}
                className={`border-b-0 transition-colors px-4 py-3 ${
                  openAccordions[section.id]
                    ? 'text-blue-400 hover:!text-blue-300'
                    : 'text-gray-300 hover:!text-gray-100'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Typography variant="h6" className="text-inherit">
                    {section.label}
                  </Typography>
                  <FaAngleUp
                    className={`h-4 w-4 transition-transform ${
                      openAccordions[section.id] ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </AccordionHeader>
              <AccordionBody className="pt-0 px-0 pb-0">
                {renderConversations(
                  section.conversations,
                  section.label,
                  section.id
                )}
              </AccordionBody>
            </Accordion>
          ))}
        </div>
      )}

      {/* <div
        style={{
          bgcolor: '#2c2c2c',
          color: '#e0e0e0',
        }}
      >
        {Boolean(anchorEl) && (
          <select>
            <option
              style={{
                fontSize: '14px',
                '&:hover': { bgcolor: '#404040' },
              }}
              onClick={() =>
                handleAction(
                  menuSection === 'Favorites' ? 'Unfavourite' : 'Favourite'
                )
              }
            >
              {' '}
              <FaStar style={{ marginRight: '8px', fontSize: '12px' }} />{' '}
              {menuSection === 'Favorites' ? 'Unfavourite' : 'Favourite'}
            </option>
            <option
              style={{
                fontSize: '14px',
                '&:hover': { bgcolor: '#404040' },
              }}
            >
              <FaTrash style={{ marginRight: '8px', fontSize: '12px' }} />{' '}
              Delete
            </option>
          </select>
        )}
      </div> */}
      {/* <Menu
        anchorEl={anchorEl}
        open={false}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            bgcolor: '#2c2c2c',
            color: '#e0e0e0',
          },
        }}
      >
        {menuSection === 'Favorites' ? (
          <MenuItem
            onClick={() => handleAction('Unfavourite')}
            sx={{
              fontSize: '14px',
              '&:hover': { bgcolor: '#404040' },
            }}
          >
            <FaStar style={{ marginRight: '8px', fontSize: '12px' }} />
            Unfavourite
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => handleAction('Favourite')}
            sx={{
              fontSize: '14px',
              '&:hover': { bgcolor: '#404040' },
            }}
          >
            <FaStar style={{ marginRight: '8px', fontSize: '12px' }} />
            Favourite
          </MenuItem>
        )}
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteConversation(menuConvId, e);
            handleMenuClose();
          }}
          sx={{
            fontSize: '14px',
            '&:hover': { bgcolor: '#404040' },
          }}
        >
          <FaTrash style={{ marginRight: '8px', fontSize: '12px' }} />
          Delete
        </MenuItem>
      </Menu> */}
    </div>
  );
};

export default DateAccordion;
