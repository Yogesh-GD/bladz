import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../socket";
import { setCallState } from "../../features/call/callSlice";

export function useCallManager() {
  const authUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const startCall = useCallback(
    ({ type, receiverId, chatId, isGroupCall = false, signalData = {} }) => {
      if (!authUser) {
        console.error("User not authenticated");
        return;
      }
      socket.emit("callUser", {
        userToCall: receiverId,
        signalData,
        from: authUser._id,
        callType: type,
        chatId,
        isGroupCall,
      });

      dispatch(
        setCallState({
          status: "initiated",
          type,
          receiverId,
          chatId,
          isGroupCall,
          signalData,
        })
      );
    },
    [authUser, dispatch]
  );

  return { startCall };
}
