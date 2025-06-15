import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import { useAccessChatMutation } from '../features/chat/chatApi';
import { useDebounce } from '../utils/hooks/useDebounce';
import { useSearchUsersQuery } from '../features/user/userApi';


const NewChat = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);
  const [page, setPage] = useState(1);
  const limit = 20;

  const [accessChat] = useAccessChatMutation()

  const {
    data,
    isLoading,
    error,
    isFetching,
  } = useSearchUsersQuery({
    search: debouncedSearch,
    page,
    limit,
  });
  const users = data?.data.users || [];

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message || 'Failed to fetch users');
    }
  }, [error]);

const handleUserSelect = async (userId) => {
  try {
    const res = await accessChat({ userId }).unwrap(); 
    const chatId = res.data._id;
    navigate(`/chat/${chatId}/single-chat`);                     
  } catch (err) {
    toast.error(err?.data?.message || "Could not access chat");
  }
};

  const handleLoadMore = () => {
    if (!isFetching && data?.hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#24272E] text-white p-4">
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate('/chats')}
          className="p-2 mr-4 rounded hover:bg-[#2b2f40]"
          aria-label="Go back"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold">New Chat</h2>
      </div>

      <input
        type="text"
        placeholder="Search users by name, email, or mobile"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setPage(1); 
        }}
        className="w-full p-3 rounded-md bg-[#3B3B3B] placeholder-gray-400 text-sm outline-none mb-4"
        autoFocus
      />

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <Loader />
        ) : users.length === 0 ? (
          <p className="text-gray-400 text-center mt-8">No users found.</p>
        ) : (
          users.map((user) => (
            <div
              key={user._id}
              onClick={() => handleUserSelect(user._id)}
              className="flex items-center gap-3 p-3 rounded-md cursor-pointer hover:bg-[#3B3B3B]"
            >
              <img
                src={user.avatar || '/default-avatar.png'}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold text-sm">{user.username}</h4>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
            </div>
          ))
        )}

        {data?.hasMore && (
          <button
            onClick={handleLoadMore}
            disabled={isFetching}
            className="w-full py-2 mt-4 text-sm font-medium bg-[#2b2f40] rounded hover:bg-[#374259]"
          >
            {isFetching ? 'Loading...' : 'Load More'}
          </button>
        )}
      </div>
    </div>
  );
};

export default NewChat;
