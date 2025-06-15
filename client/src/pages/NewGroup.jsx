import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiX, FiCamera } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getAllUsers } from '../features/user/userSlice';
import { useCreateGroupChatMutation } from '../features/chat/chatApi';
import Loader from '../components/Loader';

const NewGroup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const { userList, isLoading } = useSelector((state) => state.user);
  const [createGroupChat, { isLoading: creating }] = useCreateGroupChatMutation();

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setGroupImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length < 2) {
      toast.error('Group name and at least 2 members are required.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', groupName.trim());
      formData.append('participants', JSON.stringify(selectedUsers.map((u) => u._id)));
      if (groupImage) formData.append('groupImage', groupImage);

      const res = await createGroupChat(formData).unwrap();
      toast.success('Group created successfully!');
      navigate(`/chat/${res.data._id}/group-chat`);
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create group');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#24272E] text-white p-4">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate('/chats')}
          aria-label="Go back"
          className="p-2 mr-4 rounded hover:bg-[#2b2f40]"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold">New Group</h2>
      </div>

      {/* Group Image & Name */}
      <div className="flex flex-col items-center mb-4 relative">
        <div className="relative group">
          <img
            src={previewImage || '/default-avatar.png'}
            alt="Group"
            className="w-24 h-24 rounded-full object-cover border-4 border-pink-600 shadow"
          />
          <label htmlFor="groupImageUpload" className="absolute bottom-1 right-1 bg-pink-600 p-2 rounded-full cursor-pointer hover:bg-pink-700">
            <FiCamera size={16} />
          </label>
          <input
            type="file"
            id="groupImageUpload"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>
      </div>

      <input
        type="text"
        placeholder="Enter group name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        className="w-full p-3 mb-4 rounded-md bg-[#1C1F26] placeholder-gray-400 text-sm outline-none"
      />

      {/* Selected Users */}
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedUsers.map((user) => (
          <div
            key={user._id}
            className="flex items-center bg-pink-700 text-sm px-3 py-1 rounded-full"
          >
            <span>{user.username}</span>
            <button className="ml-2 text-white" onClick={() => toggleUserSelection(user)}>
              <FiX size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search users"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full p-3 mb-3 rounded-md bg-[#1C1F26] placeholder-gray-400 text-sm outline-none"
      />

      {/* Users List */}
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
                  : 'hover:bg-[#3B3B3B]'
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
        onClick={handleCreateGroup}
        className="mt-4 p-3 bg-[#000000] hover:bg-[#13161b] text-white font-semibold rounded-md disabled:opacity-50"
        disabled={creating || !groupName || selectedUsers.length < 2}
      >
        {creating ? 'Creating...' : 'Create Group'}
      </button>
    </div>
  );
};

export default NewGroup;
