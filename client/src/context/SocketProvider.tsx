import React, {
  createContext,
  PropsWithChildren,
  useMemo,
  useState,
} from "react";
import { Socket } from "socket.io-client";
import { SocketContextType } from "../types/app";

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: PropsWithChildren) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const value = useMemo(() => ({ socket, setSocket }), [socket]);
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export default SocketContext;
