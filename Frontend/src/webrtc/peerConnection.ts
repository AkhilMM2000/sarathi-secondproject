let pc: RTCPeerConnection | null = null;

export const createPeerConnection = (): RTCPeerConnection => {
  if (pc) {
    try {
      pc.close();
    } catch (err) {
      console.warn("Error closing previous peer connection:", err);
    }
  }

  pc = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  console.log("[PeerConnection] New peer connection created");
  return pc;
};

export const getPeerConnection = (): RTCPeerConnection => {
  if (!pc) {
    throw new Error("PeerConnection not created yet. Call createPeerConnection() first.");
  }
  return pc;
};

export const setPeerConnection = (connection: RTCPeerConnection) => {
  pc = connection;
};

export const closePeerConnection = () => {
  if (pc) {
    pc.close();
    console.log("[PeerConnection] Closed peer connection");
    pc = null;
  }
};
