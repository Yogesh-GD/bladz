import { NavLink } from 'react-router';
import {
  FaHome,
  FaComments,
  FaUsers,
  FaChartPie,
  FaCogs,
  FaTv,
  FaWaveSquare,
} from 'react-icons/fa';

const navItems = [
  { to: '/chats', icon: <FaComments />, label: 'Chat' },
  { to: '/users', icon: <FaUsers />, label: 'Users' },
  { to: '/settings', icon: <FaCogs />, label: 'Settings' },
];

const VerticalSidebar = () => {
  return (
    <aside className="h-full w-16 bg-[#1C1F26] flex flex-col items-center py-6 space-y-6 border-r border-[#202A42]">
      {navItems.map(({ to, icon, label }) => (
        <NavLink
          key={label}
          to={to}
          title={label}
          className={({ isActive }) =>
            `p-2 rounded-xl text-xl transition-colors duration-200 ${
              isActive ? 'bg-[#FF3C87] text-white' : 'text-gray-400 hover:text-white hover:bg-[#202A42]'
            }`
          }
        >
          {icon}
        </NavLink>
      ))}
    </aside>
  );
};

export default VerticalSidebar;
