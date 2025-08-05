import React, { useState, useEffect } from "react";
import { useCallback, useContext } from "react";
import { Context } from "../../context/Context";
import { FaTrash, FaStar, FaEnvelope } from "react-icons/fa";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import "./collapseHistory.css";

const DateAccordion = ({
  history = [],
  historyLoading,
  historyError,
  selectedConversation,
  fetchConversationDetails,
  assets = { message_icon: "" },
  formatDate = (date) => date,
  searchQuery = "",
}) => {
  const {
    fetchHistory,
    deleteConversationById,
    fetchFavorites,
    favorites,
    toggleFavorite,
  } = useContext(Context);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuConvId, setMenuConvId] = useState(null);
  const [menuSection, setMenuSection] = useState(null);

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
    if (action === "Favourite" || action === "Unfavourite") {
      handleToggleFavorite(menuConvId);
    }
    console.log("Action:", action);
    handleMenuClose();
  };

  const handleToggleFavorite = useCallback(
    async (sessionId) => {
      if (!sessionId) return;

      try {
        const success = await toggleFavorite(sessionId);
        if (success) {
          console.log("⭐ Favorite toggled successfully");
          // Refresh history to ensure sync
          await fetchHistory();
        }
      } catch (error) {
        console.error("❌ Failed to toggle favorite:", error);
        alert("Failed to toggle favorite. Please try again.");
      }
    },
    [toggleFavorite, fetchHistory]
  );

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

  // Function to highlight search query in text
  const highlightSearchQuery = (text, query) => {
    if (!query || !text) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span
          key={index}
          style={{
            backgroundColor: "#ffd700",
            color: "#000",
            padding: "0 2px",
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
    "Last 30 Days": [],
  };

  if (!searchQuery) {
    history.forEach((conv) => {
      const updated = new Date(conv.updated_at || conv.timestamp);
      const now = new Date();
      const diff = (now - updated) / (1000 * 60 * 60 * 24);

      if (diff < 1) groupedHistory.Today.push(conv);
      else if (diff < 2) groupedHistory.Yesterday.push(conv);
      else groupedHistory["Last 30 Days"].push(conv);
    });

    // Add favorites to the Favorites group
    favorites.forEach((conv) => {
      groupedHistory.Favorites.push(conv);
    });
  }

  const renderConversations = (convs, sectionLabel) => {
    if (historyLoading)
      return (
        <Box
          sx={{
            background: "#1e1e1e",
            display: "flex",
            alignItems: "center",
            color: "#e0e0e0",
          }}
        >
          <CircularProgress size={20} sx={{ mr: 1, color: "#90caf9" }} />
          <Typography>Loading conversations...</Typography>
        </Box>
      );
    if (historyError)
      return (
        <Typography sx={{ color: "error.main" }}>
          Error loading history
        </Typography>
      );
    if (convs.length === 0) {
      if (searchQuery) {
        return (
          <Typography
            sx={{
              color: "#aaa",
              textAlign: "center",
            }}
          >
            No conversations found matching "{searchQuery}"
          </Typography>
        );
      }
      return (
        <Typography sx={{ px: 2, py: 2, color: "#aaa" }}>
          No conversations yet
        </Typography>
      );
    }

    return (
      <List disablePadding>
        {convs.map((conv) => {
          const validMessages = Array.isArray(conv.messages)
            ? conv.messages.filter((msg) => msg?.content)
            : [];
          const messageCount = validMessages.length;
          const lastMessage =
            validMessages[validMessages.length - 1]?.content || "";

          return (
            <ListItem
              key={conv.session_id}
              sx={{
                bgcolor:
                  selectedConversation?.session_id === conv.session_id
                    ? "#2c2c2c"
                    : "#1e1e1e",
                boxShadow:
                  selectedConversation?.session_id === conv.session_id ? 1 : 0,
                transition: "background 0.2s",
                cursor: "pointer",
                color: "#e0e0e0",
                "&:hover": {
                  bgcolor: "#333",
                },
              }}
              onClick={() => fetchConversationDetails(conv.session_id)}
              secondaryAction={
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuOpen(e, conv.session_id, sectionLabel);
                  }}
                  sx={{ color: "#ccc" }}
                >
                  <MoreHorizIcon />
                </IconButton>
              }
            >
              <ListItemIcon className="chat-icon" sx={{ minWidth: 36 }}>
                {assets.message_icon ? (
                  <img
                    src={assets.chat}
                    alt="chat"
                    style={{ width: 16, height: 16 }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: "#333",
                      borderRadius: "50%",
                    }}
                  />
                )}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography className="conv-summary">
                    {highlightSearchQuery(
                      conv.summary || "New conversation",
                      searchQuery
                    )}
                  </Typography>
                }
                secondary={
                  <Box>
                    {messageCount > 0 && (
                      <Typography
                        variant="caption"
                        sx={{ mr: 1, color: "#aaa" }}
                      >
                        {messageCount}{" "}
                        {messageCount === 1 ? "message" : "messages"}
                      </Typography>
                    )}
                    <Typography
                      variant="caption"
                      sx={{ color: "#888" }}
                    ></Typography>
                    {lastMessage && (
                      <Typography
                        variant="body2"
                        sx={{
                          display: "block",
                          color: "#aaa",
                          mt: 0.5,
                          fontSize: 13,
                        }}
                      >
                        {highlightSearchQuery(
                          lastMessage.substring(0, 60) +
                            (lastMessage.length > 60 ? "..." : ""),
                          searchQuery
                        )}
                      </Typography>
                    )}
                  </Box>
                }
              />
            </ListItem>
          );
        })}
      </List>
    );
  };

  // Load favorites when component mounts
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return (
    <Box
      sx={{
        maxWidth: 480,
        color: "#e0e0e0",
      }}
    >
      {searchQuery ? (
        // If searching, show search results without accordion grouping
        <Box>
          <Typography
            variant="h6"
            sx={{
              color: "red",
              fontSize: "1.1rem",
              fontWeight: "bold",
              borderBottom: "1px solid #333",
            }}
          >
            Search Results
          </Typography>
          <Box sx={{ maxHeight: "60vh", overflowY: "auto" }}>
            {renderConversations(history)}
          </Box>
        </Box>
      ) : (
        Object.entries(groupedHistory).map(([label, convs]) => (
          <Accordion
            key={label}
            sx={{
              color: "#e0e0e0",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: "#e0e0e0" }} />}
              sx={{
                background: "#221F20",
                borderBottom: "1px solid #554E4E",
                minHeight: 52,
                "& .MuiAccordionSummary-content": { my: 0.5 },
              }}
            >
              <Typography sx={{ color: "#e0e0e0" }}>{label}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              {renderConversations(convs, label)}
            </AccordionDetails>
          </Accordion>
        ))
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            bgcolor: "#2c2c2c",
            color: "#e0e0e0",
          },
        }}
      >
        {menuSection === "Favorites" ? (
          <MenuItem
            onClick={() => handleAction("Unfavourite")}
            sx={{
              fontSize: "14px",
              "&:hover": { bgcolor: "#404040" },
            }}
          >
            <FaStar style={{ marginRight: "8px", fontSize: "12px" }} />
            Unfavourite
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => handleAction("Favourite")}
            sx={{
              fontSize: "14px",
              "&:hover": { bgcolor: "#404040" },
            }}
          >
            <FaStar style={{ marginRight: "8px", fontSize: "12px" }} />
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
            fontSize: "14px",
            "&:hover": { bgcolor: "#404040" },
          }}
        >
          <FaTrash style={{ marginRight: "8px", fontSize: "12px" }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default DateAccordion;
