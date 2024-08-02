import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import useUserContext from "../../context/useUserContext";

export const usePamphlets = (search) => {
  const { user } = useUserContext();
  return useInfiniteQuery({
    queryKey: ["pamphlets", search],
    queryFn: ({ pageParam }) => {
      if (user.access_level === "staff")
        return xanoGet("/pamphlets", "staff", {
          search,
          page: pageParam,
        });
      else {
        return xanoGet("/pamphlets", "patient", {
          search,
          page: pageParam,
        });
      }
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
