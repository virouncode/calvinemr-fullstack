import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import xanoDelete from "../../../api/xanoCRUD/xanoDelete";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import {
  MessageExternalTemplateType,
  MessageTemplateType,
  TodoTemplateType,
} from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";

export const useMessagesTemplatePost = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateToPost: Partial<MessageTemplateType>) =>
      xanoPost("/messages_templates", "staff", templateToPost),
    onSuccess: () => {
      socket?.emit("message", { key: ["messagesTemplates"] });
      toast.success("Template post succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to post template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useMessagesTemplatePut = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateToPut: MessageTemplateType) =>
      xanoPut(
        `/messages_templates/${templateToPut.id}`,
        "staff",
        templateToPut
      ),
    onSuccess: () => {
      socket?.emit("message", { key: ["messagesTemplates"] });
      toast.success("Template updated succesfully", { containerId: "A" });
    },

    onError: (error) => {
      toast.error(`Error: unable to update template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useMessagesTemplateDelete = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateIdToDelete: number) =>
      xanoDelete(`/messages_templates/${templateIdToDelete}`, "staff"),
    onSuccess: () => {
      socket?.emit("message", { key: ["messagesTemplates"] });
      toast.success("Template deleted succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useMessagesExternalTemplatePost = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateToPost: Partial<MessageExternalTemplateType>) =>
      xanoPost("/messages_external_templates", "staff", templateToPost),
    onSuccess: () => {
      socket?.emit("message", { key: ["messagesExternalTemplates"] });
      toast.success("Template post succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to post template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useMessagesExternalTemplatePut = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateToPut: MessageExternalTemplateType) =>
      xanoPut(
        `/messages_external_templates/${templateToPut.id}`,
        "staff",
        templateToPut
      ),
    onSuccess: () => {
      socket?.emit("message", { key: ["messagesExternalTemplates"] });
      toast.success("Template updated succesfully", { containerId: "A" });
    },

    onError: (error) => {
      toast.error(`Error: unable to update template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useMessagesExternalTemplateDelete = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateIdToDelete: number) =>
      xanoDelete(`/messages_external_templates/${templateIdToDelete}`, "staff"),
    onSuccess: () => {
      socket?.emit("message", { key: ["messagesExternalTemplates"] });
      toast.success("Template deleted succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useTodosTemplatePost = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateToPost: Partial<TodoTemplateType>) =>
      xanoPost("/todos_templates", "staff", templateToPost),
    onSuccess: () => {
      socket?.emit("message", { key: ["todosTemplates"] });
      toast.success("Template post succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to post template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useTodosTemplatePut = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateToPut: TodoTemplateType) =>
      xanoPut(`/todos_templates/${templateToPut.id}`, "staff", templateToPut),
    onSuccess: () => {
      socket?.emit("message", { key: ["todosTemplates"] });
      toast.success("Template updated succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to update template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useTodosTemplateDelete = () => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (templateIdToDelete: number) =>
      xanoDelete(`/todos_templates/${templateIdToDelete}`, "staff"),
    onSuccess: () => {
      socket?.emit("message", { key: ["todosTemplates"] });
      toast.success("Template deleted succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete template: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
