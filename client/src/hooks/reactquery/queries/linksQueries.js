import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";

export const useLinks = (staffId, search) => {
  return useInfiniteQuery({
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
