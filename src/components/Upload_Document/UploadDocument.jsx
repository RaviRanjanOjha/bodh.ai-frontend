import React, { useContext, useRef } from "react";
import { Context } from "../../context/Context";
import { GrDocumentUpload } from "react-icons/gr";
import { Typography } from "@material-tailwind/react";

function UploadDocument({ collapsed }) {
  const { handleOpenUploadModal } = useContext(Context);

  const handleAttachClick = () => {
    handleOpenUploadModal();
  };

  return (
      <div
        onClick={handleAttachClick}
        className="cursor-pointer flex flex-row items-center justify-start gap-1 rounded-"
      >
        <span
          className={`hover:bg-[#D9D9D9] rounded-full ${
            collapsed ? "py-4 px-4" : "py-2.5 px-2"
          }`}
        >
          <GrDocumentUpload
            className={`${!collapsed ? "text-[16px]" : "text-[14px]"} text-center transition duration-200`}
          />
        </span>
        {!collapsed ? (
          <Typography variant="medium" className="font-medium text-gray-800">
            Upload Document
          </Typography>
        ) : (
          ""
        )}
      </div>
  );
}

export default UploadDocument;
