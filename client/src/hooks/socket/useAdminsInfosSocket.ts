import { useEffect } from "react";
import { onMessageAdminsInfos } from "../../socketHandlers/onMessageAdminsInfos";
import { AdminType } from "../../types/api";
import { SocketMessageType } from "../../types/app";
import useAdminsInfosContext from "../context/useAdminsInfosContext";
import useSocketContext from "../context/useSocketContext";

const useAdminsInfosSocket = () => {
  const { socket } = useSocketContext();
  const { adminsInfos, setAdminsInfos } = useAdminsInfosContext();

  useEffect(() => {
    if (!socket) return;
    const onMessage = (message: SocketMessageType<AdminType>) => {
      onMessageAdminsInfos(message, adminsInfos, setAdminsInfos);
    };
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [adminsInfos, setAdminsInfos, socket]);
};

export default useAdminsInfosSocket;
