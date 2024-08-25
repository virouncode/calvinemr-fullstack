import { useEffect } from "react";
import useSocketContext from "../context/useSocketContext";

export const useServerErrorSocket = (
  setServerErrorMsg: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  const { socket } = useSocketContext();
  useEffect(() => {
    if (!socket) return;
    const handleServerError = ({ message }: { message: string }) => {
      setServerErrorMsg(message);
    };
    socket.on("serverError", handleServerError);
    return () => {
      socket.off("serverError", handleServerError);
    };
  }, [setServerErrorMsg, socket]);
};
