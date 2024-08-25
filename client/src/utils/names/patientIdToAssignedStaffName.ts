import { DemographicsType, StaffType } from "../../types/api";
import { staffIdToTitleAndName } from "./staffIdToTitleAndName";

export const patientIdToAssignedStaffTitleAndName = (
  demographicsInfos: DemographicsType | undefined,
  staffInfos: StaffType[],
  patientId: number
) => {
  if (!patientId || !demographicsInfos) return "";
  return staffIdToTitleAndName(staffInfos, demographicsInfos.assigned_staff_id);
};
