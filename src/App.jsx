import Main from './components/main/Main';
import Sidebar from './components/sidebar/Sidebar';
import './App.css';
import Navbar from './components/navbar/Navbar';
import { useSearchParams } from 'react-router';
import Dashboard from './components/dashboard/Dashboard';
import { NEW_APP_VERSION } from './constants';
import useSideNavStore from './store/useSideNavStore';
import { useContext } from 'react';
import { Context } from './context/Context';
import FileUpload from './components/fileUpload/fileUpload'
import AppLoader from './components/app-loader/AppLoader'

const App = () => {
  const { isNavigationCollapsed, setToggleNavigation } = useSideNavStore();
  const [searchParams] = useSearchParams();
  const appVersion = searchParams.get('v');
  const { isUploadModalOpen, favorites } = useContext(Context);

  const navigation =
    appVersion == NEW_APP_VERSION ? (
      <Navbar collapsed={isNavigationCollapsed} />
    ) : (
      <Sidebar isVisible={isNavigationCollapsed} />
    );

  const dashboard =
    appVersion == NEW_APP_VERSION ? (
      <div className="flex-1 overflow-auto">
        <Dashboard toggleSidebar={() => setToggleNavigation((prev) => !prev)} />
      </div>
    ) : (
      <Main
        isSidebarVisible={isNavigationCollapsed}
        toggleSidebar={() => setToggleNavigation((prev) => !prev)}
      />
    );

  return (
    <div className="layout">
      {/* {appVersion == NEW_APP_VERSION && <AppLoader />} */}
      {navigation}
      {dashboard}
      {isUploadModalOpen && (<FileUpload />)}
    </div>
  );
};

export default App;
