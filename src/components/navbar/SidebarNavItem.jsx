import { Typography } from "@material-tailwind/react";

const SidebarNavItem = ({
  icon,
  index,
  label,
  collapsed,
  children,
  isActive,
  onClick,
  hideOuterHeader,
}) => {
  const handleToggle = () => {
    if (typeof onClick === "function") onClick(index);
  };

  return (
    <li className="flex flex-col gap-1">
      {/* ===== Header Row ===== */}
      {!hideOuterHeader && (
        <div className="flex items-center gap-2">
          {/* === Icon (hover ONLY here – same as old code) === */}
          <span
            onClick={handleToggle}
            className={`hover:bg-[#D9D9D9] rounded-full cursor-pointer ${
              collapsed ? "py-4 px-4" : "py-2.5 px-2"
            }`}
          >
            <img
              src={icon}
              alt={label}
              className={`${collapsed ? "w-[14px]" : "w-[18px]"}`}
              draggable="false"
            />
          </span>

          {/* === Label (cursor only, NO hover bg) === */}
          {!collapsed && (
            <Typography
              variant="medium"
              className="font-medium text-gray-800 cursor-pointer"
              onClick={handleToggle}
            >
              {label}
            </Typography>
          )}
        </div>
      )}

      {/* ===== Children ===== */}
      {(!collapsed && isActive) || hideOuterHeader ? (
        <div onClick={(e) => e.stopPropagation()} className="w-full">
          {children}
        </div>
      ) : null}
    </li>
  );
};

export default SidebarNavItem;
