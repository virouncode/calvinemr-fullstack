import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";

export const useLabLinks = () => {
  return useQuery({
    queryKey: ["labLinks"],
    queryFn: () => xanoGet("/lablinks", "staff"),
  });
};
export const useLabLinksPersonal = (staffId, search) => {
  return useInfiniteQuery({
    queryKey: ["labLinksPersonal", staffId, search],
    queryFn: ({ pageParam }) =>
      xanoGet("/lablinks_personal_of_staff", "staff", {
        staff_id: staffId,
        search,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};

export const useLabLinksCredentials = (staffId) => {
  return useQuery({
    queryKey: ["labLinksCredentials", staffId],
    queryFn: () =>
      xanoGet("/lablinks_credentials_of_staff", "staff", { staff_id: staffId }),
  });
};
