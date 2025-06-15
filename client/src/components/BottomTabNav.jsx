import { NavLink } from 'react-router'; 
import { FaCommentDots, FaCog, FaUsers } from 'react-icons/fa';

const tabs = [
  { to: '/chats', icon: <FaCommentDots size={20} />, label: 'Chats' },
  { to: '/users', icon: <FaUsers size={20} />, label: 'Users' },
  { to: '/settings', icon: <FaCog size={20} />, label: 'Settings' },
];

const BottomTabNav = () => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#202A42] text-white border-t border-[#2a324a] flex justify-around py-2 z-50">
      {tabs.map(({ to, icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center text-xs gap-1 ${
              isActive ? 'text-[#FF3C87]' : 'text-gray-300'
            }`
          }
        >
          {icon}
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default BottomTabNav;
