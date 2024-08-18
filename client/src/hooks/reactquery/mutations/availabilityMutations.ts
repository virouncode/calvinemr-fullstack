import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import { AvailabilityType } from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";

export const useAvailabilityPut = (userId: number) => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (availabilityToPut: Partial<AvailabilityType>) =>
      xanoPut(
        `/availability/${availabilityToPut.id}`,
        "staff",
        availabilityToPut
      ),
    onMutate: async (availabilityToPut: Partial<AvailabilityType>) => {
      await queryClient.cancelQueries({ queryKey: ["availability", userId] });
      const previousSchedule: AvailabilityType | undefined =
        queryClient.getQueryData(["availability", userId]);
      queryClient.setQueryData(["availability", userId], availabilityToPut);
      return { previousSchedule };
    },
    onSuccess: () => {
      socket?.emit("message", { key: ["availability", userId] });
      toast.success("Availability updated succesfully", { containerId: "A" });
    },

    onError: (error, variables, context) => {
      queryClient.setQueryData(
        ["availability", userId],
        context?.previousSchedule
      );
      toast.error(`Error: unable to update availability: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
