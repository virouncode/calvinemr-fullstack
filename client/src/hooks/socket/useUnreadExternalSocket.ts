import { useEffect } from "react";
import { onMessageUnreadExternal } from "../../socketHandlers/onMessageUnreadExternal";
import {
  SocketMessageType,
  UserPatientType,
  UserStaffType,
} from "../../types/app";
import useSocketContext from "../context/useSocketContext";
import useUserContext from "../context/useUserContext";

const useUnreadExternalSocket = () => {
  const { socket } = useSocketContext();
  const { user, setUser } = useUserContext();
  useEffect(() => {
    if (!socket || user?.access_level === "admin") return;
    const onMessage = (message: SocketMessageType<null>) => {
      onMessageUnreadExternal(
        message,
        user as UserStaffType | UserPatientType,
        setUser as React.Dispatch<
          React.SetStateAction<UserStaffType | UserPatientType>
        >,
        user?.access_level as string,
        user?.id as number
      );
    };
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [setUser, socket, user]);
};

export default useUnreadExternalSocket;
