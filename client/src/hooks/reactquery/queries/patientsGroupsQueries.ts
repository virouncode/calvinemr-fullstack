import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { GroupType, PaginatedDatasType } from "../../../types/api";

export const usePatientsGroups = (staffId: number) => {
  return useQuery({
    queryKey: ["groups", staffId],
    queryFn: (): Promise<PaginatedDatasType<GroupType>> =>
      xanoGet("/groups_of_staff", "staff", { staff_id: staffId }),
  });
};

export const useGlobalPatientsGroups = () => {
  return useQuery({
    queryKey: ["clinic groups"],
    queryFn: (): Promise<PaginatedDatasType<GroupType>> =>
      xanoGet("/clinic_groups", "staff"),
  });
};
