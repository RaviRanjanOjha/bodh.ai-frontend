import Main from "./components/main/Main";
import Sidebar from "./components/sidebar/Sidebar";
import "./App.css";
import { useState } from "react";

const App = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <div className="layout">
      <Sidebar isVisible={isSidebarVisible} />
      <Main
        isSidebarVisible={isSidebarVisible}
        toggleSidebar={() => setIsSidebarVisible((prev) => !prev)}
      />
    </div>
  );
};

export default App;
