import { SocketMessageType, UserStaffType } from "../types/app";

export const onFaxUnread = (
  message: SocketMessageType<null | number>,
  user: UserStaffType,
  setUser: React.Dispatch<React.SetStateAction<UserStaffType>>
) => {
  if (message.route !== "UNREAD FAX") return;
  if (message.action === "update") {
    setUser({
      ...user,
      unreadFaxNbr: user?.unreadFaxNbr - 1,
    });
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        unreadFaxNbr: user?.unreadFaxNbr - 1,
      })
    );
  } else if (message.action === "create") {
    setUser({
      ...user,
      unreadFaxNbr: message?.content?.data ?? 0,
    });
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        unreadFaxNbr: message?.content?.data ?? 0,
      })
    );
  }
};
