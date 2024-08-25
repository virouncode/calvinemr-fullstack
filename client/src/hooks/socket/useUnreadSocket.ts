import { useEffect } from "react";
import { onMessageUnread } from "../../socketHandlers/onMessageUnread";
import { SocketMessageType, UserStaffType } from "../../types/app";
import useSocketContext from "../context/useSocketContext";
import useUserContext from "../context/useUserContext";

const useUnreadSocket = () => {
  const { socket } = useSocketContext();
  const { user, setUser } = useUserContext();
  useEffect(() => {
    if (!socket || user?.access_level !== "staff") return;
    const onMessage = (message: SocketMessageType<null>) => {
      onMessageUnread(
        message,
        user as UserStaffType,
        setUser as React.Dispatch<React.SetStateAction<UserStaffType>>,
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

export default useUnreadSocket;
