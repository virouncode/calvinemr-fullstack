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
    queryKey:
      user.title !== "Secretary" && user.access_level !== "admin"
        ? ["billings", user.id, rangeStart, rangeEnd, search]
        : ["billings", rangeStart, rangeEnd, search],
    queryFn: ({ pageParam }) => {
      if (user.title !== "Secretary" && user.access_level !== "admin") {
        return xanoGet("/billings_of_staff_in_range_search", "staff", {
          staff_id: user.id,
          range_start: rangeStart,
          range_end: rangeEnd,
          page: pageParam,
          search,
        });
      } else if (user.title === "Secretary") {
        return xanoGet("/billings_in_range_search", "staff", {
          range_start: rangeStart,
          range_end: rangeEnd,
          page: pageParam,
          search,
        });
      } else if (user.access_level === "admin") {
        return xanoGet("/billings_in_range_search", "admin", {
          range_start: rangeStart,
          range_end: rangeEnd,
          page: pageParam,
          search,
        });
      }
      // Explicitly handle unexpected cases
      throw new Error("Unexpected user role. Cannot fetch billings.");
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
