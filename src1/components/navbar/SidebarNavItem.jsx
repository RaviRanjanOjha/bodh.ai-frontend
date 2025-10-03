const SidebarNavItem = ({
  icon,
  index,
  label,
  collapsed,
  children,
  isActive,
  onClick,
}) => (
  <li
    className={`flex flex-col items-center hover:text-gray-800 cursor-pointer space-x-2 gap-1`}
    onClick={() => {
      onClick(index);
    }}
  >
    <span
      className={`hover:bg-[#D9D9D9] rounded-full ${
        collapsed ? 'py-4 px-4' : 'py-2.5 px-8'
      }`}
    >
      <img
        src={icon}
        alt={label}
        className={`m-0 ${collapsed ? 'w-[14px]' : 'w-[18px]'}`}
      />
    </span>
    {!collapsed && !isActive && <span className='text-sm'>{label}</span>}
    {!collapsed && isActive && children}
  </li>
);

export default SidebarNavItem;
