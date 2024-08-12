import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { PaginatedFaxContactsType } from "../../../types/api";

export const useFaxDirectory = () => {
  return useInfiniteQuery({
    queryKey: ["fax directory"],
    queryFn: ({ pageParam }): Promise<PaginatedFaxContactsType> => {
      return xanoGet("/fax_directory", "staff", {
        page: pageParam,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
