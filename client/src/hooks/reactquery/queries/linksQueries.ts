import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { PaginatedLinksType } from "../../../types/api";

export const useLinks = (staffId: number, search: string) => {
  return useInfiniteQuery({
    queryKey: ["links", staffId, search],
    queryFn: ({ pageParam }): Promise<PaginatedLinksType> =>
      xanoGet("/links_of_staff", "staff", {
        staff_id: staffId,
        search,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
