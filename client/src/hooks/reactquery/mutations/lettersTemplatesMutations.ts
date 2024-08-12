import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import xanoDelete from "../../../api/xanoCRUD/xanoDelete";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import { LetterTemplateType } from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";

export const useLettersTemplatePost = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateToPost: LetterTemplateType) =>
      xanoPost("/letters_templates", "staff", templateToPost),
    onSuccess: () => {
      socket?.emit("message", { key: ["lettersTemplates"] });
      toast.success("Template post succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to post template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useLettersTemplatePut = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateToPut: LetterTemplateType) =>
      xanoPut(`/letters_templates/${templateToPut.id}`, "staff", templateToPut),
    onSuccess: () => {
      socket?.emit("message", { key: ["lettersTemplates"] });
      toast.success("Template updated succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to update template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useLettersTemplateDelete = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateIdToDelete: number) =>
      xanoDelete(`/letters_templates/${templateIdToDelete}`, "staff"),
    onSuccess: () => {
      socket?.emit("message", { key: ["lettersTemplates"] });
      toast.success("Template deleted succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
