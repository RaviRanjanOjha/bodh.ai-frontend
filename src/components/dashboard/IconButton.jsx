import React from "react";

const IconButton = ({ onClick, icon, alt, ariaLabel }) => (
    <button
        onClick={onClick}
        className="p-2 bg-transparent text-gray-600 border border-[#DFD0E9] rounded-full hover:bg-gray-200 h-10 w-10 sm:h-12 sm:w-12"
        aria-label={ariaLabel}
    >
        <img src={icon} alt={alt} />
    </button>
);

export default IconButton;
