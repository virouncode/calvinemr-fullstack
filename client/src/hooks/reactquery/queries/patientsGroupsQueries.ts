import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { GroupType } from "../../../types/api";

export const usePatientsGroups = (staffId: number) => {
  return useQuery<GroupType[]>({
    queryKey: ["groups", staffId],
    queryFn: () => xanoGet("/groups_of_staff", "staff", { staff_id: staffId }),
  });
};

export const useGlobalPatientsGroups = () => {
  return useQuery<GroupType[]>({
    queryKey: ["clinic groups"],
    queryFn: () => xanoGet("/clinic_groups", "staff"),
  });
};
