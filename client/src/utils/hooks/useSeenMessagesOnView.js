import { useEffect, useRef } from "react";
import { useMarkMessagesAsSeenMutation } from "../../features/message/messageApi";
import { socket } from "../socket";

export const useSeenMessagesOnView = (chatId, messages, scrollRef, userId) => {
  const [seenMessages] = useMarkMessagesAsSeenMutation();
  const lastSeenMessageId = useRef(null);

  useEffect(() => {
    if (!chatId || !messages?.length || !scrollRef?.current) return;

    const lastMsg = messages[messages.length - 1];

    if (lastMsg?.seenBy?.includes(userId)) return;

    if (lastSeenMessageId.current === lastMsg._id) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const last = entries[0];
        if (last.isIntersecting) {
          lastSeenMessageId.current = lastMsg._id;

          seenMessages(chatId)
            .unwrap()
            .then((res) => {
              const seenBy = res?.data?.seenBy;
              if (seenBy) {
                socket.emit("messages seen", { chatId, seenBy });
              }
            })
            .catch((err) => {
              console.error("Seen message mutation failed", err);
            });
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(scrollRef.current);

    return () => {
      if (scrollRef?.current) observer.unobserve(scrollRef.current);
    };
  }, [chatId, messages, scrollRef, userId]);
};
