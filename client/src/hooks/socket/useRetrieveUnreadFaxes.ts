import axios from "axios";
import { useEffect } from "react";
import useSocketContext from "../context/useSocketContext";
import useUserContext from "../context/useUserContext";

const useRetrieveUnreadFaxes = () => {
  const { socket } = useSocketContext();
  const { user } = useUserContext();

  useEffect(() => {
    if (!socket || user?.access_level !== "staff") return;

    const fetchUnreadFaxes = async () => {
      try {
        const response = await axios.post(`/api/srfax/inbox`, {
          viewedStatus: "UNREAD",
          all: true,
          start: "",
          end: "",
        });
        const unreadFaxNbr = response.data.length;
        socket.emit("message", {
          action: "create",
          route: "UNREAD FAX",
          content: {
            data: unreadFaxNbr,
          },
        });
      } catch (error) {
        console.error("Failed to retrieve unread faxes:", error);
      }
    };

    const timerId = setInterval(fetchUnreadFaxes, 10000);

    return () => {
      clearInterval(timerId);
    };
  }, [socket, user?.access_level]);
};

export default useRetrieveUnreadFaxes;
