import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { AvailabilityType } from "../../../types/api";

export const useUserSchedule = (userId: number) => {
  return useQuery<AvailabilityType>({
    queryKey: ["schedule", userId],
    queryFn: () =>
      xanoGet("/availability_of_staff", "staff", {
        staff_id: userId,
      }),
  });
};

export const useAssignedPracticianSchedule = (practicianId: number) => {
  return useQuery<AvailabilityType>({
    queryKey: ["schedule", practicianId],
    queryFn: () =>
      xanoGet("/availability_of_staff", "patient", {
        staff_id: practicianId,
      }),
  });
};
