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
    onSuccess: () => {
      socket?.emit("message", { key: ["groups", staffId] });
      socket?.emit("message", { key: ["clinic groups"] });
      socket?.emit("message", { key: ["GROUPS"] });
      toast.success("Group updated succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to update group: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const usePatientsGroupDelete = (staffId: number) => {
  const queryClient = useQueryClient();
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (groupIdToDelete: number) =>
      xanoDelete(`/groups/${groupIdToDelete}`, "staff"),
    onSuccess: () => {
      socket?.emit("message", { key: ["groups", staffId] });
      socket?.emit("message", { key: ["GROUPS"] });
      socket?.emit("message", { key: ["clinic groups"] });
      toast.success("Group deleted succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete group: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
