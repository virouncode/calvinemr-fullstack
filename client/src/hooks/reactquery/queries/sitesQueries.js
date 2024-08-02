import { useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import useUserContext from "../../context/useUserContext";

export const useSites = () => {
  const { user } = useUserContext();
  return useQuery({
    queryKey: ["sites"],
    queryFn: () => {
      if (user.access_level === "staff") return xanoGet("/sites", "staff");
      else return xanoGet("/sites", "admin");
    },
  });
};
