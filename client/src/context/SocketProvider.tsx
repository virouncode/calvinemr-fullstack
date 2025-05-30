import React, { createContext, PropsWithChildren, useState } from "react";
import { Socket } from "socket.io-client";
import { SocketContextType } from "../types/app";

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  return (
    <SocketContext.Provider
      value={{
        socket,
        setSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
