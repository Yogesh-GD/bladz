import { Outlet, useParams } from "react-router"
import { useGetSingleChatQuery } from "../features/chat/chatApi";
import Loader from "../components/Loader";

const ChattingMain = () => {
  const { chatId } = useParams()

  const { data : chatData, isLoading, error, isError } = useGetSingleChatQuery(chatId)

  if(isLoading){
    return <Loader />
  }

  if(isError){
    return  <div className="text-red-400 text-sm">Failed to load chats.</div>
  }



  return (
    <div className=" h-full w-full">
        <Outlet  context={{ chat: chatData.data }} />
    </div>
  )
}

export default ChattingMain