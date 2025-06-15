import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toggleCallUI } from "../features/call/callSlice";
import { FiPhoneOff, FiMinus } from "react-icons/fi";
import { socket } from "../utils/socket";
import { useCallSocketListener } from "../utils/hooks/useCallSocketListener";
import { usePeerConnection } from "../utils/hooks/usePeerConnection";

const CallWindow = () => {
  const dispatch = useDispatch();
  const { status, type, isFloating, callId } = useSelector((state) => state.call);
  const [floating, setFloating] = useState(isFloating);

  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef(null);
  const audioRef = useRef(null);

  const { remoteStream, localStream, endPeerConnection } = usePeerConnection();

  useCallSocketListener({ endPeerConnection });

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }

    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }

    if (audioRef.current && remoteStream && type === "audio") {
      audioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, localStream, type]);

  const toggleView = () => {
    setFloating(!floating);
    dispatch(toggleCallUI());
  };

  const endCall = () => {
    socket.emit("endCall", { callId });
    endPeerConnection();
  };

  if (!["calling", "in-call"].includes(status)) return null;

  return (
    <div
      className={`fixed z-50 bg-[#1A2130] text-white shadow-xl rounded-2xl overflow-hidden flex flex-col transition-all
        ${floating
          ? "bottom-5 right-5 w-[85vw] max-w-[300px] h-[50vh] max-h-[400px] cursor-pointer"
          : "inset-0 w-full max-w-screen-md mx-auto my-6 px-4"
        }`}
      style={{
        left: floating ? "auto" : "50%",
        transform: floating ? "none" : "translateX(-50%)",
      }}
      onClick={() => {
        if (floating) toggleView();
      }}
    >
      {type === "audio" && <audio autoPlay ref={audioRef} />}

      {type === "video" ? (
        <div className="relative flex-1 bg-black rounded-t-2xl overflow-hidden flex items-center justify-center text-gray-400">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className={`absolute border-2 border-white rounded-full shadow-md transition-all
              ${floating
                ? "w-12 h-12 bottom-3 right-3"
                : "w-20 h-20 md:w-24 md:h-24 bottom-5 right-5"
              }
              absolute`}
          />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-full">
          <h2 className="text-2xl mb-3">{status === "calling" ? "Calling..." : "In Call"}</h2>
          <div className="text-sm text-gray-400">Audio Call</div>
        </div>
      )}

      <div className="flex items-center justify-between p-3 bg-[#0f172a] rounded-b-2xl">
        <button
          aria-label="Toggle Call View"
          className="rounded-full p-2 hover:bg-white/10 transition"
          onClick={(e) => {
            e.stopPropagation();
            toggleView();
          }}
        >
          <FiMinus size={24} />
        </button>

        <button
          aria-label="End Call"
          className="rounded-full p-2 hover:bg-red-700 bg-red-600 transition text-white"
          onClick={(e) => {
            e.stopPropagation();
            endCall();
          }}
        >
          <FiPhoneOff size={24} />
        </button>
      </div>
    </div>
  );
};

export default CallWindow;
