import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import VerticalSidebar from '../components/VerticalSidebar';
import { socket } from '../utils/socket';
import Topbar from '../components/Topbar';
import IncomingCallModal from '../components/IncomingCallModal';
import CallWindow from '../components/CallWindow';


function Root() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const authUser = useSelector((state) => state.auth.user);
  const status = useSelector((state) => state.call.status)

      const navigate = useNavigate()


  useEffect(() => {
    navigate("/chats")

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (authUser?._id) {
      socket.connect();
      socket.emit("setup", authUser);
      socket.emit("join",authUser._id)
      
    }

    return () => {
      socket.disconnect();
    };
  }, [authUser]);




  return (
    <div className="h-screen flex flex-col bg-[#24272E] text-white overflow-hidden">
      <Topbar />

      <div className="flex flex-1 overflow-hidden">
    
        {!isMobile && (
          <aside className="">
            <VerticalSidebar />
          </aside>
        )}

        <main className="flex-1 overflow-y-auto bg-[#20232A]">
          <Outlet />
        </main>
      </div>

      <IncomingCallModal />
     {  <CallWindow />}

    </div>
  );
}

export default Root;
