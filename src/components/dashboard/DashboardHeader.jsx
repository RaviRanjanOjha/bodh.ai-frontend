import { assets } from "../../assets/assets";
import { IconButton, ThemeToggleButton } from "./index";

const DashboardHeader = ({ toggleSidebar }) => (
  <div className="flex items-center justify-between p-2 sm:p-3 sm:h-[10vh] h-[8vh] bg-[rgb(246,242,234)] border-b border-gray-200 dark:border-gray-200 shadow-sm">
    {/* Hamburger Icon */}
    <button
      onClick={toggleSidebar}
      className="p-2 bg-transparent text-gray-600 rounded-full hover:bg-gray-200"
      aria-label="Toggle Sidebar"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>

    <div className="flex gap-2 sm:gap-4">
      <IconButton icon={assets.share} alt="Share" ariaLabel="Share" />
      <ThemeToggleButton />
      <IconButton icon={assets.settings} alt="Settings" ariaLabel="Settings" />
    </div>
  </div>
);

export default DashboardHeader;
