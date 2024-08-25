import { ClinicType } from "../types/api";
import { SocketMessageType } from "../types/app";

export const onMessageClinic = (
  message: SocketMessageType<ClinicType>,
  setClinic: React.Dispatch<React.SetStateAction<ClinicType | null>>
) => {
  if (message.route !== "CLINIC") return;
  switch (message.action) {
    case "update":
      setClinic(message.content.data);
      localStorage.setItem("clinic", JSON.stringify(message.content.data));
      break;
    default:
      break;
  }
};
