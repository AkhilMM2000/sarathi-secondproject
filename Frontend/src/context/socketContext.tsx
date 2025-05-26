
import React, { createContext, ReactNode, useContext, useEffect } from "react";
import { CreatesocketConnection } from "../constant/socket"; 
interface SocketProviderProps {
    children: ReactNode;
  }
const socket = CreatesocketConnection(); 
const SocketContext = createContext(socket);

export const SocketProvider:React.FC<SocketProviderProps> = ({ children }) => {
  useEffect(() => {
    return () => {
      socket.disconnect(); 
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
