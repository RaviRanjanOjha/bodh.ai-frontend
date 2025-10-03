import './App.css';
import Navbar from './components/navbar/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import useSideNavStore from './store/useSideNavStore';
import { useContext } from 'react';
import { Context } from './context/Context';
import FileUpload from './components/fileUpload/fileUpload'

const App = () => {
  const { isNavigationCollapsed, setToggleNavigation } = useSideNavStore();
  const { isUploadModalOpen } = useContext(Context);

  return (
    <div className="layout">
      <Navbar collapsed={isNavigationCollapsed} />
      <div className="flex-1 overflow-auto">
        <Dashboard toggleSidebar={() => setToggleNavigation((prev) => !prev)} />
      </div>
      {isUploadModalOpen && (<FileUpload />)}
    </div>
  );
};

export default App;
