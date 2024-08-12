import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { PaginatedEdocsType } from "../../../types/api";

export const useEdocs = (search) => {
  return useInfiniteQuery({
    queryKey: ["edocs", search],
    queryFn: ({ pageParam }): Promise<PaginatedEdocsType> =>
      xanoGet("/edocs", "staff", {
        search,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
