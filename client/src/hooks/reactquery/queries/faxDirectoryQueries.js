import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";

export const useFaxDirectory = () => {
  return useInfiniteQuery({
    queryKey: ["fax directory"],
    queryFn: ({ pageParam }) => {
      return xanoGet("/fax_directory", "staff", {
        page: pageParam,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
