import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { xanoDelete } from "../../../api/xanoCRUD/xanoDelete";
import { xanoPost } from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import { GroupType } from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";

export const usePatientsGroupPost = (staffId: number) => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (groupToPost: Partial<GroupType>) =>
      xanoPost("/groups", "staff", groupToPost),
    onSuccess: () => {
      socket?.emit("message", { key: ["groups", staffId] });
      socket?.emit("message", { key: ["clinic groups"] });
      socket?.emit("message", { key: ["GROUPS"] });
      socket?.emit("message", { key: ["patientRecord"] });
      toast.success("Group saved succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to post group: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const usePatientsGroupPut = (staffId: number) => {
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (groupToPut: GroupType) =>
      xanoPut(`/groups/${groupToPut.id}`, "staff", groupToPut),
    // Doesn't work because for groupToPut patients is an array of numbers not an array of objects DemographicsType
    // onMutate: async (groupToPut: GroupType) => {
    //   await queryClient.cancelQueries({ queryKey: ["groups", staffId] });
    //   for (const patientId of groupToPut.patients) {
    //     await queryClient.cancelQueries({ queryKey: ["GROUPS", patientId] });
    //   }
    //   const previousGroups: GroupType[] | undefined = queryClient.getQueryData([
    //     "groups",
    //     staffId,
    //   ]);
    //   queryClient.setQueryData(["groups", staffId], (oldData: GroupType[]) => {
    //     console.log("oldData", oldData);
    //     console.log("groupToPut", groupToPut);

    //     return oldData.map((item) =>
    //       item.id === groupToPut.id ? groupToPut : item
    //     );
    //   });
    //   return { previousGroups };
    // },
    onSuccess: () => {
      socket?.emit("message", { key: ["groups", staffId] });
      socket?.emit("message", { key: ["clinic groups"] });
      socket?.emit("message", { key: ["GROUPS"] });
      toast.success("Group updated succesfully", { containerId: "A" });
    },
    onError: (error, variables, context) => {
      // queryClient.setQueryData(["groups", staffId], context?.previousGroups);
      toast.error(`Error: unable to update group: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const usePatientsGroupDelete = (staffId: number) => {
  // const queryClient = useQueryClient();
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (groupIdToDelete: number) =>
      xanoDelete(`/groups/${groupIdToDelete}`, "staff"),
    // onMutate: async (groupIdToDelete) => {
    //   await queryClient.cancelQueries({ queryKey: ["groups", staffId] });
    //   const previousGroups: GroupType[] | undefined = queryClient.getQueryData([
    //     "groups",
    //     staffId,
    //   ]);
    //   queryClient.setQueryData(["groups", staffId], (oldData: GroupType[]) =>
    //     oldData.filter((item) => item.id !== groupIdToDelete)
    //   );
    //   return { previousGroups };
    // },
    onSuccess: () => {
      socket?.emit("message", { key: ["groups", staffId] });
      socket?.emit("message", { key: ["GROUPS"] });
      socket?.emit("message", { key: ["clinic groups"] });
      toast.success("Group deleted succesfully", { containerId: "A" });
    },
    onError: (error) => {
      // queryClient.setQueryData(["groups", staffId], context?.previousGroups);
      toast.error(`Error: unable to delete group: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
