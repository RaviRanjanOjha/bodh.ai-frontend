import { useContext, useCallback } from "react";
import React from "react";
import "./RecentHistory.css";
import {
  List,
  ListItem,
  Card,
  Spinner,
  Typography,
  ListItemSuffix,
  ListItemPrefix,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { FaTrash, FaStar, FaEllipsisH, FaHistory } from "react-icons/fa";
import { Context } from "../../context/Context";
import LoadingConversationsSkeleton from "../dashboard/LoadingConversationsSkeleton";
import useSideNavStore from "../../store/useSideNavStore";
import { useIsMobile } from "../../hooks/useIsMobile";

const RecentHistory = () => {
  const {
    history,
    isChatHistoryLoading,
    hasChatHistoryError,
    fetchConversationDetails,
    searchQuery,
    toggleFavorite,
    fetchHistory,
    deleteConversationById,
    setShowSkeleton,
  } = useContext(Context);

  const { isNavigationCollapsed, setToggleNavigation } = useSideNavStore();
  const isMobileView = useIsMobile();

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
    [toggleFavorite, fetchHistory],
  );

  const handleDeleteConversation = useCallback(
    async (sessionId) => {
      const confirmed = window.confirm(
        "Are you sure you want to delete this conversation? This action cannot be undone.",
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
    [deleteConversationById, fetchHistory],
  );

  if (isChatHistoryLoading) {
    return (
      <div className="flex items-center ">
        {/* <Spinner className="h-5 w-5 mr-2" /> */}
        {/* <Typography variant="small" className='animate-bounce'>...</Typography> */}

        {/* Dots loading */}
        {/* <LoadingDots></LoadingDots> */}

        {/* Skeleton Loader */}
        <Card className="h-auto max-h-[150px] w-60 overflow-hidden overflow-y-auto bg-[rgba(223,208,233,0.45)] rounded-lg card-border scroll-hide">
          <List>
            {/* Loader 1 */}
            <ListItem className="divider rounded-none text-sm flex flex-col justify-between">
              <LoadingConversationsSkeleton></LoadingConversationsSkeleton>
            </ListItem>

            {/* Loader 2 */}
            <ListItem className="divider rounded-none text-sm flex flex-col justify-between">
              <LoadingConversationsSkeleton></LoadingConversationsSkeleton>
            </ListItem>
          </List>
        </Card>
      </div>
    );
  }

  if (hasChatHistoryError)
    return (
      <Typography variant="small" className="text-red-500 p-4">
        Error loading history
      </Typography>
    );

  if (history.length === 0) {
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
    <Card className="rh-card overflow-hidden overflow-y-auto scroll-hide bg-white border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-shadow duration-200">
      <div
        className="flex flex-col h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-3 pt-3 pb-4">
          <FaHistory
            className="h-4 w-4 text-red-500 flex-shrink-0"
            aria-hidden="true"
          />

          <Typography variant="medium" className="font-medium text-gray-800">
            Recent History
          </Typography>
        </div>
        <div className="flex-1 px-3 pb-3">
        <List>
          {history.map((chat) => {
            return (
              
              <ListItem
                className="divider rounded-none text-sm flex justify-between"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <ListItemPrefix
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSkeleton(true);
                    fetchConversationDetails(chat.session_id);
                    isMobileView &&
                      !isNavigationCollapsed &&
                      setToggleNavigation();
                  }}
                >
                  {chat.summary}{" "}
                </ListItemPrefix>
                <ListItemSuffix>
                  <Menu lockScroll={true}>
                    <MenuHandler>
                      <div className="ml-3">
                        <button className="p-1">
                          <FaEllipsisH />
                        </button>
                      </div>
                    </MenuHandler>
                    <MenuList className="bg-[#ece3f2] border-slate-400 rounded-md w-38">
                      <MenuItem
                        className="text-gray-700 hover:bg-gray-300 flex items-center gap-2 p-1"
                        onClick={() => handleToggleFavorite(chat.session_id)}
                      >
                        <FaStar className="h-3 w-3 text-gray-700" />
                        Quick Queries
                      </MenuItem>
                      <MenuItem
                        className="text-gray-700 hover:bg-gray-300 flex items-center gap-2 p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteConversation(chat.session_id);
                        }}
                      >
                        <FaTrash className="h-3 w-3 text-gray-700" />
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </ListItemSuffix>
              </ListItem>
            );
          })}
        </List>
        </div>
      </div>
    </Card>
  );
};

export default React.memo(RecentHistory);
