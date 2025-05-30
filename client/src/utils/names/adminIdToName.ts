import { AdminType } from "../../types/api";
import abreviateName from "./abreviateName";

export const adminIdToName = (
  adminsInfos: AdminType[],
  adminId: number,
  abreviatted: boolean = true,
  formatted: boolean = true
) => {
  if (!adminId) return "";
  const firstName =
    adminsInfos.find(({ id }) => id === adminId)?.first_name || "";
  const lastName =
    adminsInfos.find(({ id }) => id === adminId)?.last_name || "";
  if (abreviatted) {
    return abreviateName(
      adminsInfos.find(({ id }) => id === adminId)?.full_name ?? "",
      formatted
    );
  } else {
    return formatted
      ? lastName.toUpperCase() + ", " + firstName
      : firstName + " " + lastName;
  }
};
