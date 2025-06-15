import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Picker from '@emoji-mart/react';
import emojiData from '@emoji-mart/data';
import { useNavigate, useOutletContext } from 'react-router';
import { IoMdSend } from "react-icons/io";
import useIsMobile from '../utils/useIsMobile';
import { useChatMessages } from '../utils/hooks/useChatMessages';
import { useSendchatMessage } from '../utils/hooks/useSendChatMessage';
import useTypingIndicator from '../utils/hooks/useTypingIndicator';
import { useSeenMessagesOnView } from '../utils/hooks/useSeenMessagesOnView';
import { useChatSocket } from '../utils/hooks/useChatSocket';
import MediaPicker from '../components/MediaPicker';
import UserProfileModal from '../components/UserProfileModal';
import ChatMessage from '../components/ChatMessage';
import { useMessageHandler } from '../utils/hooks/useMessageHandler';
import { FiMoreVertical } from 'react-icons/fi';
import Members from "../components/Members"

const GroupChat = () => {
  const { chat } = useOutletContext();
  const authUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const scrollRef = useRef();
  const isMobile = useIsMobile();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
    const handleMenuClick = () => setMenuOpen((v) => !v);


  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pendingMedia, setPendingMedia] = useState(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);

    const [showMembers, setShowMembers] = useState(false);

  const [messages, setMessages] = useChatMessages(chat._id);
  const sendMessage = useSendchatMessage(chat._id, authUser, setMessages);
  const { isTyping, emitTyping } = useTypingIndicator(chat._id, authUser);
  useSeenMessagesOnView(chat._id, messages, scrollRef, authUser._id);



  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useChatSocket(chat._id, {
    'message received': (msg) => {
      if (msg.chat._id === chat._id) {
        setMessages((prev) => prev.some((m) => m._id === msg._id) ? prev : [...prev, msg]);
        scrollToBottom();
      }
    },
    'messages seen': ({ chatId, seenBy }) => {
      if (chatId !== chat._id) return;
      setMessages((prev) =>
        prev.map((msg) =>
          seenBy.some((id) => !msg.seenBy?.includes(id))
            ? { ...msg, seenBy: [...(msg.seenBy || []), ...seenBy] }
            : msg
        )
      );
    },

    'message deleted': ({ messageId }) => {
    setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
  },
  });

  const scrollToBottom = () => scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(scrollToBottom, [messages]);

  const { handleSendMessage,handleDeleteMessage } = useMessageHandler({
  chatId: chat._id,
  authUser,
  setMessages,
  scrollToBottom,
});


  const addEmoji = (emoji) => setMessage((prev) => prev + emoji.native);

  const chatTitle = chat?.isGroupChat ? chat.chatName : chat?.participants?.find(p => p._id !== authUser._id)?.username || 'Chat';
  


const handleMembersClick = () => {
    setMenuOpen(false);
    console.log('Show members UI');
    setShowMembers(true)
  };

  const handleAddUserClick = () => {
    setMenuOpen(false);
    console.log('Show add user UI');
    navigate(`/chat/${chat._id}/add-members`)
  };



  return (
    <div className="flex flex-col h-full text-white overflow-hidden">
     <div className="flex items-center justify-between p-4  shadow-[#24272E] shadow-2xl bg-[#24272E] relative">
        {isMobile && (
          <button onClick={() => navigate('/chats')} className="text-[#FF3C87] font-semibold mr-3">
            ←
          </button>
        )}
        <div className="flex items-center gap-3 flex-1">
          <img
            src={chat?.chatImage ?"http://localhost:3000" + chat?.chatImage.replace("public", "")  : "https://i.pinimg.com/736x/dc/9c/61/dc9c614e3007080a5aff36aebb949474.jpg"}
            alt="Chat Avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h2 className="font-bold text-base truncate">{chatTitle}</h2>
            <p className="text-sm text-gray-400">
              <AnimatePresence>
                {isTyping ? (
                  <motion.span
                    initial={{ opacity: 0.1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="italic"
                  >
                    Typing
                    <motion.span animate={{ opacity: [0.1, 1, 0.1] }} transition={{ repeat: Infinity, duration: 1 }}>
                      ...
                    </motion.span>
                  </motion.span>
                ) : (
                  'Online'
                )}
              </AnimatePresence>
            </p>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={handleMenuClick}
            className="text-gray-400 hover:text-white p-1 rounded"
            aria-label="Chat options"
          >
            <FiMoreVertical size={22} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-[#2A324A] rounded-md shadow-lg text-white z-50">
              <button
                onClick={handleMembersClick}
                className="w-full px-4 py-2 text-left hover:bg-[#3a4463] rounded-t-md"
              >
                Members
              </button>
              {chat.groupAdmin == authUser._id && (<button
                onClick={handleAddUserClick}
                className="w-full px-4 py-2 text-left hover:bg-[#3a4463] rounded-b-md"
              >
                Add User
              </button>)}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[#24272E]">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            const isOwn = msg.sender._id === authUser._id;
            return (
              <motion.div
                key={msg.tempId || msg._id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <ChatMessage
  msg={msg}
  isOwn={msg.sender._id === authUser._id}
  isGroupChat={chat.isGroupChat}
  onAvatarClick={(user) => setSelectedUserProfile(user)}
  onDelete={handleDeleteMessage}
/>

              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={scrollRef} />
      </div>

      <form onSubmit={(e) => handleSendMessage(e, message, pendingMedia, setMessage, setPendingMedia)} className="p-4  bg-[#24272E] relative">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowEmojiPicker((v) => !v)} className="text-2xl">😊</button>
          <MediaPicker media={pendingMedia} setMedia={setPendingMedia} />
          <input
            type="text"
            className="flex-1 p-2 rounded-lg bg-[#1e1e1e] text-white focus:outline-none"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              emitTyping(e.target.value);
            }}
            onFocus={() => setShowEmojiPicker(false)}
          />
          <button type="submit" className="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg">
            <span className="hidden sm:inline">Send</span>
            <span className="sm:hidden"><IoMdSend /></span>
          </button>
        </div>

        {showEmojiPicker && (
          <div className="absolute bottom-full mb-2 left-4 z-20" onMouseLeave={() => setShowEmojiPicker(false)}>
            <Picker
              data={emojiData}
              onEmojiSelect={addEmoji}
              theme="dark"
              previewPosition="none"
              emojiButtonSize={24}
              searchPosition="none"
            />
          </div>
        )}
      </form>

      <UserProfileModal isOpen={!!selectedUserProfile} onClose={() => setSelectedUserProfile(null)} user={selectedUserProfile} />

          {showMembers && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="relative bg-[#121212] rounded-lg shadow-lg max-w-lg w-full">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white font-bold text-xl"
              onClick={() => setShowMembers(false)}
              aria-label="Close members"
            >
              ×
            </button>
            <Members
              members={chat.participants}
              adminId={chat.groupAdmin}
              authUserId={authUser._id}
              groupId={chat._id}
              onRemoveUser={() =>{}}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupChat;
