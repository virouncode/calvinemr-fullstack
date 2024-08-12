import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import xanoDelete from "../../../api/xanoCRUD/xanoDelete";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import { LinkType } from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";

export const useLinkPost = (staffId: number) => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (linkToPost: LinkType) =>
      xanoPost("/links", "staff", linkToPost),
    onSuccess: () => {
      socket?.emit("message", { key: ["links", staffId] });
      toast.success("Link post succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to post link: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useLinkPut = (staffId: number) => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (linkToPut: LinkType) =>
      xanoPut(`/links/${linkToPut.id}`, "staff", linkToPut),
    onSuccess: () => {
      socket?.emit("message", { key: ["links", staffId] });
      toast.success("Link updated succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to update link: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useLinkDelete = (staffId: number) => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (linkToDeleteId: number) =>
      xanoDelete(`/links/${linkToDeleteId}`, "staff"),
    onSuccess: () => {
      socket?.emit("message", { key: ["links", staffId] });
      toast.success("Link deleted succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete link: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
