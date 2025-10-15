import axios from "axios";
import { Server as SocketIOServer } from "socket.io";

const POLLING_INTERVAL_MS = 10000;
const AXIOS_TIMEOUT_MS = 8000;

let pollingInterval: NodeJS.Timeout | null = null;
let previousUnreadFaxNbr = 0;

export const fetchUnreadFaxes = async (io: SocketIOServer) => {
  try {
    const response = await axios.post(
      `${process.env.BACKEND_URL}/api/srfax/inbox`,
      {
        viewedStatus: "UNREAD",
        all: true,
        start: "",
        end: "",
      },
      { timeout: AXIOS_TIMEOUT_MS }
    );
    const unreadFaxNbr = response.data.length;
    if (unreadFaxNbr !== previousUnreadFaxNbr) {
      previousUnreadFaxNbr = unreadFaxNbr;
      //Counter notification for unread faxes
      io.emit("message", {
        action: "create",
        route: "UNREAD FAX",
        content: { data: unreadFaxNbr },
      });
      // New event to refresh fax data
      io.emit("message", {
        action: "refresh",
        route: "FAX DATA",
        content: { unreadCount: unreadFaxNbr },
      });
    }
  } catch (error) {
    if (error instanceof Error)
      console.error("Failed to retrieve unread faxes:", error.message);
  }
};

export const startPollingFaxes = (io: SocketIOServer) => {
  if (!pollingInterval) {
    pollingInterval = setInterval(
      () => fetchUnreadFaxes(io),
      POLLING_INTERVAL_MS
    );
    console.log("Polling started");
  }
};

export const stopPollingFaxes = () => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
    console.log("Polling stopped");
  }
};
