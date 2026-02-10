import React from "react";
import { Typography } from "@material-tailwind/react";

const SidebarProfile = ({ collapsed }) => (
  <div
    className={`group mt-auto mb-[20px] flex items-center justify-start hover:text-gray-800 cursor-pointer gap-2 px-[24px] ${!collapsed && "px-[24px]"}`}
  >
    <span className="w-[34px] h-[34px] flex justify-center items-center border-[#c2b0d64d] border-[1px] rounded-full group-hover:bg-[#c2b0d6ab] overflow-hidden">
      <img
        src="https://media.licdn.com/dms/image/v2/C4E03AQGxjsixrIIc5A/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1517670369282?e=2147483647&v=beta&t=rTLxVsbPL9aGTtci4PcpfVkpCTOyoi8I7flBJymbnMU"
        className="scale-[1.1]"
      />
    </span>
    {!collapsed && (
      <Typography variant="medium" className="font-medium text-gray-800">
        Rakhee Srivastav
      </Typography>
    )}
  </div>
);

export default SidebarProfile;
