import { FiX } from 'react-icons/fi';

const UserProfileModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-sm bg-[#1B1E25] text-white p-6 rounded-2xl border border-[#1B1E25] shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-pink-500"
        >
          <FiX size={22} />
        </button>

        <div className="flex flex-col items-center">
          <div className="relative group">
            <img
              src={user.avatar ? "http://localhost:3000" + user.avatar.replace("public", "") : "https://i.pinimg.com/736x/dc/9c/61/dc9c614e3007080a5aff36aebb949474.jpg"}
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover border-4 border-pink-600 shadow-md transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <h2 className="text-xl font-bold mt-4">{user.username}</h2>
          <p className="text-sm text-gray-400 mt-1 italic">
            {user.bio || 'No bio available.'}
          </p>
        </div>

        <div className="mt-6 space-y-2 text-sm text-gray-300">
          <div className="flex justify-between border-b border-[#2f3b59] pb-2">
            <span className="font-medium text-white">Email</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between pt-2">
            <span className="font-medium text-white">Status</span>
            <span className={user.isOnline ? 'text-green-400' : 'text-red-400'}>
              {user.isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
