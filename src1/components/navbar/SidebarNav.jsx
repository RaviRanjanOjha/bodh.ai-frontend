import { useState, useContext, useEffect } from 'react';
import { SidebarNavItem } from './index';
import { NAVBAR_ITEM_LIST } from '../../constants';
import { Context } from '../../context/Context';
import useSideNavStore from '../../store/useSideNavStore';
import UploadDocument from '../Upload_Document/UploadDocument';

const SidebarNav = ({ collapsed }) => {
  const [navItems, setNavItems] = useState(NAVBAR_ITEM_LIST);
  const { isNavigationCollapsed, setToggleNavigation } = useSideNavStore();

  const { fetchFavorites, newChat, fetchHistory } = useContext(Context);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const handleNewChat = async () => {
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
      className={`mt-4 flex flex-col space-3 ${collapsed ? 'p-0' : 'px-[22px]'
        }`}
    >
      <ul
        className='flex flex-col gap-5 items-center'
      >
        {navItems.map((item, index) => (
          <SidebarNavItem
            key={index}
            index={index}
            {...item}
            collapsed={collapsed}
            isActive={item.isActive}
            onClick={onClickHandler}
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
