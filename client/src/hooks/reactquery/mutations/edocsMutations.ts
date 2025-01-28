import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { xanoDelete } from "../../../api/xanoCRUD/xanoDelete";
import { xanoPost } from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import { EdocType } from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";

export const useEdocPost = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (edocToPost: Partial<EdocType>) =>
      xanoPost("/edocs", "staff", edocToPost),
    onSuccess: () => {
      socket?.emit("message", { key: ["edocs"] });
      socket?.emit("message", { key: ["patientRecord"] });
      toast.success("E-doc post succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to post e-doc: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useEdocPut = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (edocToPut: EdocType) =>
      xanoPut(`/edocs/${edocToPut.id}`, "staff", edocToPut),
    onSuccess: () => {
      socket?.emit("message", { key: ["edocs"] });
      toast.success("E-doc updated succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to update e-doc: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useEdocDelete = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (edocToDeleteId: number) =>
      xanoDelete(`/edocs/${edocToDeleteId}`, "staff"),
    onSuccess: () => {
      socket?.emit("message", { key: ["edocs"] });
      toast.success("E-doc deleted succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete e-doc: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
