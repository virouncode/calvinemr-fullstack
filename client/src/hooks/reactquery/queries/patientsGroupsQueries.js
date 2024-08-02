import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";

export const usePatientsGroups = (staffId) => {
  return useQuery({
    queryKey: ["groups", staffId],
    queryFn: () => xanoGet("/groups_of_staff", "staff", { staff_id: staffId }),
  });
};

export const useGlobalPatientsGroups = () => {
  return useQuery({
    queryKey: ["clinic groups"],
    queryFn: () => xanoGet("/clinic_groups", "staff"),
  });
};
