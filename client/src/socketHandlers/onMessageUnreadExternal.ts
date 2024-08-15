import {
  SocketMessageType,
  UserPatientType,
  UserStaffType,
} from "../types/app";

export const onMessageUnreadExternal = (
  message: SocketMessageType<null>,
  user: UserStaffType | UserPatientType,
  setUser: React.Dispatch<
    React.SetStateAction<UserStaffType | UserPatientType>
  >,
  userAccessLevel: string,
  userId: number
) => {
  if (message.route !== "UNREAD EXTERNAL") return;
  if (
    userAccessLevel === user.access_level &&
    message.content.userId === userId
  ) {
    switch (message.action) {
      case "update":
        if (userAccessLevel === "staff") {
          setUser({
            ...(user as UserStaffType),
            unreadMessagesExternalNbr:
              (user as UserStaffType).unreadMessagesExternalNbr + 1,
            unreadNbr: user.unreadNbr + 1,
          });
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...user,
              unreadMessagesExternalNbr:
                (user as UserStaffType).unreadMessagesExternalNbr + 1,
              unreadNbr: user.unreadNbr + 1,
            })
          );
        } else if (userAccessLevel === "patient") {
          setUser({
            ...(user as UserPatientType),
            unreadNbr: (user as UserStaffType).unreadNbr + 1,
          });
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...user,
              unreadNbr: user.unreadNbr + 1,
            })
          );
        }
        break;
      default:
        break;
    }
  }
};
