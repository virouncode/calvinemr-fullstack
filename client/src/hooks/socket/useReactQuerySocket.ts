import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useSocketContext from "../context/useSocketContext";

const useReactQuerySocket = () => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!socket) return;
    const onMessage = (message: { key: string[] }) => {
      if (!message.key) return;
      const queryKey = message.key;
      try {
        queryClient.invalidateQueries({ queryKey });
      } catch (err) {
        if (err instanceof Error) toast.error(`Error:${err.message}`);
        return;
      }
    };
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [queryClient, socket]);
};

export default useReactQuerySocket;
