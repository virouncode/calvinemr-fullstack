import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { LogType, XanoPaginatedType } from "../../../types/api";

export const useLogs = (
  search: string,
  rangeStart: number,
  rangeEnd: number
) => {
  return useInfiniteQuery<XanoPaginatedType<LogType>>({
    queryKey: ["logs", search, rangeStart, rangeEnd],
    queryFn: ({ pageParam }) => {
      return xanoGet("/logs", "admin", {
        search: search,
        range_start: rangeStart,
        range_end: rangeEnd,
        page: pageParam,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
