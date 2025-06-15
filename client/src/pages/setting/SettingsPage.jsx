import { FiUser, FiLock, FiHelpCircle, FiInfo } from 'react-icons/fi';
import { useNavigate } from 'react-router';

const settingsOptions = [
  {
    title: 'Profile',
    icon: <FiUser className="text-xl text-pink-500" />,
    path: '/settings/profile',
  },
  {
    title: 'Account',
    icon: <FiLock className="text-xl text-orange-500" />,
    path: '/settings/account',
  },
  {
    title: 'Support',
    icon: <FiHelpCircle className="text-xl text-blue-500" />,
    path: '/settings/support',
  },
  {
    title: 'About',
    icon: <FiInfo className="text-xl text-purple-500" />,
    path: '/settings/about',
  },
];

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#24272E] text-white p-4">
      <h2 className="text-2xl font-bold mb-4 text-pink-400">Settings</h2>

      <div className="space-y-3">
        {settingsOptions.map((item, idx) => (
          <div
            key={idx}
            onClick={() => navigate(item.path)}
            className="flex items-center justify-between bg-[#1C1F26] hover:bg-[#0d0f14] p-4 rounded-lg cursor-pointer transition"
          >
            <div className="flex items-center gap-4">
              {item.icon}
              <span className="text-md font-medium">{item.title}</span>
            </div>
            <span className="text-gray-400">{'›'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;
