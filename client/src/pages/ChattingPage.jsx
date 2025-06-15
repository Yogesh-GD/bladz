import useIsMobile from '../utils/useIsMobile'
import { useNavigate, useParams } from 'react-router'
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { useGetMessagesQuery, useSendMessageMutation } from '../features/message/messageApi'
import { AnimatePresence, motion } from 'framer-motion'
import Picker from '@emoji-mart/react'; // emoji-mart v5
import emojiData from '@emoji-mart/data'; // emoji-mart data
import Loader from './Loader'
import { socket } from '../utils/socket'


const ChatPageComp = ({ chat }) => {
    const scrollRef = useRef()
    const typingTimeoutRef = useRef()
    const navigate = useNavigate()
    const isMobile = useIsMobile()
    const authUser = useSelector((state) => state.auth.user)

    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState([])
    const [isTyping, setIsTyping] = useState(false)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [sendMessage] = useSendMessageMutation()
const addEmoji = (emoji) => {
    setMessage((prev) => prev + emoji.native);
};

    const {
        data,
        isLoading,
        isError,
        error,
    } = useGetMessagesQuery(chat._id, {
        skip: !chat?._id,
    });

    useEffect(() => {
        if (data?.data?.length) {
            setMessages(data.data);
        }
    }, [data]);


useEffect(() => {
    if (!chat?._id) return;

    socket.emit('join chat', chat._id);

    const handleMessageReceived = (newMessage) => {
        if (newMessage.chat._id !== chat._id) return;
        setMessages(prev => {
            const exists = prev.some(msg => msg._id === newMessage._id);
            if (exists) return prev;
            return [...prev, { ...newMessage, status: "sent" }];
        });
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    socket.on("message received", handleMessageReceived);

    return () => {
        socket.emit('leave chat', chat._id);
        socket.off("message received", handleMessageReceived);
    };
}, [chat._id]);


    const handleSendMessage = async (e) => {
        e.preventDefault()

        if (!message.trim()) return;

        const tempId = Date.now().toString()

        const tempMessage = {
            _id: tempId,
            sender: { _id: authUser._id, username: authUser.username, avatar: authUser.avatar },
            content: message,
            chat: chat._id,
            createdAt: new Date().toISOString(),
            type: "text",
            fileUrl: "",
            status: "sending"
        }

        setMessages((prev) => [...prev, tempMessage])
        setMessage("")

        setTimeout(() => {
            scrollRef.current?.scrollIntoView({ behavior: "smooth" })
        }, 50)

        try {
            const res = await sendMessage({
                chatId: chat._id,
                content: message,
            }).unwrap()
            const realMessage = res.data;

            setMessages((prev) =>
                prev.map((msg) => (msg._id === tempId ? realMessage : msg))
            );

            socket.emit("new message", realMessage);
        } catch (error) {
            console.error("Failed to send:", error);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg._id === tempId ? { ...msg, status: "failed" } : msg
                )
            )
        }
    }

    return (
        <div className=' flex flex-col w-full h-full  text-white'>

            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-[#1A2130]">
                {isMobile && (
                    <button
                        onClick={() => navigate('/chats')}
                        className="text-[#FF3C87] font-semibold"
                        aria-label="Back to chats"
                    >
                        ← Back
                    </button>
                )}
                <h2 className="font-bold text-lg truncate">{"kk"}</h2>
                <p className="text-sm text-gray-400 min-w-[80px]">
                    <AnimatePresence>
                        {isTyping ? (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="italic"
                            >
                                Typing
                                <motion.span
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ repeat: Infinity, duration: 1, repeatDelay: 0.3 }}
                                >
                                    ...
                                </motion.span>
                            </motion.span>
                        ) : (
                            'Online'
                        )}
                    </AnimatePresence>
                </p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-[#10101000]">
                <AnimatePresence initial={false}>
                    {messages.length > 0 && messages && messages.map((msg) => {
                        const isOwn = msg.sender._id === authUser._id;
                        return (
                            <motion.div
                                key={msg._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 10 }}
                                exit={{ opacity: 0, y: 10 }}
                                className={`max-w-[75%] p-3 rounded-lg text-sm break-words whitespace-pre-wrap ${isOwn
                                    ? 'bg-[#1A2130] ml-auto text-[#ff3c87] text-right'
                                    : 'bg-[#1e1e1e] mr-auto text-gray-300'
                                    }`}
                            >
                                <div>{msg.content}</div>
                                {isOwn && (
                                    <small
                                        className={`block mt-1 text-xs ${msg.status === 'sending'
                                            ? 'text-yellow-400'
                                            : msg.status === 'sent'
                                                ? 'text-green-400'
                                                : msg.status === 'failed'
                                                    ? 'text-red-500'
                                                    : 'text-gray-400'
                                            }`}
                                    >
                                        {msg.status === 'sending'
                                            ? 'Sending...'
                                            : msg.status === 'sent'
                                                ? 'Sent'
                                                : msg.status === 'failed'
                                                    ? 'Failed to send'
                                                    : ''}
                                    </small>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
                <div ref={scrollRef} />
            </div>

            <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-800 bg-[#121212] relative"
                autoComplete="off"
            >
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker((v) => !v)}
                        className="text-2xl select-none"
                        aria-label="Toggle emoji picker"
                    >
                        😊
                    </button>
                    <input
                        type="text"
                        className="flex-1 p-3 rounded-lg bg-[#1e1e1e] text-white focus:outline-none"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onFocus={() => setShowEmojiPicker(false)}
                    />
                    <button
                        type="submit"
                        className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg text-white"
                    >
                        Send
                    </button>
                </div>

                {/* EMOJI PICKER */}
                {showEmojiPicker && (
                    <div className="absolute bottom-full mb-2 left-4 z-20">
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

        </div>
    )
}

export default ChatPageComp