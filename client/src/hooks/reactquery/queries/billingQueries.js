import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import useUserContext from "../../context/useUserContext";

export const useBillings = (rangeStart, rangeEnd) => {
  const { user } = useUserContext();
  return useInfiniteQuery({
    queryKey:
      user.title !== "Secretary" && user.access_level !== "admin"
        ? ["billings", user.id, rangeStart, rangeEnd]
        : ["billings", rangeStart, rangeEnd],
    queryFn: ({ pageParam }) => {
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
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
