import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { AdminType, BillingType, XanoPaginatedType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import useUserContext from "../../context/useUserContext";

export const useBillings = (
  rangeStart: number,
  rangeEnd: number,
  search: string
) => {
  const { user } = useUserContext() as { user: UserStaffType | AdminType };

  return useInfiniteQuery<XanoPaginatedType<BillingType>>({
    queryKey: ["billings", rangeStart, rangeEnd, search],
    queryFn: ({ pageParam }) => {
      if (user.access_level === "admin") {
        return xanoGet("/billings_in_range_search", "admin", {
          range_start: rangeStart,
          range_end: rangeEnd,
          page: pageParam,
          search,
        });
      } else {
        return xanoGet("/billings_in_range_search", "staff", {
          range_start: rangeStart,
          range_end: rangeEnd,
          page: pageParam,
          search,
        });
      }
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
