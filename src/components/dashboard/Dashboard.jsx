import React from "react";
// import { useTheme } from "../context/ThemeContext";
import {DashboardHeader, DashboardContent} from "./index";

const Dashboard = ({ toggleSidebar }) => {
    //   const { isDarkMode } = useTheme();
    const { isDarkMode } = false;

    return (
        <div className={`h-full ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-[rgba(0, 0, 0, 0.7)]"}`}>
            <DashboardHeader toggleSidebar={toggleSidebar} />
            <DashboardContent />
        </div>
    );
};

export default Dashboard;
