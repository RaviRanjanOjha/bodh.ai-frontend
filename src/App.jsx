
//card button and the input -- components

//material.ui/core

import Main from "./components/main/Main"
import Sidebar from "./components/sidebar/Sidebar"
import './App.css';
import { useState } from "react";


const App = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  return (
    <div className="layout">
    <Sidebar isVisible={isSidebarVisible}/>
    <Main isSidebarVisible={isSidebarVisible}
 toggleSidebar={() => setIsSidebarVisible(prev => !prev)}/>
    </div>

)
}

export default App


// import React from 'react';
// import SmartInput from './components/smartput/SmartInput';
// function App() {
//  return (
// <div style={{ padding: '40px' }}>
// <h2>Smart Input with Voice Search</h2>
// <SmartInput />
// </div>
//  );
// }
// export default App;