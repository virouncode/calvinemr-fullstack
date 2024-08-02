import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import xanoDelete from "../../../api/xanoCRUD/xanoDelete";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../context/useSocketContext";

export const useLinkPost = (staffId) => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (linkToPost) => xanoPost("/links", "staff", linkToPost),
    onSuccess: () => {
      socket.emit("message", { key: ["links", staffId] });
      toast.success("Link post succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to post link: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useLinkPut = (staffId) => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (linkToPut) =>
      xanoPut(`/links/${linkToPut.id}`, "staff", linkToPut),
    onSuccess: () => {
      socket.emit("message", { key: ["links", staffId] });
      toast.success("Link updated succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to update link: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useLinkDelete = (staffId) => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (linkToDeleteId) =>
      xanoDelete(`/links/${linkToDeleteId}`, "staff"),
    onSuccess: () => {
      socket.emit("message", { key: ["links", staffId] });
      toast.success("Link deleted succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete link: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
