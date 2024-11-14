import { useEffect } from "react";
import { onFaxUnread } from "../../socketHandlers/onFaxUnread";
import { SocketMessageType, UserStaffType } from "../../types/app";
import useSocketContext from "../context/useSocketContext";
import useUserContext from "../context/useUserContext";

const useUnreadFaxSocket = () => {
  const { socket } = useSocketContext();
  const { user, setUser } = useUserContext();
  useEffect(() => {
    if (!socket || user?.access_level !== "staff") return;
    const onMessage = (message: SocketMessageType<null>) => {
      onFaxUnread(
        message,
        user as UserStaffType,
        setUser as React.Dispatch<React.SetStateAction<UserStaffType>>
      );
    };
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [setUser, socket, user]);
};

export default useUnreadFaxSocket;
