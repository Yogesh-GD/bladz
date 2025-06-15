import { toast } from "react-toastify";
import { useSendMessageMutation } from "../../features/message/messageApi";
import { socket } from "../socket";

export const useSendchatMessage = (chatId, authUser, setMessages) => {
  const [sendMessageApi] = useSendMessageMutation();

  const sendMessage = async ({content = "", file = null,type = "text"}) => {
    const tempId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const tempMsg = {
      _id: tempId,
      tempId,
      sender: {
        _id: authUser._id,
        username: authUser.username,
        avatar: authUser.avatar,
      },
      content,
      chat: chatId,
      createdAt: new Date().toISOString(),
      type,
      fileUrl: file ? URL.createObjectURL(file) : "",
      seenBy: [authUser._id],
      status: "sending",
    };

    setMessages((prev) => [...prev, tempMsg]);

    try {
      const formData = new FormData()
      formData.append("content",content)
      formData.append('chatId',chatId)
      formData.append("type",type)
       
      if(file){
        formData.append("file",file)
      }

      const res = await sendMessageApi(formData).unwrap();
      const realMsg = res.data;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === tempId ? { ...realMsg, status: "sent" } : msg
        )
      );

    } catch (err) {
      toast.error("Send failed:", err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === tempId ? { ...msg, status: "failed" } : msg
        )
      );
    }
  };

  return sendMessage;
};
