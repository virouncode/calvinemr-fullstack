import { useEffect } from "react";
import socketIOClient from "socket.io-client";
import useSocketContext from "../../context/useSocketContext";

const useSocketConfig = () => {
  const { setSocket } = useSocketContext();
  useEffect(() => {
    const socket = socketIOClient(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
    });
    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected", reason);
    });

    socket.on("reconnect_attempt", (attemptNumber) => {
      console.log(`Socket reconnexion attempt #${attemptNumber}`);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log(`Reconnexion succeed after ${attemptNumber} tries`);
    });

    socket.on("reconnect_failed", () => {
      console.log("Socket reconnexion failure");
    });
    setSocket(socket);
    return () => {
      socket.disconnect();
    };
  }, [setSocket]);
};

export default useSocketConfig;
