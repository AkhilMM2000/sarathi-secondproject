import React, { useEffect, useRef } from "react";
import VideoCallScreen from "./VideoCallScreen";
import { useLocation, useNavigate } from "react-router-dom";
import { useMediaStream } from "../hooks/useMediaStream";
import { createPeerConnection, setPeerConnection } from "../webrtc/peerConnection";
import { registerSignalingEvents, sendOffer } from "../webrtc/signalingClient";
import { CreatesocketConnection } from "../constant/socket";

type Props = {
  role: "user" | "driver";
};

const VideoCall: React.FC<Props> = ({ role }) => {
  const {
    localVideoRef,
    remoteVideoRef,
    isMicOn,
    isCameraOn,
    toggleMic,
    toggleCamera,
    stopMedia,
    localStream
  } = useMediaStream();

  const navigate = useNavigate();
  const location = useLocation();
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const socket = CreatesocketConnection(); // ✅ Maintain a consistent socket instance

  const query = new URLSearchParams(location.search);
  const callrole = query.get("type") === "receiver" ? "receiver" : "caller";

  const handleEndCall = () => {
      socket.emit("call-ended",{role});
    stopMedia();
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    if (role === "user") {
      navigate("/userhome/rides");
    } else {
      navigate("/driver/rides");
    }
     
  };

  useEffect(() => {
    const start = async () => {
      try {
        if (!localStream || !remoteVideoRef.current) return;

        const pc = createPeerConnection();
        setPeerConnection(pc); // ✅ Register globally
        peerConnectionRef.current = pc;

        registerSignalingEvents(remoteVideoRef.current);

socket.on("call-ended", ({ callEnder }) => {
  console.log("[Call] Remote party ended the call",callEnder);

  stopMedia();
  peerConnectionRef.current?.close();
  peerConnectionRef.current = null;
  if(callEnder.role=='user'){
   navigate("/driver/rides");
  
  }else{
     
       navigate("/userhome/rides");
  }
 
});

        if (callrole === "caller") {
          await sendOffer(localStream);
        } else {
          // Receiver adds local stream tracks
          localStream.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
          });
           
        }
      } catch (err) {
        console.error("Error starting video call:", err);
      }
    };

    start();
  }, [callrole, localStream]);

  useEffect(() => {
    return () => {
      stopMedia();
      peerConnectionRef.current?.close();
      peerConnectionRef.current = null;

      // ✅ Unsubscribe from signaling events
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("call-ended");

    };
  }, []);

  return (
    <VideoCallScreen
      callerName={callrole === "caller" ? "Calling Driver..." : "Incoming Call..."}
      localStreamRef={localVideoRef}
      remoteStreamRef={remoteVideoRef}
      isMicOn={isMicOn}
      isCameraOn={isCameraOn}
      onToggleMic={toggleMic}
      onToggleCamera={toggleCamera}
      onEndCall={handleEndCall}
    />
  );
};

export default VideoCall;
