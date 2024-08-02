import { staffIdToTitleAndName } from "./staffIdToTitleAndName";

export const patientIdToAssignedStaffTitleAndName = (
  demographicsInfos,
  staffInfos,
  patientId
) => {
  if (!patientId) return "";
  return staffIdToTitleAndName(staffInfos, demographicsInfos.assigned_staff_id);
};
