import { Outlet } from "react-router";
import ChatList from "../components/ChatList";


const ChatMain = () => {
  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-full  md:w-[50%] border-r border-gray-800 h-full">
        <ChatList />
      </div>

      <div className="hidden sm:flex flex-1 h-full overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};


export default ChatMain;
