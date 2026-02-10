import React from 'react';
import { assets } from '../../assets/assets';

const SidebarHeader = ({ collapsed }) => (
  <div
    className={`flex items-center justify-start pt-[26px] ${collapsed ? 'p-4' : 'pl-[20px]'}`}
  >
    <span className="flex-shrink-0">
      <img
        src={assets.techm_logo}
        alt="Logo"
        className={`${collapsed ? 'w-[50px]' : 'w-[120px]'} h-auto object-contain`}
      />
    </span>
    {/* {!collapsed && <h1 className="ml-2 text-lg font-bold">Admin</h1>} */}
  </div>
);

export default SidebarHeader;