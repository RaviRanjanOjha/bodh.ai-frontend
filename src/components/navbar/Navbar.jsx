// import { useTheme } from '../context/ThemeContext';
import { SidebarHeader, SidebarNav, SidebarProfile } from "./index";
import UploadDocument from "../Upload_Document/UploadDocument";
import { useIsMobile } from "../../hooks/useIsMobile";

const Navbar = ({ collapsed }) => {
  // const { isDarkMode } = useTheme();
  const { isDarkMode } = false;

  const isMobileView = useIsMobile();

  const mobileViewStyle =
    isMobileView && !collapsed
      ? "shadow-2xl shadow-gray-950/90 relative z-50"
      : undefined;
  return (
    <div
      className={`min-h-screen flex flex-col transition-all duration-300 overflow-y-auto border-r border-gray-200 dark:border-gray-200 shadow-sm overflow-x-hidden ${
        isMobileView && !collapsed ? "flex-6" : ""
      } ${collapsed ? "w-[70px]" : "w-[290px]"} ${
        isDarkMode
          ? `bg-[rgb(229,223,211)] text-[#fff] ${mobileViewStyle}`
          : `bg-[rgb(246,242,234)] text-[#2E2E2E] ${mobileViewStyle}`
      }`}
    >
      <SidebarHeader collapsed={collapsed} />
      <SidebarNav collapsed={collapsed} />
      {/* <UploadDocument collapsed={collapsed} /> */}
      <SidebarProfile collapsed={collapsed} />
    </div>
  );
};

export default Navbar;
