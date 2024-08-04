import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import xanoDelete from "../../../api/xanoCRUD/xanoDelete";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../context/useSocketContext";

export const usePatientsGroupPost = (staffId) => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (groupToPost) => xanoPost("/groups", "staff", groupToPost),
    onSuccess: () => {
      socket.emit("message", { key: ["groups", staffId] });
      socket.emit("message", { key: ["clinic groups"] });
      socket.emit("message", { key: ["GROUPS"] });
      toast.success("Group saved succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to post group: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const usePatientsGroupPut = (staffId) => {
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (groupToPut) =>
      xanoPut(`/groups/${groupToPut.id}`, "staff", groupToPut),
    onMutate: async (groupToPut) => {
      await queryClient.cancelQueries({ queryKey: ["groups", staffId] });
      for (let patientId of groupToPut.patients) {
        await queryClient.cancelQueries({ queryKey: ["GROUPS", patientId] });
      }
      const previousGroups = queryClient.getQueryData(["groups", staffId]);
      queryClient.setQueryData(["groups", staffId], (oldData) =>
        oldData.filter((item) =>
          item.id === groupToPut.id ? groupToPut : item
        )
      );
      return { previousGroups };
    },
    onSuccess: () => {
      socket.emit("message", { key: ["groups", staffId] });
      socket.emit("message", { key: ["clinic groups"] });
      socket.emit("message", { key: ["GROUPS"] });
      toast.success("Group updated succesfully", { containerId: "A" });
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["groups", staffId], context.previousGroups);
      toast.error(`Error: unable to update group: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const usePatientsGroupDelete = (staffId) => {
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (groupIdToDelete) =>
      xanoDelete(`/groups/${groupIdToDelete}`, "staff"),
    onMutate: async (groupIdToDelete) => {
      await queryClient.cancelQueries({ queryKey: ["groups", staffId] });
      const previousGroups = queryClient.getQueryData(["groups", staffId]);
      queryClient.setQueryData(["groups", staffId], (oldData) =>
        oldData.filter((item) => item.id !== groupIdToDelete)
      );
      return { previousGroups };
    },
    onSuccess: () => {
      socket.emit("message", { key: ["groups", staffId] });
      socket.emit("message", { key: ["GROUPS"] });
      socket.emit("message", { key: ["clinic groups"] });
      toast.success("Group deleted succesfully", { containerId: "A" });
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["groups", staffId], context.previousGroups);
      toast.error(`Error: unable to delete group: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
