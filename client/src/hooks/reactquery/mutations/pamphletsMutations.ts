import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import xanoDelete from "../../../api/xanoCRUD/xanoDelete";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import { PamphletType } from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";

export const usePamphletPost = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (pamphletToPost: PamphletType) =>
      xanoPost("/pamphlets", "staff", pamphletToPost),
    onSuccess: () => {
      socket?.emit("message", { key: ["pamphlets"] });
      toast.success("Pamphlet post succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to post pamphlet: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const usePamphletPut = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (pamphletToPut: PamphletType) =>
      xanoPut(`/pamphlets/${pamphletToPut.id}`, "staff", pamphletToPut),
    onSuccess: () => {
      socket?.emit("message", { key: ["pamphlets"] });
      toast.success("Pamphlet updated succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to update pamphlet: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const usePamphletDelete = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (pamphletToDeleteId: number) =>
      xanoDelete(`/pamphlets/${pamphletToDeleteId}`, "staff"),
    onSuccess: () => {
      socket?.emit("message", { key: ["pamphlets"] });
      toast.success("Pamphlet deleted succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete pamphlet: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
