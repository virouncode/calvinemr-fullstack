import { SocketMessageType, UserStaffType } from "../types/app";

export const onMessageUnread = (
  message: SocketMessageType<null>,
  user: UserStaffType,
  setUser: React.Dispatch<React.SetStateAction<UserStaffType>>,
  userAccessLevel: string,
  userId: number
) => {
  if (message.route !== "UNREAD") return;
  if (
    userAccessLevel === user?.access_level &&
    message.content.userId === userId
  ) {
    switch (message.action) {
      case "update":
        setUser({
          ...user,
          unreadMessagesNbr: user?.unreadMessagesNbr + 1,
          unreadNbr: user?.unreadNbr + 1,
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            unreadMessagesNbr: user?.unreadMessagesNbr + 1,
            unreadNbr: user?.unreadNbr + 1,
          })
        );
        break;
      default:
        break;
    }
  }
};
