import { useEffect, useRef, useState } from "react";

export const useMediaStream = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  useEffect(() => {
    let stream: MediaStream;

    const startLocalVideo = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Failed to access media devices:", err);
      }
    };

    startLocalVideo();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const toggleMic = () => {
    if (!localStream) return;
    localStream.getAudioTracks().forEach((track) => (track.enabled = !track.enabled));
    setIsMicOn((prev) => !prev);
  };

  const toggleCamera = () => {
    if (!localStream) return;
    localStream.getVideoTracks().forEach((track) => (track.enabled = !track.enabled));
    setIsCameraOn((prev) => !prev);
  };

  const stopMedia = () => {
    localStream?.getTracks().forEach((track) => track.stop());
  };

  return {
    localStream,
    localVideoRef,
    remoteVideoRef,
    isMicOn,
    isCameraOn,
    toggleMic,
    toggleCamera,
    stopMedia,
  };
};
