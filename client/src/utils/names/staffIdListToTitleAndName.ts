import { StaffType } from "../../types/api";
import { staffIdToTitleAndName } from "./staffIdToTitleAndName";

export const staffIdListToTitleAndName = (
  staffInfos: StaffType[],
  staffIdList: number[]
) => {
  return staffIdList
    .map((staffId) => staffIdToTitleAndName(staffInfos, staffId))
    .join(", ");
};
