import { useEffect, useRef, useState } from "react"
import { socket } from "../socket";


const useTypingIndicator = (chatId,authUser) => {
    const [ isTyping,setIsTyping] = useState(false)

    const typingTimeoutRef = useRef()

    useEffect(() => {
        if (!chatId || !authUser) return;

    const handleTyping = () => setIsTyping(true);
    const handleStopTyping = () => setIsTyping(false);

    socket.on('typing', handleTyping);
    socket.on('stop typing', handleStopTyping);

    return () => {
      socket.off('typing', handleTyping);
      socket.off('stop typing', handleStopTyping);
    };
    },[chatId,authUser])

 const emitTyping = (inputValue) => {
    if (!chatId || !authUser) return;

    if (inputValue && !typingTimeoutRef.current) {
      socket.emit('typing', { chatId, sender: authUser });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop typing', { chatId });
      typingTimeoutRef.current = null;
    }, 1000);
  };

  return { isTyping, emitTyping };
};

export default useTypingIndicator;
