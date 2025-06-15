import { useState, useEffect } from 'react';
import { useGetMessagesQuery } from '../../features/message/messageApi';

export const useChatMessages = (chatId) => {
    const {
        data,
        isLoading,
        isError,
        error,
    } =  useGetMessagesQuery(chatId, {
        skip: !chatId,
    });
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (data?.data?.length) {
      setMessages(data?.data);
    }
  }, [data]);
  return [messages, setMessages, { isLoading, isError, error }];
};
