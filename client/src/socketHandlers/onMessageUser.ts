import { SocketMessageType, UserType } from "../types/app";

export const onMessageUser = (
  message: SocketMessageType<Exclude<UserType, null>>,
  user: Exclude<UserType, null>,
  setUser: React.Dispatch<React.SetStateAction<Exclude<UserType, null>>>,
  userAccessLevel: string,
  userId: number
) => {
  if (message.route !== "USER") return;
  console.log("message", message);

  if (userAccessLevel === user.access_level && message.content.id === userId) {
    switch (message.action) {
      case "update":
        setUser(message.content.data);
        localStorage.setItem("user", JSON.stringify(message.content.data));
        break;
      default:
        break;
    }
  }
};
