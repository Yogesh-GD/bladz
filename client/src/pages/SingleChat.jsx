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
import { FiPhone, FiVideo } from "react-icons/fi";
import { useCallManager } from '../utils/hooks/useCallManager';



const SingleChat = () => {
  const { chat } = useOutletContext()
  const authUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const scrollRef = useRef();
  const isMobile = useIsMobile();
  const { startCall } = useCallManager();


  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [pendingMedia, setPendingMedia] = useState(null);

  const [messages, setMessages] = useChatMessages(chat._id);
  const sendMessage = useSendchatMessage(chat._id, authUser, setMessages);
  const { isTyping, emitTyping } = useTypingIndicator(chat._id, authUser);

  useSeenMessagesOnView(chat._id, messages, scrollRef, authUser._id);

  // Socket listener
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
  const { handleSendMessage, handleDeleteMessage } = useMessageHandler({
    chatId: chat._id,
    authUser,
    setMessages,
    scrollToBottom,
  });

  const addEmoji = (emoji) => setMessage((prev) => prev + emoji.native);

  const otherUser = !chat.isGroupChat ? chat.participants.find(p => p._id !== authUser._id) : null;
  const chatTitle = chat.isGroupChat ? chat.chatName : otherUser?.username || 'Chat';

  return (
    <div className="flex flex-col h-full text-white overflow-hidden">

      <div className="flex items-center justify-between px-4 py-2 shadow-[#24272E] shadow-2xl bg-[#24272E] ">
  <div className="flex items-center gap-2">
    {isMobile && (
      <button onClick={() => navigate('/chats')} className="text-[#FF3C87] font-semibold mr-1 text-xl">←</button>
    )}
    {otherUser && (
      <img
        onClick={() => setShowProfile(true)}
        src={otherUser.avatar ? "http://localhost:3000" + otherUser.avatar.replace("public", "") : "https://i.pinimg.com/736x/dc/9c/61/dc9c614e3007080a5aff36aebb949474.jpg"}
        alt="Avatar"
        className="w-9 h-9 rounded-full object-cover cursor-pointer"
      />
    )}
  </div>

  <div className="flex flex-col items-center text-sm flex-1 min-w-0">
    <h2 className="font-bold truncate max-w-[80%]">{chatTitle}</h2>
    <p className="text-gray-400">
      <AnimatePresence>
        {isTyping ? (
          <motion.span
            initial={{ opacity: 0.1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="italic"
          >
            Typing
            <motion.span animate={{ opacity: [0.1, 1, 0.1] }} transition={{ repeat: Infinity, duration: 1 }} >
              ...
            </motion.span>
          </motion.span>
        ) : 'Online'}
      </AnimatePresence>
    </p>
  </div>

{ <div className="flex items-center gap-3">
  <button
    className="text-gray-400 hover:text-pink-400 transition"
    title="Audio Call"
     onClick={() => startCall({
    type: "audio",
    receiverId: otherUser._id,
    chatId: chat._id,
  })}
  >
    <FiPhone size={20} />
  </button>
  <button
    className="text-gray-400 hover:text-pink-400 transition"
    title="Video Call"
      onClick={() => startCall({
    type: "video",
    receiverId: otherUser._id,
    chatId: chat._id,
  })}
  >
    <FiVideo size={20} />
  </button>
</div> }

</div>


      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[#24272E]">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
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
              />            </motion.div>
          ))}
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

      <UserProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} user={otherUser} />
    </div>
  );
};

export default SingleChat;
