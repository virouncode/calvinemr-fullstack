import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { AdminType, BillingType, PaginatedDatasType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import useUserContext from "../../context/useUserContext";

export const useBillings = (rangeStart: number, rangeEnd: number) => {
  const { user } = useUserContext() as { user: UserStaffType | AdminType };

  return useInfiniteQuery({
    queryKey:
      user.title !== "Secretary" && user.access_level !== "admin"
        ? ["billings", user.id, rangeStart, rangeEnd]
        : ["billings", rangeStart, rangeEnd],
    queryFn: ({ pageParam }): Promise<PaginatedDatasType<BillingType>> => {
      if (user.title !== "Secretary" && user.access_level !== "admin") {
        return xanoGet("/billings_of_staff_in_range", "staff", {
          staff_id: user.id,
          range_start: rangeStart,
          range_end: rangeEnd,
          page: pageParam,
        });
      } else if (user.title === "Secretary") {
        return xanoGet("/billings_in_range", "staff", {
          range_start: rangeStart,
          range_end: rangeEnd,
          page: pageParam,
        });
      } else if (user.access_level === "admin") {
        return xanoGet("/billings_in_range", "admin", {
          range_start: rangeStart,
          range_end: rangeEnd,
          page: pageParam,
        });
      }
      // Explicitly handle unexpected cases
      throw new Error("Unexpected user role. Cannot fetch billings.");
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
