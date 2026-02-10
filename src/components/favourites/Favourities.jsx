import { useContext, useCallback } from "react";
import {
  List,
  ListItem,
  Card,
  Typography,
  ListItemSuffix,
  ListItemPrefix,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  FaTrash,
  FaStar,
  FaEllipsisH,
  FaRegLightbulb,
  FaBolt,
  FaChartLine,
  FaChartPie,
  FaDollarSign,
  FaChartBar,
  FaFileAlt,
  FaMagic,
  FaCoins, FaCubes, FaRainbow, FaRandom
} from "react-icons/fa";
import { Context } from "../../context/Context";
import useSideNavStore from "../../store/useSideNavStore";
import { useIsMobile } from "./../../hooks/useIsMobile";
import { assets } from "../../assets/assets";
import "./Favourities.css";
import LoadingConversationsSkeleton from "../dashboard/LoadingConversationsSkeleton";

const CHAT_ICONS = [FaChartLine, FaChartPie, FaCoins, FaCubes, FaRainbow, FaRandom ];

const Favourities = () => {
  const {
    favorites,
    favoritesLoading,
    favoritesError,
    searchQuery,
    fetchConversationDetails,
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
        if (success) await fetchHistory();
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
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
        if (success) await fetchHistory();
      } catch (error) {
        console.error("Failed to delete conversation:", error);
        alert("Failed to delete conversation. Please try again.");
      }
    },
    [deleteConversationById, fetchHistory],
  );

  return (
    <Card className="qq-card bg-white border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)] transition-shadow duration-200">
      <div
        className="flex flex-col h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-3 pt-3 pb-4">
          <FaBolt
            className="h-4 w-4 text-red-500 flex-shrink-0"
            aria-hidden="true"
          />

          <Typography variant="medium" className="font-medium text-gray-800">
            Quick Queries
          </Typography>
        </div>

        {/* Error message inline (card remains visible) */}
        {favoritesError && (
          <Typography variant="small" className="text-red-500 px-3 pb-2">
            Error loading Quick Queries
          </Typography>
        )}

        {/* Empty message inline (card remains visible) */}
        {!favoritesLoading &&
          (!favorites || favorites.length === 0) &&
          !favoritesError && (
            <Typography variant="small" className="text-gray-400 px-3 pb-2">
              {searchQuery
                ? `No conversations found matching "${searchQuery}"`
                : "No conversations yet"}
            </Typography>
          )}

        <div className="flex-1 px-3 pb-3 overflow-hidden">
          <List className="py-0">
            {/* ✅ Loading state inside the card */}
            {favoritesLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <ListItem
                    key={i}
                    className="divider rounded-none text-sm py-2"
                  >
                    <LoadingConversationsSkeleton />
                  </ListItem>
                ))
              : favorites?.map((chat, index) => {
                  const ChatIcon = CHAT_ICONS[index % CHAT_ICONS.length];

                  return (
                    <ListItem
                      key={chat.session_id}
                      className="divider rounded-none text-sm flex gap-2 items-center py-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ChatIcon className="text-gray-600 w-4 h-4 flex-shrink-0" />

                      <ListItemPrefix
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSkeleton(true);
                          fetchConversationDetails(chat.session_id);
                          // If you don't want auto-collapse on mobile, remove the next line:
                          if (isMobileView && !isNavigationCollapsed)
                            setToggleNavigation();
                        }}
                        className="truncate cursor-pointer"
                        title={chat.summary}
                      >
                        {chat.summary}
                      </ListItemPrefix>
                    </ListItem>
                  );
                })}
          </List>
        </div>
      </div>
    </Card>
  );
};

export default Favourities;
