// import { useTheme } from '../context/ThemeContext';
import { SidebarHeader, SidebarNav, SidebarProfile } from "./index"
import UploadDocument from '../Upload_Document/UploadDocument';

const Navbar = ({ collapsed }) => {
  // const { isDarkMode } = useTheme();
  const { isDarkMode } = false;

  return (
    <div
      className={`h-auto flex flex-col justify-between transition-all duration-300 gap-8 overflow-x-scroll scroll-hide ${collapsed ? 'w-[70px]' : 'w-[230px]'
        } ${isDarkMode
          ? 'bg-[rgba(223,208,233,0.45)] text-[#fff]'
          : 'bg-[rgba(223,208,233,0.45)] text-[#2E2E2E]'
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
