import { useEffect } from "react";
import { onMessageUnreadTodo } from "../../socketHandlers/onMessageUnreadTodo";
import useSocketContext from "../context/useSocketContext";
import useUserContext from "../context/useUserContext";

const useUnreadTodoSocket = () => {
  const { socket } = useSocketContext();
  const { user, setUser } = useUserContext();
  useEffect(() => {
    if (!socket || user?.access_level !== "staff") return;
    const onMessage = (message) => {
      onMessageUnreadTodo(message, user, setUser, user?.access_level, user?.id);
    };
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [setUser, socket, user]);
};

export default useUnreadTodoSocket;
