import { AdminType } from "../types/api";
import { SocketMessageType } from "../types/app";

export const onMessageAdminsInfos = (
  message: SocketMessageType<AdminType>,
  adminsInfos: AdminType[],
  setAdminsInfos: React.Dispatch<React.SetStateAction<AdminType[]>>
) => {
  if (message.route !== "ADMINS INFOS") return;
  switch (message.action) {
    case "update":
      setAdminsInfos(
        adminsInfos.map((item) =>
          item.id === message.content.id ? message.content.data : item
        )
      );
      localStorage.setItem(
        "adminsInfos",
        JSON.stringify(
          adminsInfos.map((item) =>
            item.id === message.content.id ? message.content.data : item
          )
        )
      );
      break;
    default:
      break;
  }
};
