import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../context/useSocketContext";

export const useNotepadPut = (staffId) => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (notepadToPut) =>
      xanoPut(`/notepads/${notepadToPut.id}`, "staff", notepadToPut),
    onSuccess: () => {
      socket.emit("message", { key: ["notepads", staffId] });
    },
    onError: (error, variables, context) => {
      toast.error(`Error: unable to update notepad: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
