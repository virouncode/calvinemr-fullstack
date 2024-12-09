import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { xanoDelete } from "../../../api/xanoCRUD/xanoDelete";
import { xanoPost } from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import { CalvinAITemplateType } from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";

export const useCalvinAITemplatePost = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateToPost: Partial<CalvinAITemplateType>) =>
      xanoPost("/calvinai_templates", "staff", templateToPost),
    onSuccess: () => {
      socket?.emit("message", { key: ["calvinaiTemplates"] });
      socket?.emit("message", { key: ["calvinaiFavoritesTemplates"] });
      toast.success("Template post succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to post template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useCalvinAITemplatePut = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateToPut: CalvinAITemplateType) =>
      xanoPut(
        `/calvinai_templates/${templateToPut.id}`,
        "staff",
        templateToPut
      ),
    onSuccess: () => {
      socket?.emit("message", { key: ["calvinaiTemplates"] });
      socket?.emit("message", { key: ["calvinaiFavoritesTemplates"] });
      toast.success("Template updated succesfully", { containerId: "A" });
    },

    onError: (error) => {
      toast.error(`Error: unable to update template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useCalvinAITemplateDelete = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateIdToDelete: number) =>
      xanoDelete(`/calvinai_templates/${templateIdToDelete}`, "staff"),
    onSuccess: () => {
      socket?.emit("message", { key: ["calvinaiTemplates"] });
      socket?.emit("message", { key: ["calvinaiFavoritesTemplates"] });
      toast.success("Template deleted succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
