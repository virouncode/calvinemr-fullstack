import { useInfiniteQuery } from "@tanstack/react-query";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import { FaxContactType, XanoPaginatedType } from "../../../types/api";

export const useFaxDirectory = () => {
  return useInfiniteQuery<XanoPaginatedType<FaxContactType>>({
    queryKey: ["fax directory"],
    queryFn: ({ pageParam }) => {
      return xanoGet("/fax_directory", "staff", {
        page: pageParam,
      });
    },
    initialPageParam: 1,
    getNextPageParam: (prevData) => prevData.nextPage,
  });
};
