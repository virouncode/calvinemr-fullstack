import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";

export const useEdocs = (search) => {
  return useInfiniteQuery({
    queryKey: ["edocs", search],
    queryFn: ({ pageParam }) =>
      xanoGet("/edocs", "staff", {
        search,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
