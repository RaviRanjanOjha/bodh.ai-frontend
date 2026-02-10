import React from 'react';
// import { useTheme } from "../context/ThemeContext";
import { DashboardHeader, DashboardContent } from './index';
import { useIsMobile } from '../../hooks/useIsMobile';

const Dashboard = ({ toggleSidebar, collapsed }) => {
  //   const { isDarkMode } = useTheme();
  const { isDarkMode } = false;
  const isMobileView = useIsMobile();

  let backgroundColor = isDarkMode
    ? 'bg-gray-900 text-white'
    : 'bg-[#fafafa] text-[rgba(0, 0, 0, 0.7)]';

  if (isMobileView && !collapsed) {
    backgroundColor = isDarkMode
      ? 'bg-gray-900 text-white'
      : 'bg-gray-300 text-gray-300';
  }

  return (
    <div className={`h-full ${backgroundColor} `}>
      <DashboardHeader toggleSidebar={toggleSidebar} />
      <DashboardContent />
    </div>
  );
};

export default Dashboard;
