import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";

export const useUserSchedule = (userId) => {
  return useQuery({
    queryKey: ["schedule", userId],
    queryFn: () =>
      xanoGet("/availability_of_staff", "staff", {
        staff_id: userId,
      }),
  });
};

export const useAssignedPracticianSchedule = (practicianId) => {
  return useQuery({
    queryKey: ["schedule", practicianId],
    queryFn: () =>
      xanoGet("/availability_of_staff", "patient", {
        staff_id: practicianId,
      }),
  });
};
