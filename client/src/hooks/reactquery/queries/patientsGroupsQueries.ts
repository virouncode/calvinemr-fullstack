import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { PaginatedGroupsType } from "../../../types/api";

export const usePatientsGroups = (staffId: number) => {
  return useQuery({
    queryKey: ["groups", staffId],
    queryFn: (): Promise<PaginatedGroupsType> =>
      xanoGet("/groups_of_staff", "staff", { staff_id: staffId }),
  });
};

export const useGlobalPatientsGroups = () => {
  return useQuery({
    queryKey: ["clinic groups"],
    queryFn: (): Promise<PaginatedGroupsType> =>
      xanoGet("/clinic_groups", "staff"),
  });
};
