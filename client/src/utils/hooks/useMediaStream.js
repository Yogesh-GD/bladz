import { useState, useCallback, useEffect } from "react";

export function useMediaStream(type = "audio") {
  const [stream, setStream] = useState(null);
  const [error, setError] = useState(null);

  const startStream = useCallback(async () => {
    if (stream) return; // Already started

    try {
      const constraints =
        type === "video"
          ? { video: true, audio: true }
          : { video: false, audio: true };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
    } catch (err) {
      setError(err);
    }
  }, [stream, type]);

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (stream) {
    }
  }, [stream]);

  return { stream, error, startStream, stopStream };
}
