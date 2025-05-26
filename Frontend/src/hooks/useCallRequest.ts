import { useEffect, useState, useRef } from "react";
import { CreatesocketConnection } from "../constant/socket"; 
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

type AlertType = {
  message: string;
  severity: "success" | "error" | "info" | "warning";
};

export const useCallRequest = () => {
  const [calling, setCalling] = useState(false);
  const [callAlert, setCallAlert] = useState<AlertType | null>(null);
  const navigate = useNavigate();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
 
    if (!socketRef.current) {
      socketRef.current = CreatesocketConnection();
    }

    const socket = socketRef.current;

    socket.on("call:accepted", ({role}) => {
    
      
      setCallAlert({ message: "Call accepted", severity: "success" });
      setCalling(false);
      if(role=='user'){
      navigate("/userhome/call");
      }else{
        navigate("/driver/call");
      }
    });

    socket.on("call:rejected", () => {
      setCallAlert({ message: "Call rejected", severity: "info" });
    
      setCalling(false);
    });

    socket.on("call:unavailable", () => {
   
      setCallAlert({ message: "Receiver is offline", severity: "error" });
      setCalling(false);
    });

    return () => {
      socket.off("call:accepted");
      socket.off("call:rejected");
      socket.off("call:unavailable");
    };
  }, [calling, navigate]);

  const initiateCall = ({
    fromId,
    toId,
    callerName,
    role,
  }: {
    fromId: string;
    toId: string;
    callerName: string;
    role: "user" | "driver";
  }) => {
    if (!socketRef.current) return;

    setCalling(true);
    socketRef.current.emit("call:request", {
      fromId,
      toId,
      callerName,
      role,
    });

    setTimeout(() => {
      if (calling) {
        setCallAlert({ message: "Call not answered", severity: "error" });
        setCalling(false);
      }
    }, 15000);
  };

  return { initiateCall, calling, callAlert,setCallAlert };
};
