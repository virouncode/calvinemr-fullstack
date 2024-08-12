import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import { AvailabilityType } from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";

export const useUserSchedulePut = (userId: number) => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (scheduleToPut: AvailabilityType) =>
      xanoPut(`/availability/${scheduleToPut.id}`, "staff", scheduleToPut),
    onMutate: async (scheduleToPut: AvailabilityType) => {
      await queryClient.cancelQueries({ queryKey: ["schedule", userId] });
      const previousSchedule: AvailabilityType | undefined =
        queryClient.getQueryData(["schedule", userId]);
      queryClient.setQueryData(["schedule", userId], scheduleToPut);
      return { previousSchedule };
    },
    onSuccess: () => {
      socket?.emit("message", { key: ["schedule", userId] });
      toast.success("Availability updated succesfully", { containerId: "A" });
    },

    onError: (error, variables, context) => {
      queryClient.setQueryData(["schedule", userId], context?.previousSchedule);
      toast.error(`Error: unable to update availability: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
