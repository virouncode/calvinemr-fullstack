import { useEffect } from "react";
import useSocketContext from "../context/useSocketContext";

export const useServerErrorSocket = (setServerErrorMsg) => {
  const { socket } = useSocketContext();
  useEffect(() => {
    if (!socket) return;
    const handleServerError = ({ message }) => {
      setServerErrorMsg(message);
    };
    socket.on("serverError", handleServerError);
    return () => {
      socket.off("serverError", handleServerError);
    };
  }, [setServerErrorMsg, socket]);
};
