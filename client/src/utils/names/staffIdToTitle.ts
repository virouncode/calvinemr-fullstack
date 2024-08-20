import { StaffType } from "../../types/api";

export const staffIdToTitle = (staffInfos: StaffType[], staffId: number) => {
  if (staffId === 0) return "";
  return staffInfos.find(({ id }) => id === staffId)?.title === "Doctor"
    ? "Dr. "
    : "";
};
