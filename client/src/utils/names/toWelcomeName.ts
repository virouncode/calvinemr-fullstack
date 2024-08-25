import { AdminType, StaffType } from "../../types/api";
import { UserType } from "../../types/app";
import { adminIdToName } from "./adminIdToName";
import { staffIdToTitleAndName } from "./staffIdToTitleAndName";
import { toPatientName } from "./toPatientName";

export const toWelcomeName = (
  user: UserType,
  staffInfos: StaffType[],
  adminsInfos: AdminType[]
) => {
  if (user?.access_level === "admin") {
    return adminIdToName(adminsInfos, user.id, false, true);
  } else if (user?.access_level === "staff") {
    return staffIdToTitleAndName(staffInfos, user.id, false, true);
  } else {
    return toPatientName(user?.demographics, true);
  }
};
