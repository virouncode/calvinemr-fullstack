import { DemographicsType, StaffType } from "../../types/api";
import { staffIdToTitleAndName } from "./staffIdToTitleAndName";

export const patientIdToAssignedStaffTitleAndName = (
  demographicsInfos: DemographicsType,
  staffInfos: StaffType[],
  patientId: number
) => {
  if (!patientId) return "";
  return staffIdToTitleAndName(staffInfos, demographicsInfos.assigned_staff_id);
};
