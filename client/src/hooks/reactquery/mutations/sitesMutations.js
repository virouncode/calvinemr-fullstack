import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../context/useSocketContext";

export const useSitesPost = () => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (siteToPost) => xanoPost("/sites", "admin", siteToPost),
    onMutate: async (siteToPost) => {
      await queryClient.cancelQueries({
        queryKey: ["sites"],
      });
      const previousSites = queryClient.getQueryData(["sites"]);
      queryClient.setQueryData(["sites"], (old) => [...old, siteToPost]);
      return { previousSites };
    },
    onSuccess: () => {
      socket.emit("message", { key: ["sites"] });
      toast.success("Site post succesfully", { containerId: "A" });
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["sites"], context.previousSites);
      toast.error(`Error: unable to post site: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};

export const useSitesPut = () => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (siteToPut) =>
      xanoPut(`/sites/${siteToPut.id}`, "admin", siteToPut),
    onMutate: async (siteToPut) => {
      await queryClient.cancelQueries({
        queryKey: ["sites"],
      });
      const previousSites = queryClient.getQueryData(["sites"]);
      queryClient.setQueryData(["sites"], (old) =>
        old.map((item) => (item.id === siteToPut.id ? siteToPut : item))
      );
      return { previousSites };
    },
    onSuccess: () => {
      socket.emit("message", { key: ["sites"] });
      toast.success("Site updated succesfully", { containerId: "A" });
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["sites"], context.previousSites);
      toast.error(`Error: unable to update site: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
