import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../context/useSocketContext";

export const usePatientPut = (patientId) => {
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (demographicsToPut) =>
      xanoPut(
        `/demographics/${demographicsToPut.id}`,
        "staff",
        demographicsToPut
      ),
    onMutate: async (demographicsToPut) => {
      await queryClient.cancelQueries({ queryKey: ["patient", patientId] });
      const previousDemographics = queryClient.getQueryData([
        "patient",
        patientId,
      ]);
      queryClient.setQueryData(["patient", patientId], demographicsToPut);
      return { previousDemographics };
    },
    onSuccess: () => {
      socket.emit("message", { key: ["patient", patientId] });
      socket.emit("message", { key: ["patients"] });
      toast.success("Demographics updated succesfully", { containerId: "A" });
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        ["patient", patientId],
        context.previousDemographics
      );
      toast.error(`Error: unable to update demographics: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const usePatientPost = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (demographicsToPost) =>
      xanoPost(`/demographics`, "staff", demographicsToPost),
    onSuccess: () => {
      socket.emit("message", { key: ["patients"] });
    },
  });
};
