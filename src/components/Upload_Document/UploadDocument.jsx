import React, { useContext, useRef } from 'react'
import { Context } from '../../context/Context';
import { GrDocumentUpload } from "react-icons/gr";

function UploadDocument({ collapsed }) {
    const { handleOpenUploadModal } = useContext(Context);

    const handleAttachClick = () => {
        handleOpenUploadModal();
    }

    return (
        <div onClick={handleAttachClick} className="cursor-pointer flex flex-col items-center gap-1 rounded-full ">
            <span
                className={`hover:bg-[#D9D9D9] rounded-full ${collapsed ? 'py-4 px-4' : 'py-2.5 px-8'
                    }`}
            >
                <GrDocumentUpload className={`${!collapsed ? 'text-[16px]' : 'text-[14px]'} text-center transition duration-200`} />
            </span>
            {
                !collapsed ? (
                    <label className="cursor-pointer text-center text-sm">Upload <br /> Document</label>
                ) : ""
            }
        </div>

    )
}

export default UploadDocument