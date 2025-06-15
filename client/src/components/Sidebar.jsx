import { NavLink } from 'react-router';

const Sidebar = () => {
  return (
    <aside className=" h-full bg-[#202A42] text-orange-500 p-4 hidden md:flex flex-col">
      <h2 className="text-2xl font-bold mb-6">Sword-Talk</h2>
      <nav className="flex flex-col gap-4">
        <NavLink to="/chats" className="hover:text-white">Chats</NavLink>
        <NavLink to="/calls" className="hover:text-white">Calls</NavLink>
        <NavLink to="/contacts" className="hover:text-white">Contacts</NavLink>
        <NavLink to="/settings" className="hover:text-white">Settings</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
