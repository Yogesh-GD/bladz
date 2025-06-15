import { FiArrowLeft } from 'react-icons/fi';
import { FiUser, FiUsers } from 'react-icons/fi';
import { useNavigate } from 'react-router';

const userOptions = [
  {
    title: 'Single Chat',
    icon: <FiUser className="text-3xl text-pink-500" />,
    path: '/chats/new',
  },
  {
    title: 'Group Chat',
    icon: <FiUsers className="text-3xl text-orange-500" />,
    path: '/chats/new-group',
  },
];

const UserPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#24272E] text-white p-6">
      <button
          onClick={() => navigate(-1)}
          className=" text-pink-500 hover:text-pink-600"
          aria-label="Go back"
        >
          <FiArrowLeft size={20} />
        </button>
      <h2 className="text-2xl font-bold mb-6 text-pink-400">Start a Chat</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {userOptions.map((item, idx) => (
          <div
            key={idx}
            onClick={() => navigate(item.path)}
            className="bg-[#1C1F26] hover:bg-[#3b3b3b] p-6 rounded-xl cursor-pointer transition transform hover:scale-[1.02] shadow-lg"
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              {item.icon}
              <span className="text-lg font-semibold">{item.title}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPage;
