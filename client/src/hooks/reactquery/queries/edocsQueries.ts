import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { EdocType, XanoPaginatedType } from "../../../types/api";

export const useEdocs = (search: string) => {
  return useInfiniteQuery<XanoPaginatedType<EdocType>>({
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
