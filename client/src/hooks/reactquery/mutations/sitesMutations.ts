import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { xanoPost } from "../../../api/xanoCRUD/xanoPost";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import { SiteType } from "../../../types/api";
import useSocketContext from "../../context/useSocketContext";

export const useSitesPost = () => {
  const { socket } = useSocketContext();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (siteToPost: Partial<SiteType>) =>
      xanoPost("/sites", "admin", siteToPost),
    onMutate: async (siteToPost: Partial<SiteType>) => {
      await queryClient.cancelQueries({
        queryKey: ["sites"],
      });
      const previousSites: SiteType[] | undefined = queryClient.getQueryData([
        "sites",
      ]);
      queryClient.setQueryData(["sites"], (old: SiteType[]) => [
        ...old,
        siteToPost,
      ]);
      return { previousSites };
    },
    onSuccess: () => {
      socket?.emit("message", { key: ["sites"] });
      toast.success("Site post succesfully", { containerId: "A" });
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["sites"], context?.previousSites);
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
    mutationFn: (siteToPut: SiteType) =>
      xanoPut(`/sites/${siteToPut.id}`, "admin", siteToPut),
    onMutate: async (siteToPut: SiteType) => {
      await queryClient.cancelQueries({
        queryKey: ["sites"],
      });
      const previousSites: SiteType[] | undefined = queryClient.getQueryData([
        "sites",
      ]);
      queryClient.setQueryData(["sites"], (old: SiteType[]) =>
        old.map((item) => (item.id === siteToPut.id ? siteToPut : item))
      );
      return { previousSites };
    },
    onSuccess: () => {
      socket?.emit("message", { key: ["sites"] });
      toast.success("Site updated succesfully", { containerId: "A" });
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData(["sites"], context?.previousSites);
      toast.error(`Error: unable to update site: ${error.message}`, {
        containerId: "A",
      });
    },
  });
};
