import { useEffect } from "react";
import socketIOClient from "socket.io-client";
import useSocketContext from "../../context/useSocketContext";

const useSocketConfig = () => {
  const { setSocket } = useSocketContext();
  useEffect(() => {
    const socket = socketIOClient(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
    });
    setSocket(socket);
    return () => {
      socket.disconnect();
    };
  }, [setSocket]);
};

export default useSocketConfig;
