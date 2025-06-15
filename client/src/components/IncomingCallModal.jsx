import { useSelector, useDispatch } from "react-redux";
import { setCallStatus, resetCallState } from "../features/call/callSlice";
import { socket } from "../utils/socket";

const IncomingCallModal = () => {
  const dispatch = useDispatch();
  const { status, type, peerId, callId } = useSelector((state) => state.call);

  if (status !== "incoming") return null;

  const handleAccept = () => {

        socket.emit("answerCall",({callId,signal :{}}))

    dispatch(setCallStatus("in-call"));
  };

  const handleReject = () => {
    socket.emit("rejectCall",({callId}))
    dispatch(resetCallState());
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-[#1A2130] text-white shadow-xl rounded-xl p-4 w-[90vw] max-w-xs">
      <p className="font-semibold text-lg">
        {type === "video" ? "Incoming Video Call" : "Incoming Audio Call"}
      </p>
      <p className="text-sm text-gray-400 mt-1 truncate">From: {peerId || "Unknown"}</p>

      <div className="flex justify-between items-center gap-4 mt-4">
        <button
          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
          onClick={handleAccept}
        >
          Accept
        </button>
        <button
          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
          onClick={handleReject}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default IncomingCallModal;
