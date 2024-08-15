import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { AvailabilityType } from "../../../types/api";

export const useAvailability = (userId: number) => {
  return useQuery({
    queryKey: ["schedule", userId],
    queryFn: (): Promise<AvailabilityType> =>
      xanoGet("/availability_of_staff", "staff", {
        staff_id: userId,
      }),
  });
};

export const useAssignedPracticianAvailability = (practicianId: number) => {
  return useQuery({
    queryKey: ["schedule", practicianId],
    queryFn: (): Promise<AvailabilityType> =>
      xanoGet("/availability_of_staff", "patient", {
        staff_id: practicianId,
      }),
  });
};
