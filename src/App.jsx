import './App.css';
import Navbar from './components/navbar/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import useSideNavStore from './store/useSideNavStore';
import { useContext, useEffect } from 'react';
import { Context } from './context/Context';
import FileUpload from './components/fileUpload/fileUpload';
import { useIsMobile } from './hooks/useIsMobile';

const App = () => {
  const { isNavigationCollapsed, setToggleNavigation } = useSideNavStore();
  const { isUploadModalOpen } = useContext(Context);
  const isMobileView = useIsMobile();

  useEffect(() => {
    // For mobile view, close side nav on initial load
    isMobileView && !isNavigationCollapsed && setToggleNavigation();
  }, [isMobileView]);

  console.log(isMobileView, isNavigationCollapsed, 'isNavigationCollapsed >>');
  return (
    <div className="layout">
      <Navbar collapsed={isNavigationCollapsed} />
      <div className="flex-1 overflow-auto">
        <Dashboard
          collapsed={isNavigationCollapsed}
          toggleSidebar={() => setToggleNavigation((prev) => !prev)}
        />
      </div>
      {isUploadModalOpen && <FileUpload />}
    </div>
  );
};

export default App;
