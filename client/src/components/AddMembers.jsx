import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiX } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAddGroupMembersMutation } from '../features/chat/chatApi';
import Loader from './Loader';
import { getAllUsers } from '../features/user/userSlice';



const AddMembers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { groupId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const { userList, isLoading } = useSelector((state) => state.user);
  const [addGroupMembers, { isLoading: adding }] = useAddGroupMembersMutation();

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(userList);
    } else {
      const lower = searchTerm.toLowerCase();
      const filtered = userList.filter(
        (user) =>
          user.username?.toLowerCase().includes(lower) ||
          user.email?.toLowerCase().includes(lower)
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, userList]);

  const toggleUserSelection = (user) => {
    const exists = selectedUsers.find((u) => u._id === user._id);
    if (exists) {
      setSelectedUsers((prev) => prev.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) {
      toast.error('Select at least one user to add.');
      return;
    }

    

    try {
      const users = selectedUsers.map((u) => u._id);
      await addGroupMembers({ groupId, users }).unwrap();
      toast.success('Members added successfully!');
      navigate(`/chat/${groupId}/group-chat`); 
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add members');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#24272E] text-white p-4">
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate(`/chat/${groupId}/group-chat`)}
          aria-label="Go back"
          className="p-2 mr-4 rounded hover:bg-[#2b2f40]"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold">Add Members</h2>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {selectedUsers.map((user) => (
          <div
            key={user._id}
            className="flex items-center bg-pink-700 text-sm px-3 py-1 rounded-full"
          >
            <span>{user.username}</span>
            <button
              className="ml-2 text-white"
              onClick={() => toggleUserSelection(user)}
            >
              <FiX size={14} />
            </button>
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Search users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 mb-3 rounded-md bg-[#1D1D1D] placeholder-gray-400 text-sm outline-none"
      />

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <Loader />
        ) : filteredUsers.length === 0 ? (
          <p className="text-gray-400 text-center mt-6">No users found.</p>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              onClick={() => toggleUserSelection(user)}
              className={`flex items-center gap-3 p-3 rounded-md cursor-pointer ${
                selectedUsers.find((u) => u._id === user._id)
                  ? 'bg-pink-600'
                  : 'hover:bg-[#2b2f40]'
              }`}
            >
              <img
                src={user.profilePic || '/default-avatar.png'}
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
      </div>

      <button
        onClick={handleAddMembers}
        className="mt-4 p-3 bg-[#1b1b1b] hover:bg-[#000000] text-white font-semibold rounded-md disabled:opacity-50"
        disabled={adding || selectedUsers.length === 0}
      >
        {adding ? 'Adding...' : 'Add Members'}
      </button>
    </div>
  );
};

export default AddMembers;
