import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { SiteType } from "../../../types/api";
import useUserContext from "../../context/useUserContext";

export const useSites = () => {
  const { user } = useUserContext();
  return useQuery<SiteType[]>({
    queryKey: ["sites"],
    queryFn: () => {
      if (user?.access_level === "staff") return xanoGet("/sites", "staff");
      else return xanoGet("/sites", "admin");
    },
  });
};
