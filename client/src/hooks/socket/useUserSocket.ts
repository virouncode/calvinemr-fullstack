import { useEffect } from "react";
import { onMessageUser } from "../../socketHandlers/onMessageUser";
import { SocketMessageType, UserType } from "../../types/app";
import useSocketContext from "../context/useSocketContext";
import useUserContext from "../context/useUserContext";

const useUserSocket = () => {
  const { socket } = useSocketContext();
  const { user, setUser } = useUserContext();
  useEffect(() => {
    if (!socket || !user) return;
    const onMessage = (message: SocketMessageType<Exclude<UserType, null>>) => {
      onMessageUser(
        message,
        user,
        setUser as React.Dispatch<
          React.SetStateAction<Exclude<UserType, null>>
        >,
        user.access_level,
        user.id
      );
    };
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [setUser, socket, user]);
};

export default useUserSocket;
