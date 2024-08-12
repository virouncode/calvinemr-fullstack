import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import xanoDelete from "../../../api/xanoCRUD/xanoDelete";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import { MedTemplateType } from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";

export const useMedsTemplatePost = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateToPost: MedTemplateType) =>
      xanoPost("/medications_templates", "staff", templateToPost),
    onSuccess: () => {
      socket?.emit("message", { key: ["medsTemplates"] });
      toast.success("Template post succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to post template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useMedsTemplatePut = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateToPut: MedTemplateType) =>
      xanoPut(
        `/medications_templates/${templateToPut.id}`,
        "staff",
        templateToPut
      ),
    onSuccess: () => {
      socket?.emit("message", { key: ["medsTemplates"] });
      toast.success("Template updated succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to update template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useMedsTemplateDelete = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateIdToDelete: number) =>
      xanoDelete(`/medications_templates/${templateIdToDelete}`, "staff"),

    onSuccess: () => {
      socket?.emit("message", { key: ["medsTemplates"] });
      toast.success("Template deleted succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
