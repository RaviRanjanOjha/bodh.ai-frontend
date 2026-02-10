import { useState, useContext, useEffect } from 'react';
import { SidebarNavItem } from './index';
import { NAVBAR_ITEM_LIST } from '../../constants';
import { Context } from '../../context/Context';
import useSideNavStore from '../../store/useSideNavStore';
import UploadDocument from '../Upload_Document/UploadDocument';
import { useIsMobile } from '../../hooks/useIsMobile';

const SidebarNav = ({ collapsed }) => {
  const [navItems, setNavItems] = useState(NAVBAR_ITEM_LIST);
  const { isNavigationCollapsed, setToggleNavigation } = useSideNavStore();
  const isMobileView = useIsMobile();
  const { fetchFavorites, newChat, fetchHistory } = useContext(Context);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleNewChat = async () => {
    isMobileView && !isNavigationCollapsed && setToggleNavigation();
    newChat();
    await fetchHistory();
  };

  const onClickHandler = (index) => {
    if (navItems[index].navId === 'new_chat') {
      return handleNewChat();
    }
    const prevNavList = [...navItems];
    const preIsActiveValue = prevNavList[index].isActive;

    prevNavList[index] = {
      ...prevNavList[index],
      isActive: !preIsActiveValue,
    };

    setNavItems(prevNavList);
    isNavigationCollapsed && setToggleNavigation();
  };

  return (
    <nav
      className={`mt-10 flex flex-col space-y-3 px-[22px] pb-[22px] ${
        collapsed ? 'p-0' : 'px-[22px]'
      }`}
    >
      <ul className="flex flex-col gap-2 h-full">
        {navItems.map((item, index) => (
          <SidebarNavItem
            key={index}
            index={index}
            {...item}
            collapsed={collapsed}
            isActive={item.isActive}
            onClick={onClickHandler}
            hideOuterHeader={item.navId === 'favorities' || item.navId === 'recent_history'}
          >
            {item.children && <item.children />}
          </SidebarNavItem>
        ))}
        
        {/* Upload Document Component */}
        <UploadDocument collapsed={collapsed}></UploadDocument>
      </ul>
    </nav>
  );
};

export default SidebarNav;
