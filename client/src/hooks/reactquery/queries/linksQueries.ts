import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { LinkType, XanoPaginatedType } from "../../../types/api";

export const useLinks = (staffId: number, search: string) => {
  return useInfiniteQuery<XanoPaginatedType<LinkType>>({
    queryKey: ["links", staffId, search],
    queryFn: ({ pageParam }) =>
      xanoGet("/links_of_staff", "staff", {
        staff_id: staffId,
        search,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
