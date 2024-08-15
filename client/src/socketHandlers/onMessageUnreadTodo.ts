import { TodoType } from "../types/api";
import { SocketMessageType, UserStaffType } from "../types/app";

export const onMessageUnreadTodo = (
  message: SocketMessageType<TodoType>,
  user: UserStaffType,
  setUser: React.Dispatch<React.SetStateAction<UserStaffType>>,
  userAccessLevel: string,
  userId: number
) => {
  if (message.route !== "UNREAD TO-DO") return;
  if (
    userAccessLevel === user.access_level &&
    message.content.userId === userId
  ) {
    switch (message.action) {
      case "update":
        setUser({
          ...user,
          unreadTodosNbr: user.unreadTodosNbr + 1,
          unreadNbr: user.unreadNbr + 1,
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            unreadTodosNbr: user.unreadTodosNbr + 1,
            unreadNbr: user.unreadNbr + 1,
          })
        );
        break;
      default:
        break;
    }
  }
};
