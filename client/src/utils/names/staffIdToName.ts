import { StaffType } from "../../types/api";

export const staffIdToName = (
  staffInfos: StaffType[],
  staffId: number,
  formatted = true
) => {
  if (!staffId) return "";
  const firstName =
    staffInfos.find(({ id }) => id === staffId)?.first_name || "";
  const lastName = staffInfos.find(({ id }) => id === staffId)?.last_name || "";
  const middleName = staffInfos.find(({ id }) => id === staffId)?.middle_name
    ? ` ${staffInfos.find(({ id }) => id === staffId)?.middle_name}`
    : "";
  return formatted
    ? lastName.toUpperCase() + ", " + firstName + middleName
    : firstName + middleName + " " + lastName;
};

export const staffIdToFirstName = (
  staffInfos: StaffType[],
  staffId: number
) => {
  if (!staffId) return "";
  return staffInfos.find(({ id }) => id === staffId)?.first_name || "";
};

export const staffIdToLastName = (staffInfos: StaffType[], staffId: number) => {
  if (!staffId) return "";
  return staffInfos.find(({ id }) => id === staffId)?.last_name || "";
};

export const staffIdToOHIP = (staffInfos: StaffType[], staffId: number) => {
  if (!staffId) return "";
  return staffInfos.find(({ id }) => id === staffId)?.ohip_billing_nbr || "";
};
