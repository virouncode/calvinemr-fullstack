import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { xanoDelete } from "../../../api/xanoCRUD/xanoDelete";
import { xanoPost } from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import {
  LabLinkCredentialsType,
  LabLinkPersonalType,
} from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";

export const useLabLinksCredentialsPost = (staffId: number) => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentialsToPost: Partial<LabLinkCredentialsType>) =>
      xanoPost("/lablinks_credentials", "staff", credentialsToPost),
    onMutate: async (credentialsToPost: Partial<LabLinkCredentialsType>) => {
      await queryClient.cancelQueries({
        queryKey: ["labLinksCredentials", staffId],
      });
      const previousCredentials = queryClient.getQueryData([
        "labLinksCredentials",
        staffId,
      ]);
      queryClient.setQueryData(
        ["labLinksCredentials", staffId],
        (old: LabLinkCredentialsType[]) => [...old, credentialsToPost]
      );
      return { previousCredentials };
    },
    onSuccess: () => {
      socket?.emit("message", { key: ["labLinksCredentials", staffId] });
      toast.success("Credentials post succesfully", { containerId: "A" });
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        ["labLinksCredentials", staffId],
        context?.previousCredentials
      );
      toast.error(`Error: unable to post credentials: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useLabLinksCredentialsPut = (staffId: number) => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentialsToPut: LabLinkCredentialsType) =>
      xanoPut(
        `/lablinks_credentials/${credentialsToPut.id}`,
        "staff",
        credentialsToPut
      ),
    onMutate: async (credentialsToPut: LabLinkCredentialsType) => {
      await queryClient.cancelQueries({
        queryKey: ["labLinksCredentials", staffId],
      });
      const previousCredentials = queryClient.getQueryData([
        "labLinksCredentials",
        staffId,
      ]);
      queryClient.setQueryData(
        ["labLinksCredentials", staffId],
        (old: LabLinkCredentialsType[]) =>
          old.map((item) =>
            item.id === credentialsToPut.id ? credentialsToPut : item
          )
      );
      return { previousCredentials };
    },
    onSuccess: () => {
      socket?.emit("message", { key: ["labLinksCredentials", staffId] });
      toast.success("Credentials updated succesfully", { containerId: "A" });
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(
        ["labLinksCredentials", staffId],
        context?.previousCredentials
      );
      toast.error(`Error: unable to update credentials: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useLabLinksPersonalPost = (staffId: number) => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (labLinkPersonalToPost: Partial<LabLinkPersonalType>) =>
      xanoPost("/lablinks_personal", "staff", labLinkPersonalToPost),
    onSuccess: () => {
      socket?.emit("message", { key: ["labLinksPersonal", staffId] });
      toast.success("Personal link post succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to post personal link: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
export const useLabLinksPersonalPut = (staffId: number) => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (labLinkPersonalToPut: LabLinkPersonalType) =>
      xanoPut(
        `/lablinks_personal/${labLinkPersonalToPut.id}`,
        "staff",
        labLinkPersonalToPut
      ),
    onSuccess: () => {
      socket?.emit("message", { key: ["labLinksPersonal", staffId] });
      toast.success("Personal link updated succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to update personal link: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useLabLinksPersonalDelete = (staffId: number) => {
  const { socket } = useSocketContext();
  return useMutation({
    mutationFn: (labLinkPersonalToDeleteId: number) =>
      xanoDelete(`/lablinks_personal/${labLinkPersonalToDeleteId}`, "staff"),
    onSuccess: () => {
      socket?.emit("message", { key: ["labLinksPersonal", staffId] });
      toast.success("Personal link deleted succesfully", { containerId: "A" });
    },
    onError: (error) => {
      toast.error(`Error: unable to delete personal link: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
