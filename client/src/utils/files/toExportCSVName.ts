import { StaffType } from "../../types/api";
import { timestampToDateISOTZ } from "../dates/formatDates";
import { staffIdToTitleAndName } from "../names/staffIdToTitleAndName";

export const toExportCSVName = (
  accessLevel: string,
  userTitle: string,
  rangeStart: number,
  rangeEnd: number,
  all: boolean,
  staffInfos: StaffType[],
  staffId: number
) => {
  const start = all ? "" : `_${timestampToDateISOTZ(rangeStart)}`;
  const end = all ? "" : `_to_${timestampToDateISOTZ(rangeEnd)}`;
  const allCaption = all ? "_All" : "";
  let name = "";

  if (accessLevel === "Admin" || userTitle === "Secretary") {
    name = "";
  } else {
    name = `_${staffIdToTitleAndName(staffInfos, staffId, false, false)}`;
  }

  return `Billings${name}${start}${end}${allCaption}.csv`;
};
