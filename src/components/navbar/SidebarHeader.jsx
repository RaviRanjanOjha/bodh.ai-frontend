import React from 'react';
import { assets } from '../../assets/assets';

const SidebarHeader = ({ collapsed }) => (
  <div
    className={`flex items-center justify-start pt-[26px] ${collapsed ? 'p-4' : 'pl-[48px]'
      }`}
  >
    <span className="text-xl">
      <img src={assets.logo} alt="Logo" className={` ${collapsed ? 'size-[50px]' : 'size-[70px]'}`} />
    </span>
    {/* {!collapsed && <h1 className="ml-2 text-lg font-bold">Admin</h1>} */}
  </div>
);

export default SidebarHeader;
