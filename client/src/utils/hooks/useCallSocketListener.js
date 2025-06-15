import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { socket } from "../socket";
import {
  setCallState,
  setCallStatus,
  resetCallState,
} from "../../features/call/callSlice";

export function useCallSocketListener() {
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on(
      "incomingCall",
      ({ from, callId, signalData, callType, chatId, isGroupCall }) => {
        dispatch(
          setCallState({
            status: "incoming",
            type: callType,
            callId,
            chatId,
            peerId: from,
            isGroupCall: !!isGroupCall,
            isFloating: true,
            signalData,
          })
        );
      }
    );

    socket.on(
      "callStarted",
      ({ from, callId, signalData, callType, chatId, isGroupCall }) => {
        dispatch(
          setCallState({
            status: "calling",
            type: callType,
            callId,
            chatId,
            isGroupCall: !!isGroupCall,
            isFloating: true,
            signalData,
          })
        );
      }
    );

    socket.on("signal",({ callId, signal }) => {
      console.log("signal")
    })

    socket.on("callAccepted", ({ callId, signal }) => {
      dispatch(setCallStatus("in-call"));
    });

    socket.on("callRejected", () => {
      dispatch(resetCallState());
      // endPeerConnection();
    });

    socket.on("callEnded", () => {
      dispatch(resetCallState());
      // endPeerConnection();
    });

    socket.on("callError", ({ message }) => {
      console.error("Call error:", message);
      dispatch(resetCallState());
      // endPeerConnection();
    });

    return () => {
      socket.off("incomingCall");
      socket.off("callStarted");
      socket.off("callAccepted");
      socket.off("callRejected");
      socket.off("callEnded");
      socket.off("callError");
    };
  }, [dispatch]);
}
