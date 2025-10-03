import { useContext, useCallback } from 'react';
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
} from '@material-tailwind/react';
import { FaTrash, FaStar, FaEllipsisH } from 'react-icons/fa';
import { Context } from '../../context/Context';
import LoadingConversationsSkeleton from '../dashboard/LoadingConversationsSkeleton';

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
    async (sessionId) => {
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

  if (favoritesLoading)
    return (
      <div className="flex items-center">
        {/* <Spinner className="h-5 w-5 mr-2" />
        <Typography variant="small">Loading conversations...</Typography> */}

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

  if (favoritesError)
    return (
      <Typography variant="small" className="text-red-500 p-4">
        Error loading Favourites
      </Typography>
    );

  if (favorites.length === 0) {
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
    <Card className="h-auto max-h-[200px] w-60 overflow-hidden overflow-y-auto bg-[rgba(223,208,233,0.45)] rounded-lg card-border scroll-hide">
      <List>
        {favorites.map((chat) => {
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
                }}
              >
                {chat.summary}{' '}
              </ListItemPrefix>
              <ListItemSuffix>
                <Menu lockScroll={true}>
                  <MenuHandler>
                    <div className="ml-3">
                      <button className='p-1'>
                        <FaEllipsisH />
                      </button>
                    </div>
                  </MenuHandler>
                  <MenuList className="bg-[#ece3f2] border-slate-400 rounded-md w-38">
                    <MenuItem
                      className="text-gray-700 hover:bg-gray-300 flex items-center gap-2 p-1"
                      onClick={() => handleToggleFavorite(chat.session_id)}
                    >
                      <FaStar className="h-3 w-3" />
                      Unfavourite
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
    </Card>
  );
};

export default Favourities;
