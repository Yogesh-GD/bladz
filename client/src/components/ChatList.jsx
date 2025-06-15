import { useNavigate } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import { useGetUserChatsQuery, useDeleteChatMutation, useLeaveGroupChatMutation } from '../features/chat/chatApi';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ChatList = () => {
  const navigate = useNavigate();
  const { data: chats = [], isLoading, isError } = useGetUserChatsQuery();
  const authUser = useSelector((state) => state.auth.user);
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="p-4 space-y-3 text-white bg-[#20232A] min-h-screen">
      <h2 className="text-lg font-semibold mb-2">Conversations</h2>

      {isLoading && <p className="text-gray-400 text-sm">Loading chats...</p>}
      {isError && <p className="text-red-400 text-sm">Failed to load chats.</p>}

      {chats?.data?.map((chat) => (
        <ChatCard
          key={chat._id}
          chat={chat}
          authUserId={authUser._id}
          navigate={navigate}
        />
      ))}
    </div>
  );
};

export default ChatList;

const ChatCard = ({ chat, authUserId, navigate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const otherUser = !chat.isGroupChat
    ? chat.participants.find((p) => p._id !== authUserId)
    : null;

  const displayName = !chat.isGroupChat
    ? otherUser?.username || 'Loading...'
    : chat.chatName;

    const avatar = otherUser?.avatar || chat.chatImage 
  const lastMessage = chat.latestMessage;
  const isUnread = chat.unreadCount > 0;
  const formatRelativeTime = (isoDate) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diff = Math.floor((now - date) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    const hours = Math.floor(diff / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const lastMsgText = () => {
    if (!lastMessage) return 'Say hi 👋';
    switch (lastMessage.type) {
      case 'image': return '📷 Photo';
      case 'video': return '🎥 Video';
      case 'file': return '📎 File';
      default: return lastMessage.content || 'Say hi 👋';
    }
  };

  const handleCardClick = () => {
    if (!menuOpen) {
      navigate(`/chat/${chat._id}/${chat.isGroupChat ? "group-chat" : "single-chat"}`);
    }
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  const [deleteChat, { isLoading: deleting }] = useDeleteChatMutation();
  const [leaveGroupChat, { isLoading: leaving }] = useLeaveGroupChatMutation();

 const handleOptionClick = async (option) => {
  setMenuOpen(false);
  try {
    if (option === 'delete') {
      await deleteChat(chat._id).unwrap();
      toast.success('Chat deleted successfully');
    } else if (option === 'leave') {
      await leaveGroupChat(chat._id).unwrap();
      toast.success('Left group successfully');
    }
  } catch (error) {
    toast.error('Action failed. Please try again.');
    console.error("Action failed:", error);
  }
};


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      onClick={handleCardClick}
      className={`flex items-center justify-between bg-[#1C1F26] shadow-2xs hover:bg-[#24272E] p-4 rounded-2xl cursor-pointer transition relative
        ${deleting || leaving ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="flex items-center gap-4">
        <img
          src={avatar ? "http://localhost:3000" + avatar.replace("public", "") : "https://i.pinimg.com/736x/dc/9c/61/dc9c614e3007080a5aff36aebb949474.jpg"}
          alt={displayName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <h4 className="font-medium text-md truncate max-w-[160px]">{displayName}</h4>
          <p className="text-sm text-gray-300 truncate max-w-[180px]">{lastMsgText()}</p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 relative">
        <p className="text-xs text-gray-400">
          {lastMessage?.createdAt ? formatRelativeTime(lastMessage.createdAt) : ''}
        </p>
        {isUnread && (
          <span className="bg-pink-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {chat.unreadCount}
          </span>
        )}

        <button
          onClick={handleMenuClick}
          className="text-gray-400 hover:text-white"
          disabled={deleting || leaving}
          aria-label="Open chat options"
        >
          <FiMoreVertical size={18} />
        </button>

        {menuOpen && (
          <div
            ref={menuRef}
            className="absolute right-0 top-8 z-50 bg-[#2A324A] text-sm rounded-md shadow-lg overflow-hidden w-32"
          >
            <button
              onClick={() => handleOptionClick(chat.isGroupChat ? 'leave' : 'delete')}
              className="w-full text-left px-4 py-2 hover:bg-[#3a4463] text-white"
              disabled={deleting || leaving}
            >
              {chat.isGroupChat ? 'Leave Group' : 'Delete Chat'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
