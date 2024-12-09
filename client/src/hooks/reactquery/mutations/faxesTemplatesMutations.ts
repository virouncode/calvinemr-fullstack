import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { xanoDelete } from "../../../api/xanoCRUD/xanoDelete";
import { xanoPost } from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import { FaxTemplateType } from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";

export const useFaxTemplatePost = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateToPost: Partial<FaxTemplateType>) =>
      xanoPost("/faxes_templates", "staff", templateToPost),
    onSuccess: () => {
      socket?.emit("message", { key: ["faxesTemplates"] });
      socket?.emit("message", { key: ["faxesFavoritesTemplates"] });
      toast.success("Template post succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to post template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useFaxTemplatePut = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateToPut: FaxTemplateType) =>
      xanoPut(`/faxes_templates/${templateToPut.id}`, "staff", templateToPut),
    onSuccess: () => {
      socket?.emit("message", { key: ["faxesTemplates"] });
      socket?.emit("message", { key: ["faxesFavoritesTemplates"] });
      toast.success("Template updated succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to update template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useFaxTemplateDelete = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateIdToDelete: number) =>
      xanoDelete(`/faxes_templates/${templateIdToDelete}`, "staff"),

    onSuccess: () => {
      socket?.emit("message", { key: ["faxesTemplates"] });
      socket?.emit("message", { key: ["faxesFavoritesTemplates"] });
      toast.success("Template deleted succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
