import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import { NotepadType } from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";

export const useNotepadPut = (staffId: number) => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (notepadToPut: NotepadType) =>
      xanoPut(`/notepads/${notepadToPut.id}`, "staff", notepadToPut),
    onSuccess: () => {
      socket?.emit("message", { key: ["notepads", staffId] });
    },
    onError: (error) => {
      toast.error(`Error: unable to update notepad: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
