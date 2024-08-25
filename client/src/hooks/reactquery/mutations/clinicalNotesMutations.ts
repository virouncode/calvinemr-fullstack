import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import { ClinicalNoteLogType, ClinicalNoteType } from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";

export const useClinicalNotePost = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (clinicalNoteToPost: Partial<ClinicalNoteType>) =>
      xanoPost("/clinical_notes", "staff", clinicalNoteToPost),
    onSuccess: (data) => {
      socket?.emit("message", {
        key: ["clinicalNotes", data.patient_id],
      });
      toast.success("Clinical note post succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to post clinical note: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useClinicalNoteLogPost = (patientId: number) => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (clinicalNoteLogToPost: Partial<ClinicalNoteLogType>) =>
      xanoPost("/clinical_notes_log", "staff", clinicalNoteLogToPost),
    onSuccess: () => {
      socket?.emit("message", {
        key: ["clinicalNotes", patientId],
      });
    },
  });
};

export const useClinicalNotePut = (patientId: number) => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (clinicalNoteToPut: ClinicalNoteType) =>
      xanoPut(
        `/clinical_notes/${clinicalNoteToPut.id}`,
        "staff",
        clinicalNoteToPut
      ),
    onSuccess: () => {
      socket?.emit("message", { key: ["clinicalNotes", patientId] });
      toast.success("Clinical note updated succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to update clinical note: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
