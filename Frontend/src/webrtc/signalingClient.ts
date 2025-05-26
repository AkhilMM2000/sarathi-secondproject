import { CreatesocketConnection } from "../constant/socket";
import { getPeerConnection } from "./peerConnection";

const socket = CreatesocketConnection();

export const sendOffer = async (localStream: MediaStream) => {
  try {
    const pc = getPeerConnection(); // 🔁 always get fresh reference

    localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    console.log("[Signaling] Sending offer...");
    //session description protocol
    socket.emit("offer", { offer });
  } catch (err) {
    console.error("[Signaling] Failed to send offer:", err);
  }
};

export const registerSignalingEvents = (remoteVideoElement: HTMLVideoElement) => {
  socket.removeAllListeners("offer");
  socket.removeAllListeners("answer");
  socket.removeAllListeners("ice-candidate");

  // When receiver gets an offer
  socket.on("offer", async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
    console.log("[Signaling] Offer received");

    try {
      const pc = getPeerConnection();

      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      console.log("[Signaling] Sending answer...");
      socket.emit("answer", { answer });
    } catch (err) {
      console.error("[Signaling] Error handling offer:", err);
    }
  });

  socket.on("answer", async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
    console.log("[Signaling] Answer received");

    try {
      const pc = getPeerConnection();

      if (!pc.currentRemoteDescription) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("[Signaling] Answer set successfully");
      } else {
        console.warn("[Signaling] Skipping answer; already has remote description");
      }
    } catch (err) {
      console.error("[Signaling] Error setting answer:", err);
    }
  });

  socket.on("ice-candidate", async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
    try {
      const pc = getPeerConnection();
      await pc.addIceCandidate(new RTCIceCandidate(candidate));
      console.log("[Signaling] ICE candidate added");
    } catch (err) {
      console.error("[Signaling] Error adding ICE candidate:", err);
    }
  });



  
  const pc = getPeerConnection();

  pc.onicecandidate = (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      socket.emit("ice-candidate", { candidate: event.candidate });
    }
  };

  pc.ontrack = (event: RTCTrackEvent) => {
    console.log("[Signaling] Remote track received");
    if (remoteVideoElement && event.streams.length > 0) {
      remoteVideoElement.srcObject = event.streams[0];
    }
  };
};
