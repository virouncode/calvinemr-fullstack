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
      console.log("Connecté au serveur");
    });

    socket.on("disconnect", (reason) => {
      console.log("Déconnecté:", reason);
    });

    socket.on("reconnect_attempt", (attemptNumber) => {
      console.log(`Tentative de reconnexion #${attemptNumber}`);
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log(`Reconnexion réussie après ${attemptNumber} tentatives`);
    });

    socket.on("reconnect_failed", () => {
      console.log("Échec des tentatives de reconnexion");
    });
    setSocket(socket);
    return () => {
      socket.disconnect();
    };
  }, [setSocket]);
};

export default useSocketConfig;
