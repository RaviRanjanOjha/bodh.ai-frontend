import React from "react";
// import { useTheme } from "../context/ThemeContext";
import { assets } from "../../assets/assets";

const ThemeToggleButton = () => {
    //   const { isDarkMode, toggleTheme } = useTheme();
    const { isDarkMode } = false;

    return (
        <button
            // onClick={toggleTheme}
            className="p-2 bg-transparent text-gray-600 border border-[#DFD0E9] rounded-full hover:bg-gray-200"
            aria-label="Toggle Theme"
        >
            <img
                src={isDarkMode ? assets.light_mode : assets.dark_mode}
                alt="Toggle Theme"
            />
        </button>
    );
};

export default ThemeToggleButton;
