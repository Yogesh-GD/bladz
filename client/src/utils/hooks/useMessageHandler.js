import { toast } from 'react-toastify';
import { useDeleteMessageMutation } from '../../features/message/messageApi';
import { getCustomFileType } from '../getCustomFileType';
import { useSendchatMessage } from './useSendChatMessage';


export const useMessageHandler = ({ chatId, authUser, setMessages, scrollToBottom }) => {
  const sendMessage = useSendchatMessage(chatId, authUser, setMessages);
  const [deleteMessage] = useDeleteMessageMutation()

  const handleSendMessage = (e, message, pendingMedia, setMessage, setPendingMedia) => {
    e.preventDefault();

    const hasText = message.trim();
    const hasFile = pendingMedia?.file;
    if (!hasText && !hasFile) return;

    sendMessage({
      content: hasText,
      file: hasFile || null,
      type: hasFile ? getCustomFileType(pendingMedia.type) : 'text',
    });

    setMessage('');
    setPendingMedia(null);
    scrollToBottom?.();
  };

  const handleDeleteMessage = async (e,messageId) => {
    try {
    await deleteMessage(messageId).unwrap();
  } catch (err) {
    toast.error("Failed to delete message", err);
  }
  }
 
  return {
    handleSendMessage,
    handleDeleteMessage
  };
};
