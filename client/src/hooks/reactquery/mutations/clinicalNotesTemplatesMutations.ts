import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { xanoDelete } from "../../../api/xanoCRUD/xanoDelete";
import { xanoPost } from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import { ClinicalNoteTemplateType } from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";

export const useClinicalNotesTemplatesPost = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateToPost: Partial<ClinicalNoteTemplateType>) =>
      xanoPost("/clinical_notes_templates", "staff", templateToPost),
    onSuccess: () => {
      socket?.emit("message", { key: ["clinicalNotesTemplates"] });
      socket?.emit("message", { key: ["clinicalNotesFavoritesTemplates"] });
      toast.success("Template post succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to post template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useClinicalNotesTemplatesPut = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateToPut: ClinicalNoteTemplateType) =>
      xanoPut(
        `/clinical_notes_templates/${templateToPut.id}`,
        "staff",
        templateToPut
      ),
    onSuccess: () => {
      socket?.emit("message", { key: ["clinicalNotesTemplates"] });
      socket?.emit("message", { key: ["clinicalNotesFavoritesTemplates"] });
      toast.success("Template updated succesfully", { containerId: "A" });
    },

    onError: (error) => {
      toast.error(`Error: unable to update template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useClinicalNotesTemplatesDelete = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateIdToDelete: number) =>
      xanoDelete(`/clinical_notes_templates/${templateIdToDelete}`, "staff"),
    onSuccess: () => {
      socket?.emit("message", { key: ["clinicalNotesTemplates"] });
      socket?.emit("message", { key: ["clinicalNotesFavoritesTemplates"] });
      toast.success("Template deleted succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
