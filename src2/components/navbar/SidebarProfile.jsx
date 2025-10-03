import React from 'react';

const SidebarProfile = ({ collapsed }) => (
  <div
    className={`group mb-[20px] flex items-center justify-around hover:text-gray-800 cursor-pointer space-x-2 ${!collapsed && 'px-[35px]'}`}
  >
    <span className="w-[34px] h-[34px] flex justify-center items-center border-[#c2b0d64d] border-[1px] rounded-full group-hover:bg-[#c2b0d6ab] overflow-hidden">
      <img
        src='https://media.licdn.com/dms/image/v2/C4E03AQGxjsixrIIc5A/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1517670369282?e=2147483647&v=beta&t=rTLxVsbPL9aGTtci4PcpfVkpCTOyoi8I7flBJymbnMU'
        className="scale-[1.1]"
      />
    </span>
    {!collapsed && (
      <span className="group-hover:text-purple-800 text-sm">Rakhee Srivastav</span>
    )}
  </div>
);

export default SidebarProfile;
