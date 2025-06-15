import { useEffect, useRef, useState, useCallback } from "react";
import Peer from "simple-peer";
import { useSelector, useDispatch } from "react-redux";
import { socket } from "../socket";
import { resetCallState } from "../../features/call/callSlice";
import { useMediaStream } from "./useMediaStream";

export const usePeerConnection = () => {
  const dispatch = useDispatch();
  const { status, callId, type: callType } = useSelector((state) => state.call);

  const peerRef = useRef(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const {
    stream: localStream,
    startStream,
    stopStream,
  } = useMediaStream(callType);

  useEffect(() => {
    if (!callId || ![ "in-call"].includes(status) || !callType) return;

    startStream();

    return () => {
      stopStream();
    };
  }, [callId, status, callType, startStream, stopStream]);

  useEffect(() => {
    if (!localStream || !callId || ![ "in-call"].includes(status)) return;

    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    const isInitiator = status === "in-call";

    const peer = new Peer({
      initiator: isInitiator,
      trickle: false,
      stream: localStream,
    });

    peerRef.current = peer;

    peer.on("signal", (signalData) => {
      if (!callId) return;
      socket.emit("signal", { callId, signal: signalData });
    });

    peer.on("stream", (remoteMediaStream) => {
      setRemoteStream(remoteMediaStream);
    });

    peer.on("error", (err) => {
      cleanup();
    });

    peer.on("close", () => {
      cleanup();
    });

    const onSignal = (data) => {
      if (data.callId !== callId) return; 
      if (data.signal && peerRef.current) {
        try {
          peerRef.current.signal(data.signal);
        } catch (e) {
        }
      }
    };

    socket.off("signal", onSignal);
    socket.on("signal", onSignal);

    function cleanup() {
      if (peerRef.current) {
        peerRef.current.destroy();
        peerRef.current = null;
      }
      setRemoteStream(null);
      dispatch(resetCallState());
      socket.off("signal", onSignal);
    }

    return () => {
      cleanup();
      stopStream();
    };
  }, [localStream, callId, status, dispatch, stopStream]);

  const endPeerConnection = useCallback(() => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    stopStream();
    setRemoteStream(null);
    dispatch(resetCallState());
    socket.off("signal");
  }, [dispatch, stopStream]);

  return {
    localStream,
    remoteStream,
    endPeerConnection,
    peer: peerRef.current,
  };
};
